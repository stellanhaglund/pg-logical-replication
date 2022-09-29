"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolBuffersPlugin = void 0;
const abstract_plugin_1 = require("../abstract.plugin");
const pg_logicaldec_proto_1 = __importDefault(require("./pg_logicaldec.proto"));
class ProtocolBuffersPlugin extends abstract_plugin_1.AbstractPlugin {
    constructor(options) {
        super(options || {});
        try {
            const protobufjs = require('protobufjs');
            this.proto = protobufjs.Root.fromJSON(pg_logicaldec_proto_1.default);
            this.rowMessage = this.proto.lookupType('RowMessage');
        }
        catch (e) {
            console.error(`To use decoderbufs decoder, you need to install protobufjs package.
https://github.com/protobufjs/protobuf.js`);
            throw e;
        }
    }
    get name() {
        return 'decoderbufs';
    }
    async start(client, slotName, lastLsn) {
        const options = [];
        let sql = `START_REPLICATION SLOT "${slotName}" LOGICAL ${lastLsn}`;
        if (options.length > 0)
            sql += ` (${options.join(' , ')})`;
        // console.log(sql);
        return client.query(sql);
    }
    parse(buffer) {
        return this.rowMessage.decode(buffer);
    }
}
exports.ProtocolBuffersPlugin = ProtocolBuffersPlugin;
