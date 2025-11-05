import { Request, Response } from 'express';
import AbstractController from '../../abstract/abstract.controller';
import commonService from '../commonService/common.service';
import nonComService from '../commonService/noncom.service';
import { OCRController } from '../commonService/mistral.service';
import reissueService from '../commonService/reissue.service';
import { RefundService } from '../commonService/refund.service';

class commonController extends AbstractController {
  private commonService = new commonService();
  private nonCommon = new nonComService();
  private reIssue = new reissueService();
  private reFund = new RefundService();

  constructor() {
    super();
  }

  // send email otp
  public moveClients = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.moveClients(req);
      res.status(code).json(data);
    }
  );
  public movePassports = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.movePassports(req);
      res.status(code).json(data);
    }
  );

  public moveAirports = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.moveAirports(req);
      res.status(code).json(data);
    }
  );

  public moveAirlines = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.moveAirlines(req);
      res.status(code).json(data);
    }
  );

  public moveAccounts = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.moveAccounts(req);
      res.status(code).json(data);
    }
  );
  public moveVendors = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.moveVendors(req);
      res.status(code).json(data);
    }
  );
  public moveEmployees = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.moveEmployees(req);
      res.status(code).json(data);
    }
  );
  public moveUsers = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.moveUsers(req);
      res.status(code).json(data);
    }
  );
  public invoices = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.testInvoices(req);
      res.status(code).json(data);
    }
  );
  public testInvoicesReissues = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.testInvoicesReissues(
        req
      );
      res.status(code).json(data);
    }
  );

  public voidsMigration = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.voidsMigration(req);
      res.status(code).json(data);
    }
  );
  public invoicenoncom = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.nonCommon.testInvoicesNon(req);
      res.status(code).json(data);
    }
  );
  public reissue = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.reIssue.reissueTransfer(req);
      res.status(code).json(data);
    }
  );
  public receipt = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.nonCommon.receipt(req);
      res.status(code).json(data);
    }
  );
  public payment = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.nonCommon.payment(req);
      res.status(code).json(data);
    }
  );
  public refreshDatabase = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.refreshDatabase(req);
      res.status(code).json(data);
    }
  );
  public resetVoid = this.asyncWrapper.wrap(
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.resetVoid(req);
      res.status(code).json(data);
    }
  );
  public resetReceipts = this.asyncWrapper.wrap(
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.resetReceipt(req);
      res.status(code).json(data);
    }
  );
  public resetRefund = this.asyncWrapper.wrap(
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.resetRefund(req);
      res.status(code).json(data);
    }
  );

  public refreshRecDatabase = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.refreshRecDatabase(
        req
      );
      res.status(code).json(data);
    }
  );
  public refundController = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.reFund.refundTest(req);
      res.status(code).json(data);
    }
  );

  public refundControllerNon = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.reFund.refundTestNon(req);
      res.status(code).json(data);
    }
  );

  // Add this new method for sequential execution
  public refreshAllData = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      console.log('Starting sequential data refresh...');

      // //PHASE 1
      // Execute each service method directly in sequence
      console.log('Processing clients...');
      await this.commonService.moveClients(req);

      console.log('Processing accounts...');
      await this.commonService.moveAccounts(req);

      console.log('Processing vendors...');
      await this.commonService.moveVendors(req);

      console.log('Processing employees...');
      await this.commonService.moveEmployees(req);

      console.log('Processing passports...');
      await this.commonService.movePassports(req);

      console.log('Processing Airports...');
      await this.commonService.moveAirports(req);

      console.log('Processing Airlines...');
      await this.commonService.moveAirlines(req);

      // console.log('Processing invoices...');
      // await this.commonService.testInvoices(req);

      // console.log('Processing invoice noncom...');
      // await this.nonCommon.testInvoicesNon(req);

      // // console.log('Processing reissue...');
      // await this.reIssue.reissueTransfer(req);

      // // ///PHASE 2
      // console.log('Processing refunds...');
      // await this.reFund.refundTest(req);

      // console.log('Processing refunds...');
      // await this.commonService.voidsMigration(req);

      // console.log('Processing receipt...');
      // await this.nonCommon.receipt(req);

      // console.log('Processing payment...');
      // await this.nonCommon.payment(req);

      console.log('All processes completed successfully!');

      res.status(200).json({
        code: 200,
        success: true,
        message: 'All data refresh operations completed successfully',
      });
    } catch (error) {
      console.error('Error in sequential refresh:', error);

      res.status(500).json({
        code: 500,
        success: false,
        message: 'Error during data refresh operations',
      });
    }
  };
}

export default commonController;
