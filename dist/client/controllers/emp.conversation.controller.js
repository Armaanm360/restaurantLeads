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
const abstract_controller_1 = __importDefault(require("../../abstract/abstract.controller"));
const emp_conversation_service_1 = __importDefault(require("../services/emp.conversation.service"));
const conversation_validator_1 = __importDefault(require("../utils/validators/conversation.validator"));
class EmpConversationController extends abstract_controller_1.default {
    constructor() {
        super();
        this.service = new emp_conversation_service_1.default();
        this.validator = new conversation_validator_1.default();
        // sendMessage
        this.sendMessage = this.asyncWrapper.wrap({ bodySchema: this.validator.sendMsgValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.service.sendMessage(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        // get all emp conversation
        this.getAllEmpConversation = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.service.getAllEmpConversation(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        // delete emp conversation
        this.delEmpConversation = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.service.delEmpConversation(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        // get single emp conversation
        this.getSingleEmpConversation = this.asyncWrapper.wrap({
            paramSchema: this.commonValidator.singleParamValidator(),
            querySchema: this.commonValidator.cnvEmpQueryValidator,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.service.getSingleEmpConversation(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        // get total unseen conversation
        this.getTotalUnseenConversation = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.service.getTotalUnseenConversation(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = EmpConversationController;
