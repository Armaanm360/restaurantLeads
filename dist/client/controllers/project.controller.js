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
const project_validator_1 = __importDefault(require("../../appAdmin/utils/validators/project.validator"));
const project_service_1 = __importDefault(require("../services/project.service"));
class employeeProjectController extends abstract_controller_1.default {
    constructor() {
        super();
        this.employeeProjectService = new project_service_1.default();
        this.projectValidator = new project_validator_1.default();
        //get assigned projects
        this.getMyAssignedProjects = this.asyncWrapper.wrap(
        // { bodySchema: this.commonValidator.queryListLimitSkip },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = yield this.employeeProjectService.getMyAssignedProjects(req), { code } = _a, data = __rest(_a, ["code"]);
            res.status(code).json(data);
        }));
        //get single project
        this.getSingleProject = this.asyncWrapper.wrap(
        // { bodySchema: this.commonValidator.queryListLimitSkip },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _b = yield this.employeeProjectService.getSingleProject(req), { code } = _b, data = __rest(_b, ["code"]);
            res.status(code).json(data);
        }));
        //get task wise parts
        this.getTaskWiseParts = this.asyncWrapper.wrap(
        // { bodySchema: this.commonValidator.queryListLimitSkip },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _c = yield this.employeeProjectService.getTaskWiseParts(req), { code } = _c, data = __rest(_c, ["code"]);
            res.status(code).json(data);
        }));
        //get my project wise task part
        this.getPartWiseTasks = this.asyncWrapper.wrap(
        // { bodySchema: this.commonValidator.queryListLimitSkip },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _d = yield this.employeeProjectService.getPartWiseTasks(req), { code } = _d, data = __rest(_d, ["code"]);
            res.status(code).json(data);
        }));
        //update single task
        this.updateTask = this.asyncWrapper.wrap(
        // { bodySchema: this.commonValidator.queryListLimitSkip },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _e = yield this.employeeProjectService.updateTask(req), { code } = _e, data = __rest(_e, ["code"]);
            res.status(code).json(data);
        }));
        //get single task
        this.getSingleTask = this.asyncWrapper.wrap(
        // { bodySchema: this.commonValidator.queryListLimitSkip },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _f = yield this.employeeProjectService.getSingleTask(req), { code } = _f, data = __rest(_f, ["code"]);
            res.status(code).json(data);
        }));
        //create new task part against project
        this.createNewTaskPart = this.asyncWrapper.wrap(
        // { bodySchema: this.commonValidator.queryListLimitSkip },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _g = yield this.employeeProjectService.createNewTaskPart(req), { code } = _g, data = __rest(_g, ["code"]);
            res.status(code).json(data);
        }));
        //create new task
        this.createNewTask = this.asyncWrapper.wrap(
        // { bodySchema: this.commonValidator.queryListLimitSkip },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _h = yield this.employeeProjectService.createNewTask(req), { code } = _h, data = __rest(_h, ["code"]);
            res.status(code).json(data);
        }));
        //create new comments under tasks
        this.createComment = this.asyncWrapper.wrap(
        // { bodySchema: this.commonValidator.queryListLimitSkip },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _j = yield this.employeeProjectService.createComment(req), { code } = _j, data = __rest(_j, ["code"]);
            res.status(code).json(data);
        }));
        //update  comment
        this.updateComment = this.asyncWrapper.wrap(
        // { bodySchema: this.commonValidator.queryListLimitSkip },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _k = yield this.employeeProjectService.updateComment(req), { code } = _k, data = __rest(_k, ["code"]);
            res.status(code).json(data);
        }));
        //delete  comment
        this.deleteComment = this.asyncWrapper.wrap(
        // { bodySchema: this.commonValidator.queryListLimitSkip },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _l = yield this.employeeProjectService.deleteComment(req), { code } = _l, data = __rest(_l, ["code"]);
            res.status(code).json(data);
        }));
        //add reaction to the comment
        this.reactionComment = this.asyncWrapper.wrap(
        // { bodySchema: this.commonValidator.queryListLimitSkip },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _m = yield this.employeeProjectService.reactionComment(req), { code } = _m, data = __rest(_m, ["code"]);
            res.status(code).json(data);
        }));
        //add new card
        this.addCard = this.asyncWrapper.wrap(
        // { bodySchema: this.commonValidator.queryListLimitSkip },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _o = yield this.employeeProjectService.addCard(req), { code } = _o, data = __rest(_o, ["code"]);
            res.status(code).json(data);
        }));
        //update card position
        this.updateCardPosition = this.asyncWrapper.wrap(
        // { bodySchema: this.commonValidator.queryListLimitSkip },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _p = yield this.employeeProjectService.updateCardPosition(req), { code } = _p, data = __rest(_p, ["code"]);
            res.status(code).json(data);
        }));
        //delete card
        this.deleteCard = this.asyncWrapper.wrap(
        // { bodySchema: this.commonValidator.queryListLimitSkip },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _q = yield this.employeeProjectService.deleteCard(req), { code } = _q, data = __rest(_q, ["code"]);
            res.status(code).json(data);
        }));
        //delete task
        this.deleteTask = this.asyncWrapper.wrap(
        // { bodySchema: this.commonValidator.queryListLimitSkip },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _r = yield this.employeeProjectService.deleteTask(req), { code } = _r, data = __rest(_r, ["code"]);
            res.status(code).json(data);
        }));
        //updateCardPosition
        //create project documentation
        this.createProjectDocumentation = this.asyncWrapper.wrap({
            bodySchema: this.projectValidator.createProjectDocuments,
        }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _s = yield this.employeeProjectService.createProjectDocuments(req), { code } = _s, data = __rest(_s, ["code"]);
            res.status(code).json(data);
        }));
        //update project documentation
        this.updateProjectDocuments = this.asyncWrapper.wrap(
        // {
        //   bodySchema: this.ProjectValidator.createProjectDocuments,
        // },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _t = yield this.employeeProjectService.updateProjectDocuments(req), { code } = _t, data = __rest(_t, ["code"]);
            res.status(code).json(data);
        }));
        //delete  project documentation
        this.deleteProjectDocuments = this.asyncWrapper.wrap(
        // {
        //   bodySchema: this.ProjectValidator.createProjectDocuments,
        // },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _u = yield this.employeeProjectService.deleteProjectDocuments(req), { code } = _u, data = __rest(_u, ["code"]);
            res.status(code).json(data);
        }));
        //add or remove employee to the project!
        this.addRemoveEmployee = this.asyncWrapper.wrap(
        // {
        //   paramSchema: this.commonValidator.singleParamValidator('id'),
        //   bodySchema: this.ProjectValidator.createProjectDocuments,
        // },
        {}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _v = yield this.employeeProjectService.addRemoveEmployee(req), { code } = _v, data = __rest(_v, ["code"]);
            res.status(code).json(data);
        }));
        // add tracking
        this.addTrack = this.asyncWrapper.wrap({}, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _w = yield this.employeeProjectService.addTrack(req), { code } = _w, data = __rest(_w, ["code"]);
            res.status(code).json(data);
        }));
    }
}
exports.default = employeeProjectController;
