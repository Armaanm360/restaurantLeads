import { body } from 'express-validator';
import ResMsg from '../../../utils/miscellaneous/responseMessage';

class UserValidator {
  // member reg validator
  public userValidator() {
    return [
      body('name', ResMsg.HTTP_UNPROCESSABLE_ENTITY)
        .exists()
        .notEmpty()
        .isString(),
      body('username', ResMsg.HTTP_UNPROCESSABLE_ENTITY)
        .exists()
        .notEmpty()
        .isLength({ min: 4, max: 14 })
        .isString(),
      body('designation', ResMsg.HTTP_UNPROCESSABLE_ENTITY)
        .exists()
        .notEmpty()
        .isString(),
      body('level', ResMsg.HTTP_UNPROCESSABLE_ENTITY)
        .exists()
        .notEmpty()
        .isNumeric(),
      body('association_id', ResMsg.HTTP_UNPROCESSABLE_ENTITY)
        .exists()
        .notEmpty()
        .isNumeric(),
      body('password', 'Enter valid password minimun length 8')
        .exists()
        .isString()
        .isLength({ min: 8 }),
      // body('phone', ResMsg.HTTP_UNPROCESSABLE_ENTITY)
      //   .isString()
      //   .isLength({ min: 14, max: 14 })
      //   .custom((value) => {
      //     if (!value.startsWith('+88')) {
      //       return false;
      //     } else {
      //       return true;
      //     }
      //   }),
    ];
  }

  public loginValidator() {
    return [
      body('email', 'Enter valid email or phone').exists().isEmail(),
      body('password', 'Enter valid password minimun length 8')
        .exists()
        .isString()
        .isLength({ min: 8 }),
    ];
  }
  public adminValidator() {
    return [
      // body('email', ResMsg.HTTP_UNPROCESSABLE_ENTITY).exists().isString(),
      // body('password', ResMsg.HTTP_UNPROCESSABLE_ENTITY).exists().isString(),
    ];
  }
}

export default UserValidator;
