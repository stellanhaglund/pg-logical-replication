/// <reference types="node" />
import { AbstractPlugin } from '../abstract.plugin';
import { Client } from 'pg';
export interface TestDecodingPluginOptions {
    /**
     * include-xids: on/off
     */
    includeXids?: boolean;
    /**
     * include-timestamp: on/off
     */
    includeTimestamp?: boolean;
    /**
     * skip-empty-xacts: on/off
     */
    skipEmptyXacts?: boolean;
    /**
     * (pg.ver>=11) include-rewrites: on/off
     */
    includeRewrites?: boolean;
    /**
     * (pg.ver>=15) include-sequences: on/off
     */
    includeSequences?: boolean;
    /**
     * (pg.ver>=14) stream-changes: on/off
     */
    streamChanges?: boolean;
}
export declare class TestDecodingPlugin extends AbstractPlugin<TestDecodingPluginOptions> {
    constructor(options?: TestDecodingPluginOptions);
    get name(): string;
    start(client: Client, slotName: string, lastLsn: string): Promise<any>;
    parse(buffer: Buffer): any;
}
