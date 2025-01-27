"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_service_1 = __importDefault(require("../../abstract/abstract.service"));
const lib_1 = __importDefault(require("../../utils/lib/lib"));
class UserService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //create user
    createUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const _a = req.body, { password } = _a, rest = __rest(_a, ["password"]);
                const memberModel = this.Model.managementUserModel(trx);
                //check user
                const checkUser = yield memberModel.checkUser({
                    email: rest.email,
                });
                if (checkUser.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: 'Email is already exists',
                    };
                }
                const getMySuperAdminRole = yield memberModel.getAllRoles(req.body.restaurant_id, req, 'super-admin');
                const role_id = getMySuperAdminRole[0].id;
                //password hashing
                const hashedPass = yield lib_1.default.hashPass(password);
                //creating member
                const registration = yield memberModel.insertUserMember(Object.assign({ role_id: role_id, password: hashedPass }, rest));
                console.log(registration[0].id);
                // const data = await memberModel.createWarehouse(req.body.restaurant_id);
                //retrieve token data
                const tokenData = {
                    id: req.body.restaurant_id,
                    owner_name: rest.owner_name,
                    company_name: rest.company_name,
                    phone: rest.phone,
                    email: rest.email,
                    role_id: role_id,
                    address: rest.address,
                    user_unique_id: rest.user_unique_id,
                    version: rest.version,
                };
                if (registration.length) {
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_OK,
                        message: this.ResMsg.HTTP_OK,
                        data: Object.assign({}, tokenData),
                    };
                }
                else {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: this.ResMsg.HTTP_BAD_REQUEST,
                    };
                }
            }));
        });
    }
    //update user
    updateUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const body = req.body;
                const user_id = Number(req.params.id);
                const user = yield this.Model.managementUserModel().updateSingleUser(user_id, body);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: 'User Updated Successfully',
                };
            }));
        });
    }
    // get all users
    getAllUsers(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { restaurant_id, key, limit, skip } = req.query;
            const model = this.Model.managementUserModel();
            const { data, total } = yield model.getAllUsers({
                restaurant_id: restaurant_id,
                key: key,
                limit: limit,
                skip: skip,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data,
                total,
            };
        });
    }
    //get all roles
    getRoles(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.managementUserModel();
            const restaurant_id = Number(req.params.id);
            const roles = yield model.getAllRoles(restaurant_id, req);
            return {
                success: false,
                code: this.StatusCode.HTTP_BAD_REQUEST,
                message: this.ResMsg.HTTP_BAD_REQUEST,
                data: roles,
            };
        });
    }
}
exports.default = UserService;
