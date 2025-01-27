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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_service_1 = __importDefault(require("../../abstract/abstract.service"));
class AdminUpcConfigurationService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // create amenities
    createAmenities(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.upcConfigurationModel();
            const { data: checkAmenities } = yield model.getAllAmenities({
                name: req.body.name,
            });
            if (checkAmenities.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_CONFLICT,
                    message: this.ResMsg.HTTP_CONFLICT,
                };
            }
            yield model.createAmenities(req.body);
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
            };
        });
    }
    // get all amenities
    getAllAmenities(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, name } = req.query;
            const { data, total } = yield this.Model.upcConfigurationModel().getAllAmenities({
                limit: limit,
                skip: skip,
                name: name,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                total,
                data,
            };
        });
    }
    // update amenities
    updateAmenities(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.upcConfigurationModel();
            const checkAmenities = yield model.getSingleAmenities(parseInt(req.params.id));
            if (!checkAmenities.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            yield model.updateAmenities(req.body, parseInt(req.params.id));
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
}
exports.default = AdminUpcConfigurationService;
