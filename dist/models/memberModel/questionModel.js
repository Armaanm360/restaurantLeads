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
class questionModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    createQuestionV2(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.db("questions_v2")
                .withSchema(this.EVO)
                .insert(payload)
                .returning("*");
            return table;
        });
    }
    //invoice items
    createOptions(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield this.db("option_v2")
                .withSchema(this.EVO)
                .insert(payload);
            return table;
        });
    }
    getEvaluationQuestionsLevel(evaluation_id, level) {
        return __awaiter(this, void 0, void 0, function* () {
            const evaluationQuestions = yield this.db("questions_v2_view")
                .withSchema(this.EVO)
                .where({ evaluation_id: evaluation_id })
                .andWhere({ provided_for: level })
                .select("*");
            return evaluationQuestions;
        });
    }
    getEvaluationQuestions(evaluation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const evaluationQuestions = yield this.db("questions_v2_view")
                .withSchema(this.EVO)
                .where({ evaluation_id: evaluation_id })
                .select("*");
            // .select(
            //   'question_id_v2 as question_id',
            //   'question',
            //   'provided_by',
            //   'provided_for',
            //   'is_deleted',
            //   'evaluation_id',
            //   'status',
            //   'created_at'
            // );
            return evaluationQuestions;
        });
    }
}
exports.default = questionModel;
