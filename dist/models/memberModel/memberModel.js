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
class MemberModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    // insert user member
    insertUserMember(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield this.db("users")
                .withSchema(this.EVO)
                .insert(payload, "user_id");
            return member;
        });
    }
    // insert teammeber
    insertTeamMember(team_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield this.db("user_teams")
                .withSchema(this.EVO)
                .insert({ team_id: team_id, user_id: user_id });
            return member;
        });
    }
    // check user
    checkUser({ email, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("users")
                .withSchema(this.EVO)
                .where((qb) => {
                if (email) {
                    qb.orWhere("email", email);
                }
            });
            return userMember;
        });
    }
    // check phone
    checkPhone({ phone, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("users")
                .withSchema(this.EVO)
                .where((qb) => {
                if (phone) {
                    qb.orWhere("phone", phone);
                }
            });
            return userMember;
        });
    }
    // check username
    checkUsername({ username, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("users")
                .withSchema(this.EVO)
                .where((qb) => {
                if (username) {
                    qb.orWhere("username", username);
                }
            });
            return userMember;
        });
    }
    //check team leader exsist
    checkTeamLeaderExsist(team_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("user_team_view")
                .withSchema(this.EVO)
                .where({ team_id: team_id })
                .andWhere({ level: 3 })
                .select("*");
            return userMember;
        });
    }
    //get profile info
    getProfile(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("users")
                .withSchema(this.EVO)
                .where({ user_id: user_id })
                .select("user_id", "name as name", "username", "designation", "phone", "email", "status", "level as team_name", "level", "profile_picture");
            return userMember;
        });
    }
    getProfileTeamWise(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("user_team_view")
                .withSchema(this.EVO)
                .where({ user_id: user_id })
                .select("user_id", "user_name as name", "username", "designation", "phone", "email", "status", "team_name", "level", "shift_name", "shift_start", "shift_end", "working_days", "profile_picture");
            return userMember;
        });
    }
    activateProfile(user_id, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("users")
                .withSchema(this.EVO)
                .where({ user_id: user_id })
                .update({ status: "active", password: password });
            return userMember;
        });
    }
    checkSuperUser({ association_id, level, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("users")
                .withSchema(this.EVO)
                .where({ association_id: association_id })
                .andWhere({ level: level });
            return userMember;
        });
    }
    // get single user
    getSingleUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("users")
                .withSchema(this.EVO)
                .where({ email: email })
                .leftJoin("user_teams", "users.user_id", "user_teams.user_id")
                .select("*");
            return userMember;
        });
    }
    checkLevel(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMember = yield this.db("users")
                .withSchema(this.EVO)
                .where({ email: email })
                .select("*");
            return userMember;
        });
    }
    // update user member
    updateUserMember(payload, where) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("users")
                .withSchema(this.EVO)
                .update(payload)
                .where((qb) => {
                if (where.email) {
                    qb.where({ email: where.email });
                }
                if (where.user_id) {
                    qb.where({ user_id: where.user_id });
                }
            });
        });
    }
    // update user member
    updateProfile(user_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("users")
                .withSchema(this.EVO)
                .update(payload)
                .where({ user_id: user_id });
        });
    }
    // update user member
    updateUserSuper(email, hashedPass) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db("users")
                .withSchema(this.EVO)
                .update({ password: hashedPass })
                .where({ email: email });
        });
    }
}
exports.default = MemberModel;
