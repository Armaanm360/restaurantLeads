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
class AdminQuestionService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //create question
    createQuestion(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.admin;
                const model = this.Model.adminQuestionModel(trx);
                req.body["provided_by"] = id;
                const _a = req.body, { options } = _a, rest = __rest(_a, ["options"]);
                const inserted = yield model.createQuestion(rest);
                const generateDataToInsert = (question_id_v2) => {
                    return options.map((stallNumber) => ({
                        question_v2_id: inserted[0].question_id_v2,
                        option_name: stallNumber.options,
                        option_mark: stallNumber.option_mark,
                    }));
                };
                const dataToInsert = generateDataToInsert(inserted[0].question_id_v2);
                yield model.createOptions(dataToInsert);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.StatusCode.HTTP_SUCCESSFUL,
                    data: req.body,
                };
            }));
        });
    }
    // get all evaluation question
    getQuestions(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, limit, skip } = req.query;
            const evaluation_id = parseInt(req.params.id);
            const { data, total } = yield this.Model.adminQuestionModel().getEvaluationQuestions(evaluation_id, {
                key: key,
                limit: limit,
                skip: skip,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: data,
                total,
            };
        });
    }
    // delete evaluation question
    deleteQuestion(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.adminQuestionModel();
            // delete option
            yield model.deleteQuestionOption(parseInt(req.params.id));
            // delete question
            const questions = yield model.deleteEvaluationQuestion(parseInt(req.params.id), parseInt(req.params.ev_id));
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
    //create question
    updateQuestion(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.admin;
                const question_id = parseInt(req.params.id);
                const model = this.Model.adminQuestionModel(trx);
                req.body["provided_by"] = id;
                const _a = req.body, { options } = _a, rest = __rest(_a, ["options"]);
                const updated = yield model.updateQuestion(question_id, rest);
                const generateDataToInsert = (question_id_v2) => {
                    return options.map((stallNumber) => ({
                        question_v2_id: updated[0].question_id_v2,
                        option_name: stallNumber.options,
                        option_mark: stallNumber.option_mark,
                    }));
                };
                const dataToInsert = generateDataToInsert(updated[0].question_id_v2);
                yield model.createOptions(dataToInsert);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.StatusCode.HTTP_SUCCESSFUL,
                    data: req.body,
                };
            }));
        });
    }
}
exports.default = AdminQuestionService;
