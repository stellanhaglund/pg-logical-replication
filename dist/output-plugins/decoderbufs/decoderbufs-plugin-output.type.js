"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolBuffersOperation = void 0;
var ProtocolBuffersOperation;
(function (ProtocolBuffersOperation) {
    ProtocolBuffersOperation[ProtocolBuffersOperation["UNKNOWN"] = -1] = "UNKNOWN";
    ProtocolBuffersOperation[ProtocolBuffersOperation["INSERT"] = 0] = "INSERT";
    ProtocolBuffersOperation[ProtocolBuffersOperation["UPDATE"] = 1] = "UPDATE";
    ProtocolBuffersOperation[ProtocolBuffersOperation["DELETE"] = 2] = "DELETE";
    ProtocolBuffersOperation[ProtocolBuffersOperation["BEGIN"] = 3] = "BEGIN";
    ProtocolBuffersOperation[ProtocolBuffersOperation["COMMIT"] = 4] = "COMMIT";
})(ProtocolBuffersOperation = exports.ProtocolBuffersOperation || (exports.ProtocolBuffersOperation = {}));
