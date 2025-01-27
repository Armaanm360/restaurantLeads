import Wrapper from "../common/middleware/asyncWrapper/middleware";
import ResMsg from "../utils/miscellaneous/responseMessage";
import StatusCode from "../utils/miscellaneous/statusCode";
import CommonValidator from "../common/validators/common.validator";
import CustomError from "../utils/lib/customEror";

abstract class AbstractController {
  protected asyncWrapper: Wrapper;
  protected commonValidator;
  constructor() {
    this.asyncWrapper = new Wrapper();
    this.commonValidator = new CommonValidator();
  }
  protected StatusCode = StatusCode;
  protected error(message?: string, status?: number) {
    throw new CustomError(
      message || ResMsg.HTTP_INTERNAL_SERVER_ERROR,
      status || StatusCode.HTTP_INTERNAL_SERVER_ERROR
    );
  }
}
export default AbstractController;
