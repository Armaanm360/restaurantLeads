"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class AgentDashboardModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // get agent dashboard data
    AgentDashboardData(params) {
        return __awaiter(this, void 0, void 0, function* () {
            // total properties
            const total_properties = yield this.db("properties AS p")
                .withSchema(this.PROPERTY_SCHEMA)
                .count("p.id AS total")
                .where((qb) => {
                if (params.agent_id) {
                    qb.andWhere("p.agent_id", params.agent_id);
                }
                qb.andWhere("p.is_deleted", false);
            })
                .first();
            // total reservation properties
            const total_reservation = yield this.db("property_reservations AS pr")
                .withSchema(this.PROPERTY_SCHEMA)
                .count("p.id AS total")
                .leftJoin("properties AS p", "p.id", "pr.property_id")
                .where((qb) => {
                if (params.agent_id) {
                    qb.andWhere("p.agent_id", params.agent_id);
                }
                qb.andWhere("p.is_deleted", false);
            })
                .first();
            // total reservations in the last 30 days
            const recent_reservations = yield this.db("property_reservations AS pr")
                .withSchema(this.PROPERTY_SCHEMA)
                .count("pr.id AS total")
                .leftJoin("properties AS p", "p.id", "pr.property_id")
                .where((qb) => {
                if (params.agent_id) {
                    qb.andWhere("p.agent_id", params.agent_id);
                }
                qb.andWhere("p.is_deleted", false).andWhere("pr.created_at", ">=", this.db.raw("NOW() - INTERVAL '30 days'"));
            })
                .first();
            // average price of properties
            const average_price = yield this.db("properties AS p")
                .withSchema(this.PROPERTY_SCHEMA)
                .avg("p.price AS average")
                .where((qb) => {
                if (params.agent_id) {
                    qb.andWhere("p.agent_id", params.agent_id);
                }
                qb.andWhere("p.is_deleted", false);
            })
                .first();
            // feedback or reviews
            const total_reviews = yield this.db("property_reviews AS r")
                .withSchema(this.PROPERTY_SCHEMA)
                .count("r.id AS total")
                .leftJoin("properties AS p", "p.id", "r.property_id")
                .where((qb) => {
                if (params.agent_id) {
                    qb.andWhere("p.agent_id", params.agent_id);
                }
                qb.andWhere("p.is_deleted", false);
            })
                .first();
            // Type-wise property count
            const type_wise_property = yield this.db("properties AS p")
                .withSchema(this.PROPERTY_SCHEMA)
                .select("pt.name")
                .count("p.id AS total")
                .leftJoin("property_types AS pt", "p.property_type", "pt.id")
                .where((qb) => {
                if (params.agent_id) {
                    qb.andWhere("p.agent_id", params.agent_id);
                }
                qb.andWhere("p.is_deleted", false);
            })
                .groupBy("pt.name");
            // Agent dashboard summary response
            return {
                total_properties: (total_properties === null || total_properties === void 0 ? void 0 : total_properties.total) || 0,
                total_reservations: (total_reservation === null || total_reservation === void 0 ? void 0 : total_reservation.total) || 0,
                recent_reservations: (recent_reservations === null || recent_reservations === void 0 ? void 0 : recent_reservations.total) || 0,
                average_price: (average_price === null || average_price === void 0 ? void 0 : average_price.average) || 0,
                total_reviews: (total_reviews === null || total_reviews === void 0 ? void 0 : total_reviews.total) || 0,
                type_wise_property: type_wise_property.map((type) => ({
                    type_name: type.name,
                    property_count: type.total,
                })),
            };
        });
    }
}
exports.default = AgentDashboardModel;
