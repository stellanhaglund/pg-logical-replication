"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogicalReplicationService = void 0;
const eventemitter2_1 = __importDefault(require("eventemitter2"));
const pg_1 = require("pg");
class LogicalReplicationService extends eventemitter2_1.default {
    constructor(clientConfig, config) {
        super();
        this.clientConfig = clientConfig;
        this._lastLsn = null;
        this._client = null;
        this._connection = null;
        this._stop = true;
        this.lastStandbyStatusUpdatedTime = 0;
        this.checkStandbyStatusTimer = null;
        this.config = {
            acknowledge: {
                auto: true,
                timeoutSeconds: 10,
                ...(config?.acknowledge || {}),
            },
        };
    }
    lastLsn() {
        return this._lastLsn || '0/00000000';
    }
    async client() {
        await this.stop();
        this._client = new pg_1.Client({
            ...this.clientConfig,
            replication: 'database',
        });
        await this._client.connect();
        // @ts-ignore
        this._connection = this._client.connection;
        this._client.on('error', (e) => this.emit('error', e));
        return [this._client, this._connection];
    }
    isStop() {
        return this._stop;
    }
    async stop() {
        this._stop = true;
        this._connection?.removeAllListeners();
        this._connection = null;
        this._client?.removeAllListeners();
        await this._client?.end();
        this._client = null;
        this.checkStandbyStatus(false);
        return this;
    }
    /**
     * subscribe
     * @param plugin One of [TestDecodingPlugin, ]
     * @param slotName
     * @param uptoLsn
     */
    async subscribe(plugin, slotName, uptoLsn) {
        try {
            const [client, connection] = await this.client();
            this._lastLsn = uptoLsn || this._lastLsn;
            // check replicationStart
            connection.once('replicationStart', () => {
                this._stop = false;
                this.emit('start');
                this.checkStandbyStatus(true);
            });
            connection.on('copyData', ({ chunk: buffer }) => {
                if (buffer[0] != 0x77 && buffer[0] != 0x6b) {
                    console.warn('Unknown message', buffer[0]);
                    return;
                }
                const lsn = buffer.readUInt32BE(1).toString(16).toUpperCase() + '/' + buffer.readUInt32BE(5).toString(16).toUpperCase();
                if (buffer[0] == 0x77) {
                    // XLogData
                    plugin.parse(buffer.subarray(25), (data) => {
                        this.emit('data', lsn, data);
                    });
                    this._acknowledge(lsn);
                }
                else if (buffer[0] == 0x6b) {
                    // Primary keepalive message
                    const timestamp = Math.floor(buffer.readUInt32BE(9) * 4294967.296 + buffer.readUInt32BE(13) / 1000 + 946080000000);
                    const shouldRespond = buffer.readInt8(17);
                    this.emit('heartbeat', lsn, timestamp, shouldRespond);
                }
                this._lastLsn = lsn;
            });
            return plugin.start(client, slotName, this._lastLsn || '0/00000000');
        }
        catch (e) {
            await this.stop();
            this.emit('error', e);
            throw e;
        }
    }
    async _acknowledge(lsn) {
        if (!this.config.acknowledge.auto)
            return;
        this.emit('acknowledge', lsn);
        await this.acknowledge(lsn);
    }
    checkStandbyStatus(enable) {
        if (this.checkStandbyStatusTimer) {
            clearInterval(this.checkStandbyStatusTimer);
            this.checkStandbyStatusTimer = null;
        }
        if (this.config.acknowledge.timeoutSeconds > 0 && enable)
            this.checkStandbyStatusTimer = setInterval(async () => {
                if (this._stop)
                    return;
                if (this._lastLsn &&
                    Date.now() - this.lastStandbyStatusUpdatedTime > this.config.acknowledge.timeoutSeconds * 1000)
                    await this.acknowledge(this._lastLsn);
            }, 1000);
    }
    /**
     * @param lsn
     */
    async acknowledge(lsn) {
        if (this._stop)
            return false;
        this.lastStandbyStatusUpdatedTime = Date.now();
        const slice = lsn.split('/');
        let [upperWAL, lowerWAL] = [parseInt(slice[0], 16), parseInt(slice[1], 16)];
        // Timestamp as microseconds since midnight 2000-01-01
        const now = Date.now() - 946080000000;
        const upperTimestamp = Math.floor(now / 4294967.296);
        const lowerTimestamp = Math.floor(now - upperTimestamp * 4294967.296);
        if (lowerWAL === 4294967295) {
            // [0xff, 0xff, 0xff, 0xff]
            upperWAL = upperWAL + 1;
            lowerWAL = 0;
        }
        else {
            lowerWAL = lowerWAL + 1;
        }
        const response = Buffer.alloc(34);
        response.fill(0x72); // 'r'
        // Last WAL Byte + 1 received and written to disk locally
        response.writeUInt32BE(upperWAL, 1);
        response.writeUInt32BE(lowerWAL, 5);
        // Last WAL Byte + 1 flushed to disk in the standby
        response.writeUInt32BE(upperWAL, 9);
        response.writeUInt32BE(lowerWAL, 13);
        // Last WAL Byte + 1 applied in the standby
        response.writeUInt32BE(upperWAL, 17);
        response.writeUInt32BE(lowerWAL, 21);
        // Timestamp as microseconds since midnight 2000-01-01
        response.writeUInt32BE(upperTimestamp, 25);
        response.writeUInt32BE(lowerTimestamp, 29);
        // If 1, requests server to respond immediately - can be used to verify connectivity
        response.writeInt8(0, 33);
        // @ts-ignore
        this._connection?.sendCopyFromChunk(response);
        return true;
    }
}
exports.LogicalReplicationService = LogicalReplicationService;
