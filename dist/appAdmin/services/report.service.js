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
class AdminReportService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //create team
    getPersonWiseMeeting(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id } = req.admin;
            const allEmployees = yield this.Model.employeeModel().getOrganizationEmployees(organization_id);
            const data = yield this.Model.adminMeetingModel().getAllPersonsInMeeting(organization_id, req);
            // const getData = [];
            // for (const empId of employees) {
            //   const employeeDetails =
            //     await this.Model.employeeModel().getSingleInfoEmployee(empId);
            //   // Fetch meetings for the current employee
            //   const { data, total } =
            //     await this.Model.reportModel().getPersonWiseMeetingReport(req);
            //   // Structure the employee data with meetings
            //   const employeeData = {
            //     id: employeeDetails.id,
            //     name: employeeDetails.name,
            //     total: employeeDetails.total,
            //     meeting: data,
            //   };
            //   // Push the structured data to dataist
            //   getData.push(employeeData);
            // }
            // const { person_id } = (req as any).query;
            // const { data, total } =
            //   await this.Model.reportModel().getPersonWiseMeetingReport({ person_id });
            // const single = await this.Model.reportModel().getPersonWiseMeetingReport(
            //   req
            // );
            // let empList = getAllEmployee.map((item) => item.person_id);
            // let getData = [];
            // // Loop to fetch details for each employee
            // for (const empId of empList) {
            //   const employeeDetails =
            //     await this.Model.employeeModel().getSingleInfoEmployee(empId);
            //   // Fetch meetings for the current employee
            //   const { data, total } =
            //     await this.Model.reportModel().getPersonWiseMeetingReport(req);
            //   // Structure the employee data with meetings
            //   const employeeData = {
            //     id: employeeDetails.id,
            //     name: employeeDetails.name,
            //     total: employeeDetails.total,
            //     meeting: data,
            //   };
            //   // Push the structured data to dataist
            //   getData.push(employeeData);
            // }
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
                data: data,
            };
        });
    }
    meetingReport(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id } = req.admin;
            const model = this.Model.reportModel();
            const person_id = Number(req.params.id);
            const { data, total } = yield model.meetingReport(organization_id, req);
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
                data: data,
                total,
            };
        });
    }
    getPersonWiseLeaves(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.reportModel();
            const person_id = Number(req.params.id);
            const { data, total } = yield model.leaveReport(person_id, req);
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
                data: data,
                total,
            };
        });
    }
    getPersonWiseEvaluation(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.reportModel();
            const person_id = Number(req.params.id);
            const { evaluated_by, evaluated_to, evaluation_mark } = yield model.getPersonWiseEvaluationInfo(person_id);
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_SUCCESSFUL,
                data: {
                    evaluated_by: evaluated_by[0].count,
                    evaluated_to: evaluated_to[0].count,
                    avarage_evaluation_mark: evaluated_to[0].count,
                    participated_evaluations: evaluated_to[0].count,
                    evaluation_mark: evaluation_mark[0].sum,
                },
            };
        });
    }
}
exports.default = AdminReportService;
