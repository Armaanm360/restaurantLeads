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
    this.router.post(
      '/send-email-otp',
      this.commonController.sendEmailOtpController
    );
    // match email otp
    this.router.post(
      '/match-email-otp',
      this.commonController.matchEmailOtpController
    );

    // restaurant leads
    this.router.get('/restaurants', this.commonController.restaurantLeads);
  }
}

export default commonRouter;
