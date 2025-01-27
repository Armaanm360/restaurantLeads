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
class AdminActivityService extends abstract_service_1.default {
    constructor() {
        super();
    }
    getActivityTeamWise(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                //const user_id = req.employee.id;
                const model = this.Model.memberActivityModel();
                const team_id = parseInt(req.params.id);
                //params for filtering
                const { from_date, to_date, employee, team_leader_verification, remarks, email, limit, skip, } = req.query;
                // const team_id = await model.getTeam(employee_id);
                const { data, total } = yield model.getActivitiesTeamWise(team_id, {
                    from_date: from_date,
                    to_date: to_date,
                    employee: employee,
                    team_leader_verification: team_leader_verification,
                    remarks: remarks,
                    email: email,
                    limit: limit,
                    skip: skip,
                });
                const teaminfo = yield model.getTeamTotalInfo(team_id);
                const teamMembers = yield model.getTeamMembers(team_id);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: data,
                    total: "Armaan",
                    team_name: teaminfo[0].team_name,
                    team_leader: teaminfo[0].name,
                    team_leader_designation: teaminfo[0].designation,
                    team_members: teamMembers,
                };
            }));
        });
    }
    getAllActivities(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id } = req.admin;
                const model = this.Model.memberActivityModel();
                const { data, total, total_verified, total_unverified } = yield model.getAllActivities(organization_id, req);
                // Process the data to calculate time difference
                // const processedData = data.map((item) => {
                //   const logDatetime = new Date(item.log_datetime);
                //   const createdAt = new Date(item.log_created_at);
                //   // Calculate time difference in milliseconds
                //   let timeDiff = logDatetime.getTime() - createdAt.getTime();
                //   // Ensure the difference is always positive and within 24 hours
                //   if (timeDiff < 0) {
                //     timeDiff += 24 * 60 * 60 * 1000; // Add 24 hours if log_datetime is earlier
                //   }
                //   // Convert to hours, minutes, seconds
                //   const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                //   const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                //   const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
                //   // Format the time difference
                //   const timeDiffFormatted = `${hours
                //     .toString()
                //     .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
                //     .toString()
                //     .padStart(2, '0')}`;
                //   return {
                //     ...item,
                //     time_difference: timeDiffFormatted,
                //   };
                // });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    data: data,
                    total,
                    total_verified,
                    total_unverified,
                };
            }));
        });
    }
    getAllOtherActivities(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id } = req.admin;
            const model = this.Model.memberActivityModel();
            const { limit, skip, from_date, to_date, emp_id } = req.query;
            const leadModel = this.Model.crmLeadModel();
            const { data, total } = yield leadModel.getAllOtherActivities({
                emp_id: parseInt(emp_id),
                organization_id,
                limit: parseInt(limit),
                skip: parseInt(skip),
                from_date: from_date,
                to_date: to_date,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                total,
                data,
            };
        });
    }
    getMyActivity(req) {
        return __awaiter(this, void 0, void 0, function* () {
            //const user_id = req.employee.id;
            const { id } = req.employee;
            const model = this.Model.memberActivityModel();
            // const data = await model.getMyActivities(id);
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
                data: [],
            };
        });
    }
    getActivityDashboard(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, from_date, to_date, team_id } = req.query;
            const { organization_id } = req.admin;
            // Get teams data
            const teams = yield this.Model.adminTeamModel().getTeam(organization_id);
            const getTeamActivityData = (teamId) => __awaiter(this, void 0, void 0, function* () {
                const callingApi = yield this.Model.adminActivityModel().getTeamWiseActivityData(teamId, from_date, to_date);
                // Assuming callingApi returns the data in the required format
                // If not, you may need to transform the data here
                return callingApi;
            });
            // Map over teams and add the new column
            const teamsWithActivityData = yield Promise.all(teams.map((team) => __awaiter(this, void 0, void 0, function* () {
                const activityData = yield getTeamActivityData(team.team_id);
                return Object.assign(Object.assign({}, team), { activities: activityData });
            })));
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: teamsWithActivityData,
            };
        });
    }
    createPrayerTimes(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.adminActivityModel();
                const { organization_id, id } = req.admin;
                req.body["organization_id"] = organization_id;
                const timeCheck = yield model.checkPrayerTimes(organization_id);
                if (timeCheck.length) {
                    yield model.updatePrayerTimes(organization_id, req.body);
                }
                else {
                    yield model.createPrayerTimes(req.body);
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: "Jamat Prayer Updated Successfully",
                };
            }));
        });
    }
    getPrayerTimes(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id } = req.admin;
            const prayerTimes = yield this.Model.memberActivityModel().getPrayerTimes(organization_id);
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
                data: prayerTimes.prayer_times,
            };
        });
    }
}
exports.default = AdminActivityService;
