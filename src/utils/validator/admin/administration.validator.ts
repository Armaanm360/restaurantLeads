import { body } from "express-validator";

class AdministrationValidator {
  // create Admin input validator
  public createAdminValidator() {
    return [
      body("name", "Enter name").exists().isString(),
      body("phone", "Enter phone").isString().optional(),
      body("role", "Enter valid role").exists().isInt(),
      body("email", "Enter valid email or phone").exists().isEmail(),
      body("password", "Enter valid password minimun length 8")
        .exists()
        .isString()
        .isLength({ min: 8 }),
    ];
  }

  // create permission group validator
  public createPermissionGroupValidator() {
    return [body("name", "Enter name").exists().isString()];
  }

  // create permission validator
  public createPermissionValidator() {
    return [
      body("permissionGroupId")
        .isInt()
        .withMessage("Permission group ID must be an integer"),
      body("name")
        .isArray({ min: 1 })
        .withMessage("Name must be an array with at least one element"),
    ];
  }

  // create role permission
  public createRolePermissionValidator() {
    return [
      body("roleId").isInt().withMessage("Role ID must be an integer"),
      body("permissions").isArray().withMessage("Permissions must be an array"),
      body("permissions.*.permissionId").isInt(),
      body("permissions.*.permissionType")
        .isIn(["read", "write", "update", "delete"])
        .withMessage(
          'Permission type must be either "read" or "write" or "update" or "delete'
        ),
    ];
  }

  // create role
  public createRoleValidator() {
    return [
      body("role_name", "Enter role_name").exists().isString(),
      body("permissions", "Enter permissions").exists(),
    ];
  }
}

export default AdministrationValidator;
