"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const middleware_1 = __importDefault(require("../common/middleware/asyncWrapper/middleware"));
const responseMessage_1 = __importDefault(require("../utils/miscellaneous/responseMessage"));
const statusCode_1 = __importDefault(require("../utils/miscellaneous/statusCode"));
const common_validator_1 = __importDefault(require("../common/validators/common.validator"));
const customEror_1 = __importDefault(require("../utils/lib/customEror"));
class AbstractController {
    constructor() {
        this.StatusCode = statusCode_1.default;
        this.asyncWrapper = new middleware_1.default();
        this.commonValidator = new common_validator_1.default();
    }
    error(message, status) {
        throw new customEror_1.default(message || responseMessage_1.default.HTTP_INTERNAL_SERVER_ERROR, status || statusCode_1.default.HTTP_INTERNAL_SERVER_ERROR);
    }
}
exports.default = AbstractController;
