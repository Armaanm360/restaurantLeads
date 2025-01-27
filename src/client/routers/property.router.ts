import AbstractRouter from '../../abstract/abstract.router';
import ClientPropertyController from '../controllers/property.controller';

class ClientPropertyRouter extends AbstractRouter {
  private controller = new ClientPropertyController();
  constructor() {
    super();
    this.callRouter();
  }

  private callRouter() {
    //inquiry
    this.router.route('/inquiry').post(this.controller.addInquiry);
    //inquiry
    this.router.route('/property-types').get(this.controller.getPropertyTypes);
    //listing property
    this.router.route('/listing').post(this.controller.listingProperty);

    this.router.route('/').get(this.controller.getProperty);
    this.router.route('/:id').get(this.controller.getSingleProperty);
  }
}

export default ClientPropertyRouter;
