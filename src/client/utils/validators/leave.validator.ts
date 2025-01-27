import { body } from 'express-validator';

class MemberLeaveValidator {
  // change password validator
  public changePassword() {
    return [
      body('old_password', 'Provide valid old password.').isString(),
      body('new_password', 'Provide valid new password.').isString(),
    ];
  }
}

export default MemberLeaveValidator;
