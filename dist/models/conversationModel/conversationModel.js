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
class conversationModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    //   insert conversation
    insertConversation(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("conversation")
                .withSchema(this.CRM_SCHEMA)
                .insert(payload, "*");
        });
    }
    // update conversation
    updateConversation(payload, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("conversation")
                .withSchema(this.CRM_SCHEMA)
                .update(payload)
                .where({ id });
        });
    }
    // del conversation
    delConversation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("conversation")
                .withSchema(this.CRM_SCHEMA)
                .where({ id })
                .del();
        });
    }
    //   insert conversation msg
    insertConversationMsg(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("con_msg")
                .withSchema(this.CRM_SCHEMA)
                .insert(payload, "*");
        });
    }
    //   del conversation msg
    delConversationMsg(con_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("con_msg")
                .withSchema(this.CRM_SCHEMA)
                .where({ con_id })
                .del();
        });
    }
    //   get all conversation
    getAllConversationCheck({ emp_id, org_id, receiver_id, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("conversation_view")
                .withSchema(this.CRM_SCHEMA)
                .select("id", "sender_emp_id", "sender_name", "sender_photo", "receiver_emp_id", "receiver_name", "receiver_photo", "last_msg")
                .andWhere({ org_id })
                .andWhere(function () {
                if (emp_id) {
                    this.andWhere({ sender_emp_id: emp_id })
                        .andWhere({ receiver_emp_id: receiver_id })
                        .orWhere(function () {
                        this.andWhere({ sender_emp_id: receiver_id }).andWhere({
                            receiver_emp_id: emp_id,
                        });
                    });
                }
            });
        });
    }
    //   get all conversation
    getAllConversation({ emp_id, org_id, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("conversation_view")
                .withSchema(this.CRM_SCHEMA)
                .select("id", "sender_emp_id", "sender_name", "sender_photo", "receiver_emp_id", "receiver_name", "receiver_photo", "last_msg")
                .andWhere({ org_id })
                .andWhere(function () {
                if (emp_id) {
                    this.andWhere({ sender_emp_id: emp_id }).orWhere({
                        receiver_emp_id: emp_id,
                    });
                }
            });
        });
    }
    //   get conversation by emp
    getAllConversationByEmp({ sender_id, reciever_id, org_id, type, }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log({ sender_id });
            return yield this.db
                .withSchema(this.CRM_SCHEMA)
                .select("*")
                .from("conversation_view")
                .where(function () {
                this.where({ sender_emp_id: sender_id })
                    .andWhere({ receiver_emp_id: reciever_id })
                    .orWhere(function () {
                    this.where({ receiver_emp_id: sender_id }).andWhere({
                        sender_emp_id: reciever_id,
                    });
                });
            })
                .andWhere({ org_id });
        });
    }
    //   get conversation by emp
    getTotalUnseenConversation({ emp_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db("conversation")
                .withSchema(this.CRM_SCHEMA)
                .count("* as total")
                .where(function () {
                this.where("seen", 0).andWhere(function () {
                    this.where({ sender_emp_id: emp_id }).orWhere({
                        receiver_emp_id: emp_id,
                    });
                });
            });
            return data.length ? parseInt(data[0].total) : 0;
        });
    }
}
exports.default = conversationModel;
