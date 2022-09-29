"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// https://github.com/debezium/postgres-decoderbufs/blob/main/proto/pg_logicaldec.proto
exports.default = {
    "nested": {
        "decoderbufs": {
            "options": {
                "java_package": "io.debezium.connector.postgresql.proto",
                "java_outer_classname": "PgProto",
                "optimize_for": "SPEED"
            },
            "nested": {
                "Op": {
                    "values": {
                        "UNKNOWN": -1,
                        "INSERT": 0,
                        "UPDATE": 1,
                        "DELETE": 2,
                        "BEGIN": 3,
                        "COMMIT": 4
                    }
                },
                "Point": {
                    "fields": {
                        "x": {
                            "rule": "required",
                            "type": "double",
                            "id": 1
                        },
                        "y": {
                            "rule": "required",
                            "type": "double",
                            "id": 2
                        }
                    }
                },
                "DatumMessage": {
                    "oneofs": {
                        "datum": {
                            "oneof": [
                                "datumInt32",
                                "datumInt64",
                                "datumFloat",
                                "datumDouble",
                                "datumBool",
                                "datumString",
                                "datumBytes",
                                "datumPoint",
                                "datumMissing"
                            ]
                        }
                    },
                    "fields": {
                        "columnName": {
                            "type": "string",
                            "id": 1
                        },
                        "columnType": {
                            "type": "int64",
                            "id": 2
                        },
                        "datumInt32": {
                            "type": "int32",
                            "id": 3
                        },
                        "datumInt64": {
                            "type": "int64",
                            "id": 4
                        },
                        "datumFloat": {
                            "type": "float",
                            "id": 5
                        },
                        "datumDouble": {
                            "type": "double",
                            "id": 6
                        },
                        "datumBool": {
                            "type": "bool",
                            "id": 7
                        },
                        "datumString": {
                            "type": "string",
                            "id": 8
                        },
                        "datumBytes": {
                            "type": "bytes",
                            "id": 9
                        },
                        "datumPoint": {
                            "type": "Point",
                            "id": 10
                        },
                        "datumMissing": {
                            "type": "bool",
                            "id": 11
                        }
                    }
                },
                "TypeInfo": {
                    "fields": {
                        "modifier": {
                            "rule": "required",
                            "type": "string",
                            "id": 1
                        },
                        "valueOptional": {
                            "rule": "required",
                            "type": "bool",
                            "id": 2
                        }
                    }
                },
                "RowMessage": {
                    "fields": {
                        "transactionId": {
                            "type": "uint32",
                            "id": 1
                        },
                        "commitTime": {
                            "type": "uint64",
                            "id": 2
                        },
                        "table": {
                            "type": "string",
                            "id": 3
                        },
                        "op": {
                            "type": "Op",
                            "id": 4
                        },
                        "newTuple": {
                            "rule": "repeated",
                            "type": "DatumMessage",
                            "id": 5,
                            "options": {
                                "packed": false
                            }
                        },
                        "oldTuple": {
                            "rule": "repeated",
                            "type": "DatumMessage",
                            "id": 6,
                            "options": {
                                "packed": false
                            }
                        },
                        "newTypeinfo": {
                            "rule": "repeated",
                            "type": "TypeInfo",
                            "id": 7,
                            "options": {
                                "packed": false
                            }
                        }
                    }
                }
            }
        }
    }
};
