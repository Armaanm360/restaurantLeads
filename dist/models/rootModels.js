"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../app/database");
const adminModel_1 = __importDefault(require("./admin/adminModel"));
const agentDashboard_model_1 = __importDefault(require("./agent/agentDashboard.model"));
const noncom_model_1 = __importDefault(require("./agent/noncom.model"));
const reissue_model_1 = __importDefault(require("./agent/reissue.model"));
const receipt_model_1 = __importDefault(require("./agent/receipt.model"));
class Models {
    // private db: Knex = db;
    // constructor(db: Knex) {
    //   this.db = db;
    // }
    adminModel(trx) {
        return new adminModel_1.default(trx || database_1.db);
    }
    // agent dashboard model
    agentDashboardModel(trx) {
        return new agentDashboard_model_1.default(trx || database_1.db, database_1.db2);
    }
    NonComModel(trx) {
        return new noncom_model_1.default(trx || database_1.db, database_1.db2);
    }
    ReissueModel(trx) {
        return new reissue_model_1.default(trx || database_1.db, database_1.db2);
    }
    receipt(trx) {
        return new receipt_model_1.default(trx || database_1.db, database_1.db2);
    }
}
exports.default = Models;
