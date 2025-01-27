import AbstractRouter from '../../abstract/abstract.router';
import AuthChecker from '../../common/middleware/authChecker/authChecker';
import AdminAuthController from '../controller/auth.admin.controller';
class AdminAuthRouter extends AbstractRouter {
  private controller = new AdminAuthController();
  private authChecker = new AuthChecker();
  constructor() {
    super();
    this.callRouter();
  }
  private callRouter() {
    //login router
    this.router.route('/login').post(this.controller.login);

    // profile
    this.router
      .route('/profile')
      .get(this.authChecker.adminAuthChecker, this.controller.getProfile)
      .patch(
        this.authChecker.adminAuthChecker,
        this.uploader.cloudUploadRaw(this.fileFolders.ADMIN_AVATARS),
        this.controller.updateProfile
      );
  }
}

export default AdminAuthRouter;
