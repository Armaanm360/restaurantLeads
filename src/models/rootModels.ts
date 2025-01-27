import { Knex } from 'knex';
import { db } from '../app/database';
import AgentModel from './agent/agentModel';
import AdminModel from './admin/adminModel';
import PropertyModel from './property/propertyModel';
import AgentDashboardModel from './agent/agentDashboard.model';

class Models {
  // private db: Knex = db;
  // constructor(db: Knex) {
  //   this.db = db;
  // }
  // common models
  //management user
  public propertyModel(trx?: Knex.Transaction) {
    return new PropertyModel(trx || db);
  }

  // agent model
  public agentModel(trx?: Knex.Transaction) {
    return new AgentModel(trx || db);
  }
  public adminModel(trx?: Knex.Transaction) {
    return new AdminModel(trx || db);
  }

  // agent dashboard model
  public agentDashboardModel(trx?: Knex.Transaction) {
    return new AgentDashboardModel(trx || db);
  }
}
export default Models;
