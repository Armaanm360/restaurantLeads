import CustomError from '../../utils/lib/customEror';
import Wrapper from '../middleware/asyncWrapper/middleware';

abstract class CommonAbstractController {
  protected asyncWrapper: Wrapper;
  constructor() {
    this.asyncWrapper = new Wrapper();
  }

  protected error(message?: string, status?: number, type?: string) {
    throw new CustomError(
      message || 'Something went wrong',
      status || 500
      // type || 'Internal server Error'
    );
  }
}
export default CommonAbstractController;
