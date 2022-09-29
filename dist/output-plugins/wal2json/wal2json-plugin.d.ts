/// <reference types="node" />
import { AbstractPlugin } from '../abstract.plugin';
import { Client } from 'pg';
import { Wal2JsonPluginOptions } from './wal2json-plugin-options.type';
/**
 * wal2json
 * https://github.com/eulerto/wal2json
 */
export declare class Wal2JsonPlugin extends AbstractPlugin<Wal2JsonPluginOptions> {
    constructor(options?: Wal2JsonPluginOptions);
    get name(): string;
    start(client: Client, slotName: string, lastLsn: string): Promise<any>;
    parse(buffer: Buffer, cb: Function): any;
}
