"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../app/database");
const agentModel_1 = __importDefault(require("./agent/agentModel"));
const adminModel_1 = __importDefault(require("./admin/adminModel"));
const propertyModel_1 = __importDefault(require("./property/propertyModel"));
const agentDashboard_model_1 = __importDefault(require("./agent/agentDashboard.model"));
class Models {
    // private db: Knex = db;
    // constructor(db: Knex) {
    //   this.db = db;
    // }
    // common models
    //management user
    propertyModel(trx) {
        return new propertyModel_1.default(trx || database_1.db);
    }
    // agent model
    agentModel(trx) {
        return new agentModel_1.default(trx || database_1.db);
    }
    adminModel(trx) {
        return new adminModel_1.default(trx || database_1.db);
    }
    // agent dashboard model
    agentDashboardModel(trx) {
        return new agentDashboard_model_1.default(trx || database_1.db);
    }
}
exports.default = Models;
