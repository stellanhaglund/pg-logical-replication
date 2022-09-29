import { AbstractPlugin } from '../abstract.plugin';
import { Client } from 'pg';
import { StringOptionKeys, Wal2JsonPluginOptions } from './wal2json-plugin-options.type';
import Pick from 'stream-json/filters/Pick'
import {streamArray} from 'stream-json/streamers/StreamArray'
import {chain} from 'stream-chain'
import {Readable} from 'stream'

/**
 * wal2json
 * https://github.com/eulerto/wal2json
 */
export class Wal2JsonPlugin extends AbstractPlugin<Wal2JsonPluginOptions> {
  constructor(options?: Wal2JsonPluginOptions) {
    super(options || {});
  }

  get name(): string {
    return 'wal2json';
  }

  async start(client: Client, slotName: string, lastLsn: string): Promise<any> {
    const options: string[] = [];
    Object.entries(this.options).map(([key, value]) => {
      if (StringOptionKeys.includes(key as keyof Wal2JsonPluginOptions)) options.push(`"${dashCase(key)}" '${value}'`);
      else options.push(`"${dashCase(key)}" '${value ? 'on' : 'off'}'`);
    });

    let sql = `START_REPLICATION SLOT "${slotName}" LOGICAL ${lastLsn}`;
    if (options.length > 0) sql += ` (${options.join(' , ')})`;
    // console.log(sql);
    return client.query(sql);
  }

  parse(buffer: Buffer, cb: Function): any {

    // console.log(buffer.toString())
    // console.log('incoming buffer')
    let stream = Readable.from(buffer);

    const pipeline = chain([
      stream,
      Pick.withParser({filter: 'change'}),
      streamArray()
    ])    

    pipeline.on('data', (data) => {
      // console.log('returning data', data)
      // return data;
      cb(data)
    })
    // console.log(buffer.toString());
    // return JSON.parse(buffer.toString());
  }
}

function dashCase(str: string): string {
  return (str || '').replace(/[A-Z]/g, (found: string): string => '-' + found.toLowerCase());
}
