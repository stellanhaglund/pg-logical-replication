/// <reference types="node" />
import { AbstractPlugin } from '../abstract.plugin';
import { Client } from 'pg';
export interface ProtocolBuffersPluginOptions {
}
export declare class ProtocolBuffersPlugin extends AbstractPlugin<ProtocolBuffersPluginOptions> {
    private proto;
    private rowMessage;
    constructor(options?: ProtocolBuffersPluginOptions);
    get name(): string;
    start(client: Client, slotName: string, lastLsn: string): Promise<any>;
    parse(buffer: Buffer): any;
}
