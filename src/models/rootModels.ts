import { Knex } from 'knex';
import { db, db2 } from '../app/database';
import AdminModel from './admin/adminModel';
import AgentDashboardModel from './agent/agentDashboard.model';
import NonComModel from './agent/noncom.model';
import ReissueModel from './agent/reissue.model';
import ReceiptModel from './agent/receipt.model';

class Models {
  // private db: Knex = db;
  // constructor(db: Knex) {
  //   this.db = db;
  // }

  public adminModel(trx?: Knex.Transaction) {
    return new AdminModel(trx || db);
  }

  // agent dashboard model
  public agentDashboardModel(trx?: Knex.Transaction) {
    return new AgentDashboardModel(trx || db, db2);
  }
  public NonComModel(trx?: Knex.Transaction) {
    return new NonComModel(trx || db, db2);
  }
  public ReissueModel(trx?: Knex.Transaction) {
    return new ReissueModel(trx || db, db2);
  }

  public receipt(trx?: Knex.Transaction) {
    return new ReceiptModel(trx || db, db2);
  }
}
export default Models;
