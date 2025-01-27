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
class EvaluationModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // insert user admin
    createEvaluation(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('evaluations')
                .withSchema(this.EVO)
                .insert(payload, 'evaluation_id');
        });
    }
    // evaluation_template
    createEvaluationTemplate(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('templates')
                .withSchema(this.EVO)
                .insert(payload, 'template_id');
        });
    }
    //checkEvaluation exsists
    checkEvaluationExsists(ev_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db('evaluations')
                .withSchema(this.EVO)
                .where({ evaluation_id: ev_id })
                .select('*');
            return userMember;
        });
    }
    //check Evaluation and team_id exsists
    checkEvaluationTeamExsists(ev_id, team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db('eligible_evaluation_teams')
                .withSchema(this.EVO)
                .where({ evaluation_id: ev_id })
                .andWhere({ team_id: team_id })
                .select('*');
            return userMember;
        });
    }
    //create evaluation eligibility
    assignEvaluationToTeam(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('eligible_evaluation_teams')
                .withSchema(this.EVO)
                .insert(payload);
        });
    }
    //update teamwiseEvaluation
    updateTeamWiseEvaluation(eligible_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('eligible_evaluation_teams')
                .withSchema(this.EVO)
                .where('eligible_id', eligible_id)
                .insert(payload);
        });
    }
    //get evaluation list
    getEvaluation(association_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db('eligable_evaluations')
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .select('*');
            return userMember;
        });
    }
    //update evaluation
    updateEvaluation(evaluation_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('evaluations')
                .withSchema(this.EVO)
                .where({ evaluation_id: evaluation_id })
                .update(payload);
        });
    }
    // insert evaluation items
    insertEvaluationItems(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db('eligible_evaluation_teams')
                .withSchema(this.EVO)
                .insert(payload);
        });
    }
    // get evaluations by team
    getAllEvaluationByTeam(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db('eligible_evaluation_teams As et')
                .withSchema(this.EVO)
                .select('ev.evaluation_id', 'ev.evaluation_name', 'ev.status', 'ev.evaluation_date_start', 'ev.evaluation_date_end')
                .leftJoin('evaluations as ev', 'et.evaluation_id', 'ev.evaluation_id')
                .where('et.team_id', team_id);
            return userMember;
        });
    }
    // get All Evaluations
    getAllEvaluations(organization_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, limit, skip } = payload;
            const dtbs = this.db('evaluations as ev');
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.EVO)
                .select('*')
                .where({ organization_id })
                .andWhere(function () {
                if (key) {
                    this.where('ev.evaluation_name', 'like', `%${key}%`);
                }
            })
                .orderBy('evaluation_id', 'desc');
            const total = yield this.db('evaluations')
                .withSchema(this.EVO)
                .count('evaluation_id as total')
                .where({ organization_id })
                .andWhere(function () {
                if (key) {
                    this.andWhere('evaluation_name', 'like', `%${key}%`).orWhere('evaluation_name', 'like', `%${key}%`);
                }
            });
            return { data, total: parseInt(total[0].total) };
        });
    }
    // get All Evaluations TeamWise
    getTeamWiseEvaluationList(team_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, limit, skip } = payload;
            const dtbs = this.db('eligible_evaluation_teams as et');
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.EVO)
                .where('et.team_id', team_id)
                .leftJoin('evaluations as ev', 'ev.evaluation_id', '=', 'et.evaluation_id')
                .andWhere(function () {
                if (key) {
                    this.andWhere('ev.evaluation_name', 'like', `%${key}%`);
                }
            })
                .select('et.eligible_id', 'et.evaluation_id', 'et.team_id', 'et.status', 'ev.evaluation_code', 'ev.evaluation_description', 'ev.evaluation_date_start', 'ev.evaluation_date_end', 'ev.evaluation_name')
                .orderBy('et.eligible_id', 'desc');
            const total = yield this.db('eligible_evaluation_teams as et')
                .withSchema(this.EVO)
                .count('et.eligible_id as total')
                .where('et.team_id', team_id)
                .leftJoin('evaluations as ev', 'ev.evaluation_id', '=', 'et.evaluation_id')
                .andWhere(function () {
                if (key) {
                    this.andWhere('ev.evaluation_name', 'like', `%${key}%`);
                }
            });
            return { data, total: parseInt(total[0].total) };
        });
    }
    // get evaluations by team
    getAllEvaluationTemplates(association_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db('eligible_evaluation_teams As et')
                .withSchema(this.EVO)
                .select('ev.evaluation_id', 'ev.evaluation_name', 'ev.status', 'ev.evaluation_date_start', 'ev.evaluation_date_end')
                .leftJoin('evaluations as ev', 'et.evaluation_id', 'ev.evaluation_id')
                .andWhere('ev.association_id', association_id);
            return userMember;
        });
    }
}
exports.default = EvaluationModel;
