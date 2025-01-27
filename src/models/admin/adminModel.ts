// import {
//   IEngageContactLead,
//   IEngageLocation,
//   IEngageProductAndSource,
//   IUpdateAfterSaleLead,
//   IengageOrganization,
// } from '../../appCrm/utils/interfaces/employee/engage.interface';
import {
  IAdmin,
  IAgent,
  IRegistration,
  TDB,
} from '../../common/types/commonTypes';
import { ICommonSource } from '../../utils/interfaces/member/userModelInterfaces';
import Schema from '../../utils/miscellaneous/schema';

class AdminModel extends Schema {
  private db: TDB;

  constructor(db: TDB) {
    super();
    this.db = db;
  }

  //get single agent
  public async getSingleAdmin({ email, id }: { email?: string; id?: number }) {
    // Start building the query
    const query = this.db('users')
      .withSchema(this.USER_SCHEMA)
      .select('*')
      .andWhere('user_type', 'admin');

    // If email is provided, add it to the query
    if (email) {
      query.where({ email });
    }

    // If id is provided, add it to the query
    if (id) {
      query.where({ id });
    }

    // Execute the query and return the result
    const data = await query;
    return data;
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

  public async updateAdminProfile(
    {
      email,
      id,
    }: {
      email?: string;
      id?: number;
    },
    payload: Partial<IAdmin>
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
}
export default AdminModel;
