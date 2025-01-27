import { group } from "console";
import { TDB } from "../../common/types/commonTypes";
import Schema from "../../utils/miscellaneous/schema";

class AgentDashboardModel extends Schema {
  private db: TDB;

  constructor(db: TDB) {
    super();
    this.db = db;
  }

  // get agent dashboard data
  public async AgentDashboardData(params: { agent_id?: number }) {
    // total properties
    const total_properties = await this.db("properties AS p")
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
    const total_reservation = await this.db("property_reservations AS pr")
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
    const recent_reservations = await this.db("property_reservations AS pr")
      .withSchema(this.PROPERTY_SCHEMA)
      .count("pr.id AS total")
      .leftJoin("properties AS p", "p.id", "pr.property_id")
      .where((qb) => {
        if (params.agent_id) {
          qb.andWhere("p.agent_id", params.agent_id);
        }
        qb.andWhere("p.is_deleted", false).andWhere(
          "pr.created_at",
          ">=",
          this.db.raw("NOW() - INTERVAL '30 days'")
        );
      })
      .first();

    // average price of properties
    const average_price = await this.db("properties AS p")
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
    const total_reviews = await this.db("property_reviews AS r")
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
    const type_wise_property = await this.db("properties AS p")
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
      total_properties: total_properties?.total || 0,
      total_reservations: total_reservation?.total || 0,
      recent_reservations: recent_reservations?.total || 0,
      average_price: average_price?.average || 0,
      total_reviews: total_reviews?.total || 0,
      type_wise_property: type_wise_property.map((type) => ({
        type_name: type.name,
        property_count: type.total,
      })),
    };
  }
}

export default AgentDashboardModel;
