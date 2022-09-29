"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wal2JsonPlugin = void 0;
const abstract_plugin_1 = require("../abstract.plugin");
const wal2json_plugin_options_type_1 = require("./wal2json-plugin-options.type");
const Pick_1 = __importDefault(require("stream-json/filters/Pick"));
const StreamArray_1 = require("stream-json/streamers/StreamArray");
const stream_chain_1 = require("stream-chain");
const stream_1 = require("stream");
/**
 * wal2json
 * https://github.com/eulerto/wal2json
 */
class Wal2JsonPlugin extends abstract_plugin_1.AbstractPlugin {
    constructor(options) {
        super(options || {});
    }
    get name() {
        return 'wal2json';
    }
    async start(client, slotName, lastLsn) {
        const options = [];
        Object.entries(this.options).map(([key, value]) => {
            if (wal2json_plugin_options_type_1.StringOptionKeys.includes(key))
                options.push(`"${dashCase(key)}" '${value}'`);
            else
                options.push(`"${dashCase(key)}" '${value ? 'on' : 'off'}'`);
        });
        let sql = `START_REPLICATION SLOT "${slotName}" LOGICAL ${lastLsn}`;
        if (options.length > 0)
            sql += ` (${options.join(' , ')})`;
        // console.log(sql);
        return client.query(sql);
    }
    parse(buffer, cb) {
        // console.log(buffer.toString())
        // console.log('incoming buffer')
        let stream = stream_1.Readable.from(buffer);
        const pipeline = (0, stream_chain_1.chain)([
            stream,
            Pick_1.default.withParser({ filter: 'change' }),
            (0, StreamArray_1.streamArray)()
        ]);
        pipeline.on('data', (data) => {
            // console.log('returning data', data)
            // return data;
            cb(data);
        });
        // console.log(buffer.toString());
        // return JSON.parse(buffer.toString());
    }
}
exports.Wal2JsonPlugin = Wal2JsonPlugin;
function dashCase(str) {
    return (str || '').replace(/[A-Z]/g, (found) => '-' + found.toLowerCase());
}
