"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestDecodingPlugin = void 0;
const abstract_plugin_1 = require("../abstract.plugin");
const decoder = require('./decoder');
class TestDecodingPlugin extends abstract_plugin_1.AbstractPlugin {
    constructor(options) {
        super(options || {});
    }
    get name() {
        return 'test_decoding';
    }
    async start(client, slotName, lastLsn) {
        const options = [
            `"include-xids" '${this.options.includeXids === true ? 'on' : 'off'}'`,
            `"include-timestamp" '${this.options.includeTimestamp === true ? 'on' : 'off'}'`,
        ];
        if (this.options.skipEmptyXacts)
            options.push(`"skip-empty-xacts" 'on'`);
        if (this.options.includeRewrites)
            options.push(`"include-rewrites" 'on'`);
        if (this.options.includeSequences)
            options.push(`"include-sequences" 'on'`);
        if (this.options.streamChanges)
            options.push(`"stream-changes" 'on'`);
        const sql = `START_REPLICATION SLOT "${slotName}" LOGICAL ${lastLsn} (${options.join(' , ')})`;
        return client.query(sql);
    }
    parse(buffer) {
        return decoder.parse(buffer.toString(), {});
    }
}
exports.TestDecodingPlugin = TestDecodingPlugin;
