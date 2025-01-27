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
const agent_service_1 = __importDefault(require("../services/agent.service"));
class AdminAgentController extends abstract_controller_1.default {
    // private validator = new activityValidator();
    constructor() {
        super();
        this.service = new agent_service_1.default();
        ///get all property list public
        this.getAllAgents = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.service.getAllAgents(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        ///get single agent
        this.getSingleAgent = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.service.getSingleAgent(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        ///get single agent
        this.updateSingleAgentVerification = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.service.updateSingleAgentVerification(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        //verify single agent
        //get single property
        this.getSingleProperty = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator('id') }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.service.getSingleProperty(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        ///get all property list public
        this.createProperty = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.service.createTourPackage(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        // update property
        this.updateProperties = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.service.updateProperties(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
        // get all property status
        this.getAllPropertyStatus = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.service.getAllPropertyStatus(req), { code } = _g, data = __rest(_g, ["code"]);
            res.status(code).json(data);
        }));
        // get all property types
        this.getAllPropertyTypes = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _h = yield this.service.getAllPropertyTypes(req), { code } = _h, data = __rest(_h, ["code"]);
            res.status(code).json(data);
        }));
        // get all eminities
        this.getAllAmenity = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _j = yield this.service.getAllAmenity(req), { code } = _j, data = __rest(_j, ["code"]);
            res.status(code).json(data);
        }));
        // get all features
        this.getAllFeatures = this.asyncWrapper.wrap(
        // { arrayBodySchema: this.ActivityValidator.createActivity },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _k = yield this.service.getAllFeatures(req), { code } = _k, data = __rest(_k, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = AdminAgentController;
