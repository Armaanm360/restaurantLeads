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
const abstract_service_1 = __importDefault(require("../../abstract/abstract.service"));
class AdminTeamService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //create team
    createTeam(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.adminTeamModel();
                const { organization_id } = req.admin;
                req.body["organization_id"] = organization_id;
                const checkUser = yield model.checkTeams(Number(organization_id), req.body.team_name);
                if (checkUser.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: "The Team Has Been Already Created",
                    };
                }
                const createTeam = yield model.createTeam(req.body);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: req.body,
                };
            }));
        });
    }
    //create team
    createVerifier(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.adminTeamModel();
                const teamId = Number(req.body["team_id"]);
                const verifierIds = req.body["verifier_id"];
                const operationType = req.body["type"];
                // Check if verifierIds is an array
                if (!Array.isArray(verifierIds)) {
                    throw new Error("verifier_id must be an array");
                }
                // Validate operation type
                if (operationType !== "insert" && operationType !== "remove") {
                    throw new Error('Invalid operation type. Must be either "insert" or "remove"');
                }
                if (operationType === "insert") {
                    // Check all verifiers for insert operation
                    for (const verifierId of verifierIds) {
                        const checkVerify = yield model.checkVerifiers(teamId, [
                            Number(verifierId),
                        ]);
                        if (checkVerify.length > 0) {
                            throw new Error(`Verifier already Exists`);
                        }
                    }
                    // Insert data using map
                    yield Promise.all(verifierIds.map((verifierId) => __awaiter(this, void 0, void 0, function* () {
                        return yield model.addVerifier({
                            team_id: teamId,
                            employee_id: Number(verifierId),
                        });
                    })));
                }
                else if (operationType === "remove") {
                    // Check all verifiers for remove operation
                    for (const verifierId of verifierIds) {
                        const checkVerify = yield model.checkVerifiers(teamId, [
                            Number(verifierId),
                        ]);
                        if (!checkVerify.length) {
                            throw new Error(`Verifier  does not exist for team`);
                        }
                    }
                    // Remove data using map
                    yield Promise.all(verifierIds.map((verifierId) => __awaiter(this, void 0, void 0, function* () {
                        return yield model.removeVerifier({
                            team_id: teamId,
                            employee_id: Number(verifierId),
                        });
                    })));
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: req.body,
                };
            }));
        });
    }
    // get all team
    getAllTeam(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { key, limit, skip } = req.query;
            const { organization_id } = req.admin;
            const model = this.Model.adminTeamModel();
            const { data, total } = yield model.getAllTeam(Number(organization_id), {
                key: key,
                limit: limit,
                skip: skip,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data,
                total,
            };
        });
    }
    // update team
    updateTeam(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id } = req.admin;
                const model = this.Model.adminTeamModel();
                const checkUser = yield model.checkTeams(Number(organization_id), req.body.team_name);
                if (checkUser.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: "The Team Has Been Already Created",
                    };
                }
                yield model.updateTeam(req.body, parseInt(req.params.id));
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Successfully Updated",
                };
            }));
        });
    }
    getEmployeeTeamWise(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const team_id = parseInt(req.params.team_id);
            const { key, limit, skip } = req.query;
            const { organization_id } = req.admin;
            const model = this.Model.adminTeamModel();
            const { teaminfo, teamVerifiers, data, total } = yield model.getTeamWiseMembers(Number(organization_id), team_id, {
                key: key,
                limit: limit,
                skip: skip,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
                data: data,
                total,
                teaminfo,
                teamVerifiers,
            };
        });
    }
    //Assign Employee to team
    assignEmployeeToTeam(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.adminTeamModel();
                yield model.assignEmployeeToTeam(req.body);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: req.body,
                };
            }));
        });
    }
    //Create Evaluate employee permission
    // public async createEvaluateEmployePermission(req: Request) {
    //   const { id } = req.admin;
    //   const model = this.Model.adminTeamModel();
    //   const { evaluate_assiociasor, evaluate_emp, team_id } = req.body;
    //   const evaluateEmpPayload = evaluate_emp.map((item: any) => {
    //     return {
    //       team_id,
    //       ev_associator: evaluate_assiociasor,
    //       ev_emp: item,
    //       created_by: id,
    //     };
    //   });
    //   await model.createEvaluateEmployePermission(evaluateEmpPayload);
    //   return {
    //     success: true,
    //     code: this.StatusCode.HTTP_SUCCESSFUL,
    //     message: "Permission added",
    //   };
    // }
    //Update Evaluate employee permission
    updateEvaluateEmployePermission(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { id } = req.admin;
                const model = this.Model.adminTeamModel(trx);
                const { ev_associator, rmv_evaluate_emp, added_evaluate_emp, team_id } = req.body;
                // get all evaluate employee by associator and team id
                const getAllEvEmployee = yield model.getEvaluateEmployePermissionByTeam({
                    team_id,
                    ev_associator_id: ev_associator,
                });
                let uniqueAddedEvEmp = [];
                for (let i = 0; i < (added_evaluate_emp === null || added_evaluate_emp === void 0 ? void 0 : added_evaluate_emp.length); i++) {
                    let found = false;
                    for (let j = 0; j < (getAllEvEmployee === null || getAllEvEmployee === void 0 ? void 0 : getAllEvEmployee.length); j++) {
                        if (added_evaluate_emp[i] == getAllEvEmployee[j].ev_emp_id) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        uniqueAddedEvEmp.push({
                            team_id,
                            ev_associator,
                            ev_emp: added_evaluate_emp[i],
                            created_by: id,
                        });
                    }
                }
                if (uniqueAddedEvEmp === null || uniqueAddedEvEmp === void 0 ? void 0 : uniqueAddedEvEmp.length) {
                    yield model.createEvaluateEmployePermission(uniqueAddedEvEmp);
                }
                if (rmv_evaluate_emp === null || rmv_evaluate_emp === void 0 ? void 0 : rmv_evaluate_emp.length) {
                    yield model.removeEvaluateEmployePermission({
                        rmv_evaluate_emp,
                        ev_associator,
                        team_id,
                    });
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Permission updated",
                };
            }));
        });
    }
    // get evaluate employee permission by team
    getEvaluateEmployePermissionByTeam(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.adminTeamModel();
            const data = yield model.getEvaluateEmployePermissionByTeam({
                team_id: req.params.team_id,
                ev_associator_id: parseInt(req.query.ev_associator_id),
            });
            const formatted_data = [];
            for (let i = 0; i < data.length; i++) {
                let found = false;
                for (let j = 0; j < formatted_data.length; j++) {
                    if (formatted_data[j].ev_associator_id == data[j].ev_associator_id) {
                        found = true;
                        formatted_data[j].permission.push({
                            ev_emp_id: data[i].ev_emp_id,
                            ev_emp_name: data[i].ev_emp_name,
                        });
                    }
                    break;
                }
                if (!found) {
                    formatted_data.push({
                        id: data[i].id,
                        team_id: data[i].team_id,
                        team_name: data[i].team_name,
                        ev_associator_id: data[i].ev_associator_id,
                        ev_associator_name: data[i].ev_associator_name,
                        permission: [
                            {
                                ev_emp_id: data[i].ev_emp_id,
                                ev_emp_name: data[i].ev_emp_name,
                            },
                        ],
                        created_by: data[i].created_by,
                        created_at: data[i].created_at,
                    });
                }
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                data: formatted_data[0],
            };
        });
    }
    //assign team leader
    assignEmployeeToTeamLeader(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.employeeModel();
                const teammodel = this.Model.adminTeamModel();
                const employee_id = req.body["employee_id"];
                const team_id = req.body["team_id"];
                /*check team*/
                // const checkTeamExsitence = await teammodel.getSingleTeam(team_id);
                // const checkEmployeeInTheTeam = await model.getSingleEmployee(team_id);
                // if (!checkTeamExsitence.length) {
                //   return {
                //     success: true,
                //     code: this.StatusCode.HTTP_BAD_REQUEST,
                //     message: 'Team Not Exsists',
                //   };
                // }
                // if (!checkEmployeeInTheTeam[0].team_id === team_id) {
                //   return {
                //     success: true,
                //     code: this.StatusCode.HTTP_BAD_REQUEST,
                //     message: 'Employee Doesnt Exsist To The Team',
                //   };
                // }
                /* Update Employee To Team Leader */
                const updateEmployeeToTeamLeader = yield model.updateEmployeeToTeamLeader(team_id, employee_id);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                };
            }));
        });
    }
    // remove employee from team
    removeEmployee(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.adminTeamModel();
            const { team_id, employee_id } = req.params;
            yield model.removeEmployee(parseInt(team_id), parseInt(employee_id));
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
            };
        });
    }
    // teamwise evaluation report
    teamWiseEvaluationReport(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const evaluation_id = parseInt(req.params.evaluation_id);
                const team_id = parseInt(req.params.team_id);
                const model = this.Model.userModel();
                //total exam in how marks?
                /* total count questions * 5 */
                // const checkIfQuestionAvailable = await model.getEvaluationInfo(
                //   association_id,
                //   evaluation_id
                // );
                const { total_questions } = yield model.getEvaluationInfoAll(evaluation_id);
                const setMarkStandard = 5;
                const exam_in = Number(total_questions.count) * setMarkStandard;
                // const getTeamMembers
                // //calculation
                // const getActualMarks = (evaluate_by: number, achieved_marks: number) => {
                //   if (evaluate_by == 1) {
                //     const calculate = (45 / 100) * achieved_marks;
                //     return parseFloat(calculate.toFixed(2));
                //   } else if (evaluate_by == 2) {
                //     const calculate = (35 / 100) * achieved_marks;
                //     return parseFloat(calculate.toFixed(2));
                //   } else if (evaluate_by == 3) {
                //     const calculate = (15 / 100) * achieved_marks;
                //     return parseFloat(calculate.toFixed(2));
                //   } else {
                //     const calculate = (5 / 100) * achieved_marks;
                //     return parseFloat(calculate.toFixed(2));
                //   }
                // };
                // //get level wise standard
                // const getStandard = (evaluate_by: number) => {
                //   if (evaluate_by == 1) {
                //     return 45;
                //   } else if (evaluate_by == 2) {
                //     return 35;
                //   } else if (evaluate_by == 3) {
                //     return 15;
                //   } else {
                //     return 5;
                //   }
                // };
                //user_wise_evaluation_actual_mark_get
                // const getUserMark = await model.getEvaluationMark(42, 95);
                // console.log(getUserMark);
                //set standard
                // const setStandard = await model.setStandardMark(evaluation_id);
                const teamMembers = yield model.getTeamWiseMembersGet(team_id);
                const resultArray = teamMembers.map((item) => item.emp_id);
                // Perform an asynchronous operation on each element of the array
                const teamReportsPromises = resultArray.map((evaluate_to) => __awaiter(this, void 0, void 0, function* () {
                    // Get data for the current evaluate_to
                    const { userMember } = yield model.testv2(evaluation_id, evaluate_to, team_id);
                    const profileInfo = yield model.getProfile(evaluate_to);
                    // Group data by evaluate_by dynamically
                    // ...
                    // Group data by evaluate_by dynamically
                    const groupedData = yield userMember.reduce((accPromise, item) => __awaiter(this, void 0, void 0, function* () {
                        const acc = yield accPromise;
                        const { evaluate_by } = item;
                        if (!acc[evaluate_by]) {
                            const userName = yield model.getProfile(evaluate_by);
                            acc[evaluate_by] = {
                                evaluate_by: userName[0].name,
                                evaluate_by_designation: userName[0].designation,
                                // evaluate_by_level: userName[0].level,
                                responses: [],
                                total_mark_achieved: 0,
                                total_questions: 0,
                                achieved_marks: 0,
                                exam_in: 0,
                                actual_mark: 0,
                                percentage: 0,
                                levelmark: 0,
                            };
                        }
                        // Sum option_mark for total_mark_achieved
                        acc[evaluate_by].total_mark_achieved += item.option_mark;
                        acc[evaluate_by].responses.push({
                            response_id: item.response_id,
                            question_id: item.question_id,
                            question: item.question,
                            evaluation_text: item.evaluation_text,
                            response: item.response,
                            mark: item.mark,
                            option_mark: item.option_mark,
                            evaluation_id: item.evaluation_id,
                            evaluated: item.evaluated,
                        });
                        // Count total questions
                        acc[evaluate_by].total_questions =
                            acc[evaluate_by].responses.length;
                        // evaluation
                        acc[evaluate_by].achieved_marks =
                            acc[evaluate_by].total_mark_achieved;
                        acc[evaluate_by].exam_in = exam_in;
                        // acc[evaluate_by].actual_mark = getActualMarks(
                        //   acc[evaluate_by].evaluate_by_level,
                        //   acc[evaluate_by].achieved_marks
                        // );
                        // acc[evaluate_by].percentage = getActualMarks(
                        //   acc[evaluate_by].evaluate_by_level,
                        //   acc[evaluate_by].achieved_marks
                        // );
                        // acc[evaluate_by].levelmark = getStandard(
                        //   acc[evaluate_by].evaluate_by_level
                        // );
                        return acc;
                    }), Promise.resolve({}));
                    // ...
                    const evaluateByDataArray = Object.values(groupedData);
                    // const { avarage_with, getSpecificAvarage, getMark } =
                    //   await model.getEvaluationMark(evaluation_id, evaluate_to);
                    const evaluated_by_people = yield model.getEvaluationByPeople(evaluation_id, evaluate_to);
                    const { getMark } = yield model.getEvaluationMark(evaluation_id, evaluate_to);
                    const avaragePercentage = getMark / Number(evaluated_by_people);
                    const total_examine_mark = yield model.getEvaluationQuestionMarks(evaluation_id);
                    const percentage = (avaragePercentage / (Number(total_examine_mark) * 5)) * 100;
                    return {
                        evaluate_to,
                        evaluate_to_name: profileInfo[0].name,
                        evaluate_to_designation: profileInfo[0].designation,
                        evaluate_to_level: profileInfo[0].level,
                        evaluation_people: evaluated_by_people,
                        evaluation_exam_in: Number(total_examine_mark) * 5,
                        evaluation_total_mark: getMark,
                        avaragePercentage: percentage,
                        evaluation_avarage_mark: avaragePercentage,
                        // get_total_logs: await model.getTotalLogsOfUser(evaluate_to),
                        // get_total_remarked_logs: await model.getTotalLogsRemarkedOfUser(
                        //   evaluate_to
                        // ),
                        // get_total_verified_logs: await model.getTotalVerifiedLogsOfUser(
                        //   evaluate_to
                        // ),
                        evaluateByData: evaluateByDataArray,
                    };
                }));
                // Wait for all asynchronous operations to complete
                const teamReports = yield Promise.all(teamReportsPromises);
                const teamInfo = yield model.teamInfo(team_id);
                const evaluationame = yield model.getEvaluationInfo(evaluation_id);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: teamReports,
                    teamname: teamInfo[0].team_name,
                    evaluationame: evaluationame[0].evaluation_name,
                };
            }));
        });
    }
}
exports.default = AdminTeamService;
