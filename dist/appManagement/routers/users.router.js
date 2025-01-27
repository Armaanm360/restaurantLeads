"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const user_controller_1 = __importDefault(require("../controller/user.controller"));
class UserRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.userController = new user_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //create user
        this.router
            .route('/')
            .post(this.userController.createUser)
            .get(this.userController.getAllUsers);
        this.router.route('/roles/:id').get(this.userController.getRoles);
        this.router.route('/:id').patch(this.userController.updateUser);
        // this.router
        //   .route('/:id')
        //   .patch(
        //     this.uploader.cloudUploadRaw(this.fileFolders.RESTAURANT),
        //     this.userController.updateRestaurant
        //   )
        //   .get(this.userController.getAllRestaurants);
    }
}
exports.default = UserRouter;
