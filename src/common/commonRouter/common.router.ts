import AbstractRouter from '../../abstract/abstract.router';
import commonController from '../commonController/commonController';

class commonRouter extends AbstractRouter {
  private commonController = new commonController();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    // send email otp
    this.router.get('/clients', this.commonController.moveClients);

    this.router.get('/accounts', this.commonController.moveAccounts);

    this.router.get('/vendors', this.commonController.moveVendors);

    this.router.get('/employees', this.commonController.moveEmployees);

    this.router.get('/invoices', this.commonController.invoices);

    this.router.get('/refresh', this.commonController.refreshDatabase);

    this.router.get('/refunds', this.commonController.refundController);

    this.router.get('/invoicenoncom', this.commonController.invoicenoncom);

    this.router.get('/reissue', this.commonController.reissue);

    this.router.get('/receipt', this.commonController.receipt);
  }
}

export default commonRouter;
