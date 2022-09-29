import EventEmitter2 from 'eventemitter2';
import { ClientConfig } from 'pg';
import { AbstractPlugin } from './output-plugins/abstract.plugin';
export interface ReplicationClientConfig extends ClientConfig {
    replication: 'database';
}
export interface LogicalReplicationConfig {
    acknowledge?: {
        /**
         * If the value is false, acknowledge must be done manually.
         * Default: true
         */
        auto: boolean;
        /**
         * Acknowledge is performed every set time (sec). If 0, do not do it.
         * Default: 10
         */
        timeoutSeconds: 0 | 10 | number;
    };
}
export interface LogicalReplicationService {
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: 'data', listener: (lsn: string, log: any) => Promise<void> | void): this;
    on(event: 'start', listener: () => Promise<void> | void): this;
    on(event: 'acknowledge', listener: (lsn: string) => Promise<void> | void): this;
    on(event: 'heartbeat', listener: (lsn: string, timestamp: number, shouldRespond: boolean) => Promise<void> | void): this;
}
export declare class LogicalReplicationService extends EventEmitter2 implements LogicalReplicationService {
    readonly clientConfig: ClientConfig;
    readonly config: LogicalReplicationConfig;
    constructor(clientConfig: ClientConfig, config?: Partial<LogicalReplicationConfig>);
    private _lastLsn;
    lastLsn(): string;
    private _client;
    private _connection;
    private client;
    private _stop;
    isStop(): boolean;
    stop(): Promise<this>;
    subscribe(plugin: AbstractPlugin, slotName: string): Promise<this>;
    subscribe(plugin: AbstractPlugin, slotName: string, uptoLsn: string): Promise<this>;
    private _acknowledge;
    private lastStandbyStatusUpdatedTime;
    private checkStandbyStatusTimer;
    private checkStandbyStatus;
    /**
     * @param lsn
     */
    acknowledge(lsn: string): Promise<boolean>;
}
