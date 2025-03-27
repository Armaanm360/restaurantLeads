import { Router } from 'express';
import commonRouter from '../common/commonRouter/common.router';

/**
 * RootRouter class that initializes and configures the version 1 (v1) router
 * for handling various routes related to authentication, common functionalities,
 * client operations, and agent operations.
 */
class RootRouter {
  public v1Router = Router(); // Express Router for version 1 of the API
  private commonRouter = new commonRouter(); // Instance of commonRouter for shared routes

  /**
   * Constructor that initializes the v1Router by calling the setup method.
   */
  constructor() {
    this.callV1Router();
  }

  private callV1Router() {
    this.v1Router.use('/main', new commonRouter().router);
  }
}

export default RootRouter;
