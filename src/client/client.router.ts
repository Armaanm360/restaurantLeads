import { Router } from 'express';
import ClientPropertyRouter from './routers/property.router';

class ClientRouter {
  public router = Router();
  constructor() {
    this.callRouter();
  }

  private callRouter() {
    // employee
    this.router.use('/properties', new ClientPropertyRouter().router);
  }
}

export default ClientRouter;
