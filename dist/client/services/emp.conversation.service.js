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
const socket_1 = require("../../app/socket");
class EmpConversationService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // sendMessage
    sendMessage(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id, id: emp_id, name } = req.employee;
            let { message, docs, receiver_id } = req.body;
            const files = req.files || [];
            if (files.length) {
                docs = files[0].filename;
            }
            const cnvModel = this.Model.conversationModel();
            console.log({ emp_id, receiver_id });
            const checkConversation = yield cnvModel.getAllConversationCheck({
                org_id: organization_id,
                emp_id,
                receiver_id,
            });
            let res = [];
            let msgRes;
            if (!checkConversation.length) {
                res = yield cnvModel.insertConversation({
                    org_id: organization_id,
                    sender_emp_id: emp_id,
                    receiver_emp_id: receiver_id,
                    last_msg: message,
                });
                msgRes = yield cnvModel.insertConversationMsg({
                    con_id: res[0].id,
                    receiver_id,
                    sender_id: emp_id,
                    docs,
                    message,
                });
            }
            else {
                // insert
                msgRes = yield cnvModel.insertConversationMsg({
                    con_id: checkConversation[0].id,
                    receiver_id,
                    sender_id: emp_id,
                    docs,
                    message,
                });
                const updateCont = {};
                if (message) {
                    updateCont.last_msg = message;
                }
                if (docs) {
                    updateCont.last_msg = "🔗 Sent a file";
                }
                updateCont.seen = 0;
                if (Object.values(updateCont).length) {
                    // update last message in conversation
                    yield cnvModel.updateConversation(updateCont, checkConversation[0].id);
                }
            }
            const data = yield this.Model.employeeModel().getSingleEmployee({
                id: receiver_id,
            });
            console.log({ data }, "receiver data");
            const { socket_id } = data[0];
            const newConvList = {};
            if (res === null || res === void 0 ? void 0 : res.length) {
                const getSenderEmp = yield this.Model.employeeModel().getSingleEmployee({
                    id: res[0].sender_emp_id,
                });
                newConvList.id = res[0].id;
                newConvList.sender_emp_id = res[0].sender_emp_id;
                newConvList.sender_name = getSenderEmp[0].name;
                newConvList.sender_photo = getSenderEmp[0].photo;
                const getRecieverrEmp = yield this.Model.employeeModel().getSingleEmployee({
                    id: res[0].receiver_emp_id,
                });
                newConvList.receiver_emp_id = res[0].receiver_emp_id;
                newConvList.receiver_name = getRecieverrEmp[0].name;
                newConvList.receiver_photo = getRecieverrEmp[0].photo;
            }
            socket_1.io.to(socket_id).emit("conversation", {
                message,
                type: "conversation",
                data: msgRes[0],
                msg_list: newConvList,
            });
            // ===========  push notification  ============== //
            socket_1.io.to(socket_id).emit("notification", {
                message: `New message send by ${name}`,
                type: "conversation",
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_SUCCESSFUL,
            };
        });
    }
    // get all emp conversation
    getAllEmpConversation(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.employee;
            const data = yield this.Model.conversationModel().getAllConversation({
                emp_id: id,
                org_id: req.employee.organization_id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data,
            };
        });
    }
    // del emp conversation
    delEmpConversation(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, receiver_id } = req.params;
            const checkData = yield this.Model.conversationModel().getAllConversationByEmp({
                sender_id: parseInt(id),
                reciever_id: parseInt(receiver_id),
                org_id: req.employee.organization_id,
            });
            if (checkData.length) {
                // del conversation msg
                yield this.Model.conversationModel().delConversationMsg(checkData[0].id);
                // dlt conversation
                yield this.Model.conversationModel().delConversation(checkData[0].id);
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
            };
        });
    }
    // total unseen conversation
    getTotalUnseenConversation(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const total = yield this.Model.conversationModel().getTotalUnseenConversation({
                emp_id: req.employee.id,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total,
            };
        });
    }
    // get single emp conversation
    getSingleEmpConversation(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.Model.conversationModel().getAllConversationByEmp({
                reciever_id: parseInt(req.params.id),
                sender_id: req.employee.id,
                org_id: req.employee.organization_id,
                type: req.query.type,
            });
            // update seen
            yield this.Model.conversationModel().updateConversation({ seen: 1 }, data[0].id);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: data[0],
            };
        });
    }
}
exports.default = EmpConversationService;
