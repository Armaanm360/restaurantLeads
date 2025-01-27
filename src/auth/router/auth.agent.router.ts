import AbstractRouter from '../../abstract/abstract.router';
import AuthChecker from '../../common/middleware/authChecker/authChecker';
import AgentAuthController from '../controller/auth.agent.controller';
class AgentAuthRouter extends AbstractRouter {
  private controller = new AgentAuthController();
  private authChecker = new AuthChecker();
  constructor() {
    super();
    this.callRouter();
  }
  private callRouter() {
    //new agent registration router
    this.router
      .route('/register')
      .post(
        this.uploader.cloudUploadRaw(this.fileFolders.AGENT_AVATARS),
        this.controller.register
      );

    //login router
    this.router.route('/login').post(this.controller.login);

    // profile
    this.router
      .route('/profile')
      .get(this.authChecker.agentAuthChecker, this.controller.getProfile)
      .patch(
        this.uploader.cloudUploadRaw(this.fileFolders.AGENT_AVATARS),
        this.authChecker.agentAuthChecker,
        this.controller.updateProfile
      );

    // forget password
    this.router
      .route('/forget-password')
      .post(this.authChecker.agentAuthChecker, this.controller.forgetPassword);

    // change password
    this.router
      .route('/change-password')
      .post(this.authChecker.agentAuthChecker, this.controller.changePassword);
  }
}

export default AgentAuthRouter;
