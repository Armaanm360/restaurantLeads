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
class AdminEvaluationService extends abstract_service_1.default {
    constructor() {
        super();
    }
    createEvaluation(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id } = req.admin;
                req.body["organization_id"] = organization_id;
                const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                let code = "";
                for (let i = 0; i < 9; i++) {
                    const randomIndex = Math.floor(Math.random() * alphabet.length);
                    code += alphabet.charAt(randomIndex);
                }
                req.body["evaluation_code"] = code;
                const model = this.Model.adminEvaluationModel(trx);
                const evRes = yield model.createEvaluation(req.body);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: req.body,
                };
            }));
        });
    }
    //create question
    createQuestion(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.admin;
                const association = this.Model.adminQuestionModel(trx);
                const _a = req.body, { options } = _a, rest = __rest(_a, ["options"]);
                const inserted = yield association.createTemplateQuestion(rest);
                const generateDataToInsert = (template_question_id) => {
                    return options.map((stallNumber) => ({
                        question_v2_id: inserted[0].template_question_id,
                        option_name: stallNumber.options,
                        option_mark: stallNumber.option_mark,
                    }));
                };
                const dataToInsert = generateDataToInsert(inserted[0].template_question_id);
                yield association.createOptions(dataToInsert);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.StatusCode.HTTP_SUCCESSFUL,
                    data: req.body,
                };
            }));
        });
    }
    //create eligable team evaluation
    createEligableTeamEvaluation(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                    const body = req.body;
                    const model = this.Model.adminEvaluationModel(trx);
                    // insert evaluation item
                    yield model.insertEvaluationItems(body);
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: this.ResMsg.HTTP_SUCCESSFUL,
                        data: req.body,
                    };
                }));
            }));
        });
    }
    // get all evaluations
    getAllEvaluations(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, limit, skip } = req.query;
            const { organization_id } = req.admin;
            const { data, total } = yield this.Model.adminEvaluationModel().getAllEvaluations(organization_id, {
                key: key,
                limit: limit,
                skip: skip,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                data: data,
                total,
            };
        });
    }
    // get all evaluations team wise
    getTeamWiseEvaluationList(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, limit, skip } = req.query;
            const team_id = parseInt(req.params.id);
            const { data, total } = yield this.Model.adminEvaluationModel().getTeamWiseEvaluationList(team_id, {
                key: key,
                limit: limit,
                skip: skip,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                data: data,
                total,
            };
        });
    }
    //new
    getEvaluationScoreTeamWise(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id } = req.admin;
            // Step 1: Retrieve teams associated with a particular association
            const teams = yield this.Model.adminTeamModel().getTeam(organization_id);
            // Array to store processed team data
            const processedTeams = [];
            // Step 2: For each team, retrieve the evaluation IDs and calculate total average marks
            for (const team of teams) {
                const evaluations = yield this.Model.adminTeamModel().getTeamWiseEvaluations(team.team_id);
                // Calculate total average marks for the team
                let totalMarks = 0;
                let totalEvaluations = 0;
                for (const evaluation of evaluations) {
                    // Assuming you have a method to retrieve marks for an evaluation
                    const marks = yield this.Model.adminTeamModel().getResponseMarks(evaluation.evaluation_id);
                    // Assuming marks are in an array or can be calculated from the retrieved data
                    if (marks && marks) {
                        const total = marks.reduce((acc, mark) => acc + mark.option_mark, 0);
                        totalMarks += total; // Assuming marks are numeric values
                        totalEvaluations++;
                    }
                }
                // Calculate the average total marks for the team
                const totalAverageMarks = totalEvaluations;
                processedTeams.push({
                    team_id: team.team_id,
                    team_name: team.team_name,
                    total_average_marks: totalAverageMarks,
                });
            }
            // Step 4: Sort the teams based on their total average marks to determine the rank
            processedTeams.sort((a, b) => b.total_average_marks - a.total_average_marks);
            // Step 5: Format the data according to the desired output
            const rankedTeams = processedTeams.map((team, index) => (Object.assign(Object.assign({}, team), { rank: index + 1 })));
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                data: {
                    teams: rankedTeams,
                },
            };
        });
    }
    getTestAvarageOfTeam(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id } = req.admin;
            const teams = yield this.Model.adminTeamModel().getTeam(organization_id);
            // Calculate and add team_avg field to each team object
            for (let team of teams) {
                const { averageTeamPerformancePercentage } = yield this.Model.adminTeamModel().getTestAvarageOfTeam(team.team_id);
                team.team_avg = averageTeamPerformancePercentage;
            }
            // Sort teams array by team_avg in descending order
            teams.sort((a, b) => b.team_avg - a.team_avg);
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                data: teams,
            };
        });
    }
    //  update evaluations
    updateEvaluation(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.params;
                const model = this.Model.adminEvaluationModel();
                yield model.updateEvaluation(parseInt(id), req.body);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    //assign evaluation to team
    assignEvaluationToTeam(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.adminEvaluationModel();
                const evaluation_id = parseInt(req.body["evaluation_id"]);
                const team_id = parseInt(req.body["team_id"]);
                //cross check
                /* check evaluation */
                const checkEvaluation = yield model.checkEvaluationExsists(evaluation_id);
                /* check team */
                const checkTeam = yield this.Model.adminTeamModel().getSingleTeam({
                    team_id,
                });
                if (checkEvaluation.length) {
                    if (checkTeam.length) {
                        const crosscheck = yield model.checkEvaluationTeamExsists(evaluation_id, team_id);
                        if (crosscheck.length) {
                            return {
                                success: true,
                                code: this.StatusCode.HTTP_SUCCESSFUL,
                                message: "Already Added This Evaluation With  The Team",
                            };
                        }
                        else {
                            const insert_eligibilty = yield model.assignEvaluationToTeam(req.body);
                            return {
                                success: true,
                                code: this.StatusCode.HTTP_SUCCESSFUL,
                                message: "Assigned Evaluation With The Successfully",
                            };
                        }
                    }
                    else {
                        return {
                            success: true,
                            code: this.StatusCode.HTTP_SUCCESSFUL,
                            message: "Team Not Found",
                        };
                    }
                }
                else {
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: "Evaluation Not Found",
                    };
                }
            }));
        });
    }
    //update evaluation team wise
    updateTeamWiseEvaluation(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.adminEvaluationModel();
                const eligible_id = parseInt(req.params.id);
                const status = req.body["status"];
                if (status === "active" || status === "inactive") {
                    //evaluation status update
                    const updateTeamWiseEvaluaiton = yield model.updateTeamWiseEvaluation(eligible_id, req.body);
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: "Evaluation Status Updated Successfull",
                    };
                }
                else {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: "Invalid Status",
                    };
                }
            }));
        });
    }
}
exports.default = AdminEvaluationService;
