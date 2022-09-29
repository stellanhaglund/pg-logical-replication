export declare module Wal2Json {
    interface Output {
        change: Change[];
        /**
         * +options.includeXids : true
         */
        xid?: number;
        /**
         * +options.includeLsn : true
         */
        nextlsn: string;
        /**
         * +options.includeOrigin : true
         */
        origin: number;
        /**
         * +options.includeTimestamp : true
         */
        timestamp: string;
    }
    interface Change {
        kind: 'insert' | 'update' | 'delete' | 'message' | 'truncate';
        schema: string;
        table: string;
        columnnames: string[];
        columntypes: string[];
        columnvalues: any[];
        /**
         * +options.includePk : true
         */
        pk?: Pk;
        /**
         * +options.includeColumnPositions : true
         */
        columnpositions: number[];
        /**
         * +options.includeDefault : true
         */
        columndefaults: string[];
        /**
         * +options.includeTypeOids : true
         */
        columntypeoids: number[];
        /**
         * +options.includeNotNull : true
         */
        columnoptionals: boolean[];
    }
    interface Pk {
        pknames: string[];
        pktypes: string[];
    }
}
