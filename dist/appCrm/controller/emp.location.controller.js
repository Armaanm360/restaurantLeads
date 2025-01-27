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
const emp_location_service_1 = __importDefault(require("../service/emp.location.service"));
const location_validation_1 = __importDefault(require("../utils/validation/setting/location.validation"));
class CrmEmpLocationController extends abstract_controller_1.default {
    constructor() {
        super();
        this.service = new emp_location_service_1.default();
        this.validator = new location_validation_1.default();
        // get address
        this.getAllAddress = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.service.getAllAddress(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        // add country
        this.addCountry = this.asyncWrapper.wrap({ bodySchema: this.validator.addCountryvalidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.service.addCountry(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        // update country
        this.updateCountry = this.asyncWrapper.wrap({
            bodySchema: this.validator.updateCountryvalidator,
            paramSchema: this.commonValidator.singleParamStringValidator("id"),
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.service.updateCountry(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        // retrieve country
        this.retrieveCountry = this.asyncWrapper.wrap(null, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.service.retrieveCountry(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        // get all city by country
        this.getAllCityByCountry = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamStringValidator("id") }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.service.getAllCityByCountry(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        // get all area by city
        this.getAllAreaByCity = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamStringValidator("id") }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.service.getAllAreaByCity(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
        // delete country
        this.deleteCountry = this.asyncWrapper.wrap({ paramSchema: this.commonValidator.singleParamStringValidator("id") }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.service.deleteCountry(req), { code } = _g, data = __rest(_g, ["code"]);
            res.status(code).json(data);
        }));
        // add city controller
        this.addCity = this.asyncWrapper.wrap({ bodySchema: this.validator.addCityvalidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _h = yield this.service.addCity(req), { code } = _h, data = __rest(_h, ["code"]);
            res.status(code).json(data);
        }));
        // update city
        this.updateCity = this.asyncWrapper.wrap({
            bodySchema: this.validator.updateCityvalidator,
            paramSchema: this.commonValidator.singleParamStringValidator("id"),
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _j = yield this.service.updateCity(req), { code } = _j, data = __rest(_j, ["code"]);
            res.status(code).json(data);
        }));
        // add area
        this.addArea = this.asyncWrapper.wrap({ bodySchema: this.validator.addAreavalidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _k = yield this.service.addArea(req), { code } = _k, data = __rest(_k, ["code"]);
            res.status(code).json(data);
        }));
        // update area
        this.updateArea = this.asyncWrapper.wrap({ bodySchema: this.validator.addAreavalidator }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _l = yield this.service.updateArea(req), { code } = _l, data = __rest(_l, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = CrmEmpLocationController;
