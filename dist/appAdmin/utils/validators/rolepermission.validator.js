"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class RolePermissionValidator {
    constructor() {
        //Create Permission Group
        this.createPermissionGroupValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
        });
        this.createPermission = joi_1.default.array().items(joi_1.default.object({
            permission_group_id: joi_1.default.number().required(),
            name: joi_1.default.string().required(),
        }));
    }
}
exports.default = RolePermissionValidator;
