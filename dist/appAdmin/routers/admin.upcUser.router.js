"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const admin_upcUser_controller_1 = __importDefault(require("../controllers/admin.upcUser.controller"));
class AdminUpcUserRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.controller = new admin_upcUser_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        //create user
        this.router
            .route("/")
            .post(this.uploader.cloudUploadRaw(this.fileFolders.UPC_USER_FILES), this.controller.createUser);
        // get and update single user
        this.router
            .route("/:id")
            .get(this.controller.getSingleUser)
            .patch(this.uploader.cloudUploadRaw(this.fileFolders.UPC_USER_FILES), this.controller.updateSingleUser);
        // get all card by single user
        this.router
            .route("/card/by/:user_id")
            .get(this.controller.getSingleUsersCard);
        // get single card by user id and  card id
        this.router
            .route("/card/by/user_id/:user_id/card_id/:card_id")
            .get(this.controller.getSingleCardByUserAndCardId);
    }
}
exports.default = AdminUpcUserRouter;
