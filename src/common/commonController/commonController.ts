import { Request, Response } from 'express';
import AbstractController from '../../abstract/abstract.controller';
import commonService from '../commonService/common.service';
import nonComService from '../commonService/noncom.service';

class commonController extends AbstractController {
  private commonService = new commonService();
  private nonCommon = new nonComService();

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
  public invoices = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.testInvoices(req);
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
      const { code, ...data } = await this.nonCommon.reissueTransfer(req);
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

  public refreshDatabase = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.refreshDatabase(req);
      res.status(code).json(data);
    }
  );

  public refundController = this.asyncWrapper.wrap(
    // { arrayBodySchema: this.ActivityValidator.createActivity },
    {},
    async (req: Request, res: Response) => {
      const { code, ...data } = await this.commonService.refundTest(req);
      res.status(code).json(data);
    }
  );
}

export default commonController;
