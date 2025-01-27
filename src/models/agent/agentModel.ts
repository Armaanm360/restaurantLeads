// import {
//   IEngageContactLead,
//   IEngageLocation,
//   IEngageProductAndSource,
//   IUpdateAfterSaleLead,
//   IengageOrganization,
// } from '../../appCrm/utils/interfaces/employee/engage.interface';
import { ICommonSource } from '../../utils/interfaces/member/userModelInterfaces';
import Schema from '../../utils/miscellaneous/schema';
import { IAgent, IRegistration, TDB } from '../../common/types/commonTypes';
import {
  IAddVerificationTrack,
  IUpdateAgentVerification,
} from '../../admin/utils/interface/userAdmin.interface';
import { IAgentDocuments } from '../../agent/utils/interface/document.interface';

class AgentModel extends Schema {
  private db: TDB;

  constructor(db: TDB) {
    super();
    this.db = db;
  }

  //get single agent
  // public async getSingleAgent({ email, id }: { email?: string; id?: number }) {
  //   // Start building the query
  //   const query = this.db("users")
  //     .withSchema(this.USER_SCHEMA)
  //     .select("*")
  //     .andWhere("user_type", "agent");

  //   // If email is provided, add it to the query
  //   if (email) {
  //     query.where({ email });
  //   }

  //   // If id is provided, add it to the query
  //   if (id) {
  //     query.where({ id });
  //   }

  //   // Execute the query and return the result
  //   const data = await query;

  //   const doc_data = this.db("agent_profile_view")
  //     .withSchema(this.USER_SCHEMA)
  //     .select("*")
  //     .where({ agent_id: data[0].id });

  //   const docs = await doc_data;

  //   return { data, docs };
  // }

  public async getSingleAgent({ email, id }: { email?: string; id?: number }) {
    // Start building the query
    const query = this.db('users')
      .withSchema(this.USER_SCHEMA)
      .select(
        'users.*',
        'apv.profile_completion_percentage',
        'apv.profile_status'
      )
      .leftJoin('agent_profile_view as apv', 'apv.agent_id', '=', 'users.id')
      .where('user_type', 'agent');

    // If email is provided, add it to the query
    if (email) {
      query.where('users.email', email);
    }

    // If id is provided, add it to the query
    if (id) {
      query.where('users.id', id);
    }

    // Execute the query and return the result
    const data = await query;

    let docs: any = [];
    if (data.length > 0 && data[0].id) {
      const doc_data = this.db('agent_profile')
        .withSchema(this.USER_SCHEMA)
        .select('*')
        .where({ agent_id: data[0].id });

      docs = await doc_data;
    }

    return { data, docs };
  }

  // update profile
  public async updateAgentProfile(
    {
      email,
      id,
    }: {
      email?: string;
      id?: number;
    },
    payload: Partial<IAgent>
  ) {
    return await this.db('users')
      .withSchema(this.USER_SCHEMA)
      .update(payload, 'id')
      .where((qb) => {
        if (id) {
          qb.andWhere('id', id);
        }
      });
  }

  //register  agent
  public async createAgent(payload: IRegistration) {
    const data = await this.db('users')
      .withSchema(this.USER_SCHEMA)
      .insert(payload, 'id');

    return data;
  }

  // all after sales lead list
  public async getClientProperties({ limit, skip }: ICommonSource) {
    const dtbs = this.db('property_master_view as pmv');

    if (limit && skip) {
      dtbs.limit(parseInt(limit as string));
      dtbs.offset(parseInt(skip as string));
    }

    const data = await dtbs
      .withSchema(this.PROPERTY_SCHEMA)
      .select(
        '*'
        // 'afs.id',
        // 'afs.lead_id',
        // 'afs.assign_to',
        // 'afs.follow_up_date',
        // 'afs.note as after_sale_note',
        // 'afs.paying_amount',
        // 'afs.type',
        // 'afs.targeted_amount',
        // 'afs.after_sale_lead_status',
        // 'afs.service_provided',
        // 'lv.contact_person',
        // 'lv.contact_email',
        // 'lv.contact_number',
        // 'ot.name as org_type_name',
        // 'lv.org_name',
        // 'lv.reference',
        // 'tm.team_name',
        // 'pr.name as product_name',
        // 'sr.name as source_name',
        // 'ls.sale_amount',
        // 'ls.paid_amount',
        // 'ls.due_amount'
      )
      // .leftJoin('lead as lv', 'lv.id', '=', 'afs.lead_id')
      // .joinRaw('LEFT JOIN evo.teams AS tm ON lv.team_id = tm.team_id')
      // .leftJoin('product as pr', 'lv.product_id', '=', 'pr.id')
      // .leftJoin('source as sr', 'lv.source_id', '=', 'sr.id')
      // .leftJoin('lead_sale as ls', 'lv.id', '=', 'ls.lead_id')
      // .leftJoin('lead_organization as lo', 'lv.lead_organization_id', 'lo.id')
      // .leftJoin('org_type as ot', 'lv.org_type_id', 'ot.id')
      // .where('afs.organization_id', organization_id)
      // .andWhere('afs.assign_to', assign_to)
      // .andWhere(function () {
      //   if (searchPrm) {
      //     this.andWhere('pr.name', 'ilike', `%${searchPrm}%`)
      //       .orWhere('lo.lead_org_name', 'ilike', `%${searchPrm}%`)
      //       .orWhere('ot.name', 'ilike', `%${searchPrm}%`)
      //       .orWhere('lv.contact_number', 'ilike', `%${searchPrm}%`)
      //       .orWhere('lv.contact_person', 'ilike', `%${searchPrm}%`)
      //       .orWhere('lv.contact_email', 'ilike', `%${searchPrm}%`)
      //       .orWhere('sr.name', 'ilike', `%${searchPrm}%`);
      //   }
      // })
      .orderBy('property_id', 'desc');

    const total = await this.db('property_master_view as pmv')
      .withSchema(this.PROPERTY_SCHEMA)
      .count('pmv.property_id as total');
    // .leftJoin('lead as lv', 'lv.id', '=', 'afs.lead_id')
    // .joinRaw('LEFT JOIN evo.teams AS tm ON lv.team_id = tm.team_id')
    // .leftJoin('product as pr', 'lv.product_id', '=', 'pr.id')
    // .leftJoin('source as sr', 'lv.source_id', '=', 'sr.id')
    // .leftJoin('lead_sale as ls', 'lv.id', '=', 'ls.lead_id')
    // .leftJoin('lead_organization as lo', 'lv.lead_organization_id', 'lo.id')
    // .leftJoin('org_type as ot', 'lv.org_type_id', 'ot.id')
    // .where('afs.organization_id', organization_id)
    // .andWhere('afs.assign_to', assign_to)
    // .andWhere(function () {
    //   if (searchPrm) {
    //     this.andWhere('pr.name', 'ilike', `%${searchPrm}%`)
    //       .orWhere('lo.lead_org_name', 'ilike', `%${searchPrm}%`)
    //       .orWhere('ot.name', 'ilike', `%${searchPrm}%`)
    //       .orWhere('lv.contact_number', 'ilike', `%${searchPrm}%`)
    //       .orWhere('lv.contact_person', 'ilike', `%${searchPrm}%`)
    //       .orWhere('lv.contact_email', 'ilike', `%${searchPrm}%`)
    //       .orWhere('sr.name', 'ilike', `%${searchPrm}%`);
    //   }
    // });

    return {
      total: parseInt(total[0].total as string),
      data,
    };
  }

  public async getSingleProperty(id: Number) {
    return await this.db('property_master_view')
      .withSchema(this.PROPERTY_SCHEMA)
      .select('*')
      .where({ property_id: id });
  }

  //get all agents

  public async getAllAgents(query: {
    limit?: number;
    skip?: number;
    key?: string;
  }) {
    const data = this.db('users')
      .withSchema(this.USER_SCHEMA)
      .select('*')
      .leftJoin('agent_profile_view as apv', 'apv.agent_id', '=', 'users.id')
      .andWhere('users.user_type', 'agent')
      .where((qb) => {
        if (query.key) {
          qb.andWhereILike('users.name', `%${query.key}%`);
        }
      });

    if (query.limit) {
      data.limit(query.limit);
    }

    if (query.skip) {
      data.offset(query.skip);
    }

    const total = await this.db('users')
      .withSchema(this.USER_SCHEMA)
      .count('id AS total')
      .where((qb) => {
        if (query.key) {
          qb.andWhereILike('users.name', `%${query.key}%`);
        }
      });

    return {
      data: await data,
      total: total[0].total,
    };
  }

  // create agent documents
  public async createAgentDocuments(payload: IAgentDocuments) {
    const data = await this.db('agent_profile')
      .withSchema(this.USER_SCHEMA)
      .insert(payload, 'id');

    return data;
  }

  // update agent documents
  public async updateAgentDocuments(
    payload: Partial<IAgentDocuments>,
    {
      id,
      agent_id,
    }: {
      id?: number;
      agent_id?: number;
    }
  ) {
    const data = await this.db('agent_profile')
      .withSchema(this.USER_SCHEMA)
      .update(payload, 'id')
      .where((qb) => {
        if (agent_id) {
          qb.andWhere('agent_id', agent_id);
        }
        if (id) {
          qb.andWhere('id', id);
        }
      });

    return data;
  }

  // single documents
  public async singleAgentDocuments({
    id,
    agent_id,
  }: {
    id?: number;
    agent_id?: number;
  }) {
    return await this.db('agent_profile')
      .withSchema(this.USER_SCHEMA)
      .select('*')
      .where((qb) => {
        if (agent_id) {
          qb.andWhere('agent_id', agent_id);
        }
      });
  }

  public async updateSingleAgentVerification(
    id: Number,
    payload: IUpdateAgentVerification
  ) {
    return await this.db('agent_profile')
      .withSchema(this.USER_SCHEMA)
      .where({ agent_id: id }) // Locate the property by ID
      .update(payload); // Update the property with new data
  }

  //update agent with relevant columns
  public async getSingleProfileAgent(id: Number) {
    return await this.db('agent_profile')
      .withSchema(this.USER_SCHEMA)
      .where({ agent_id: id });
  }

  //add verification track

  public async addVerificationTrack(payload: IAddVerificationTrack) {
    return await this.db('agent_verification_track')
      .withSchema(this.USER_SCHEMA)
      .insert(payload); // Update the property with new data
  }
}
export default AgentModel;
