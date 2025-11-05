import AbstractRouter from '../../abstract/abstract.router';
import commonController from '../commonController/commonController';
import multer from 'multer';
const upload = multer();

class commonRouter extends AbstractRouter {
  private commonController = new commonController();

  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    this.router.get('/clients', this.commonController.moveClients);

    this.router.get('/passports', this.commonController.movePassports);

    this.router.get('/airports', this.commonController.moveAirports);

    this.router.get('/airlines', this.commonController.moveAirlines);

    this.router.get('/accounts', this.commonController.moveAccounts);

    this.router.get('/vendors', this.commonController.moveVendors);

    this.router.get('/employees', this.commonController.moveEmployees);

    this.router.get('/users', this.commonController.moveUsers);

    this.router.get('/invoices', this.commonController.invoices);

    this.router.get('/void', this.commonController.voidsMigration);

    this.router.get('/refresh', this.commonController.refreshDatabase);

    this.router.get('/reset-void', this.commonController.resetVoid);

    this.router.get('/reset-receipts', this.commonController.resetReceipts);

    this.router.get('/reset-refund', this.commonController.resetRefund);

    this.router.get('/refunds', this.commonController.refundController);

    this.router.get(
      '/refunds-non-com',
      this.commonController.refundControllerNon
    );

    this.router.get('/invoicenoncom', this.commonController.invoicenoncom);

    this.router.get('/reissue', this.commonController.reissue);

    this.router.get(
      '/invoice-reissued',
      this.commonController.testInvoicesReissues
    );
    this.router.get(
      '/non-invoice-reissued',
      this.commonController.invoicenoncom
    );

    this.router.get('/receipt', this.commonController.receipt);

    this.router.get('/payment', this.commonController.payment);

    this.router.get('/master-command', this.commonController.refreshAllData);
  }
}

export default commonRouter;
