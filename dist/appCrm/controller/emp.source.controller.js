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
const emp_source_service_1 = __importDefault(require("../service/emp.source.service"));
const source_validation_1 = __importDefault(require("../utils/validation/setting/source.validation"));
class SourceEmpController extends abstract_controller_1.default {
    constructor() {
        super();
        this.SourceService = new emp_source_service_1.default();
        this.validator = new source_validation_1.default();
        // create source controller
        this.createSource = this.asyncWrapper.wrap({ bodySchema: this.validator.createSourceValidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.SourceService.createSource(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        // retrieve sources from db
        this.retrieveSources = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.SourceService.retrieveSources(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        // update source controller
        this.updateSources = this.asyncWrapper.wrap({
            bodySchema: this.validator.updateSourceValidator,
            paramSchema: this.commonValidator.singleParamValidator("id"),
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.SourceService.updateSources(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        // delete source
        this.deleteSource = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator("id") }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.SourceService.deleteSource(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        this.retrieveSingleSource = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator("id") }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.SourceService.retrieveSingleSource(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        // get all lead by source
        this.getAllLeadsBySource = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamValidator("id") }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.SourceService.getAllLeadsBySource(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = SourceEmpController;
