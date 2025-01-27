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
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class adminQuestionModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // insert question
    createQuestion(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.db('questions_v2')
                .withSchema(this.EVO)
                .insert(payload)
                .returning('*');
            return table;
        });
    }
    // update question
    updateQuestion(question_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.db('questions_v2')
                .withSchema(this.EVO)
                .where({ question_id_v2: question_id })
                .update(payload)
                .returning('*');
            return table;
        });
    }
    createTemplateQuestion(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.db('template_questions')
                .withSchema(this.EVO)
                .insert(payload)
                .returning('*');
            return table;
        });
    }
    //insert question option
    createTemplateOptions(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.db('template_options')
                .withSchema(this.EVO)
                .insert(payload);
            return table;
        });
    }
    createOptions(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.db('option_v2')
                .withSchema(this.EVO)
                .insert(payload);
            return table;
        });
    }
    getEvaluationQuestions(evaluation_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, limit, skip } = payload;
            const dtbs = this.db('questions_v2_view as qv');
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.EVO)
                .select('*')
                .orderBy('qv.question_id_v2', 'desc')
                .where('qv.evaluation_id', evaluation_id)
                .andWhere('qv.is_deleted', false)
                .andWhere(function () {
                if (key) {
                    this.andWhere('question', 'like', `%${key}%`).orWhere('question', 'like', `%${key}%`);
                }
            });
            const total = yield this.db('questions_v2_view')
                .withSchema(this.EVO)
                .count('question_id_v2 as total')
                .where('evaluation_id', evaluation_id)
                .andWhere('is_deleted', false)
                .where(function () {
                if (key) {
                    this.andWhere('question', 'like', `%${key}%`).orWhere('question', 'like', `%${key}%`);
                }
            });
            return {
                data,
                total: parseInt(total[0].total),
            };
        });
    }
    // delete evaluations question
    deleteEvaluationQuestion(evaluation_id, q_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('questions_v2')
                .withSchema(this.EVO)
                .where({ evaluation_id: evaluation_id })
                .andWhere('question_id_v2', q_id)
                .update('is_deleted', true);
        });
    }
    // delete evaluations question
    deleteQuestionOption(q_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('option_v2')
                .withSchema(this.EVO)
                .where('question_v2_id', q_id)
                .del();
        });
    }
}
exports.default = adminQuestionModel;
