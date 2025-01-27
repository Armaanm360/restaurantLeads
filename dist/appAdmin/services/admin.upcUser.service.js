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
const lib_1 = __importDefault(require("../../utils/lib/lib"));
const constants_1 = require("../../utils/miscellaneous/constants");
const upcUserCredentials_template_1 = require("../../utils/templates/upcUserCredentials.template");
class AdminUpcUserService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //create user
    createUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const _a = req.body, { email, phone, name, add_card, sell_by } = _a, rest = __rest(_a, ["email", "phone", "name", "add_card", "sell_by"]);
                const model = this.Model.upcUserModel(trx);
                //check user
                const { data: checkEmail } = yield model.getAllUser({
                    key: email,
                });
                if (checkEmail.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: "Email already exists",
                    };
                }
                const files = req.files || [];
                if (files.length) {
                    files.forEach((item) => {
                        rest[item.fieldname] = item.filename;
                    });
                }
                const { data } = yield model.getAllUser({});
                const lastNumber = data.length ? data[0].id : 1;
                const autoPass = lib_1.default.otpGenNumber(8);
                const firstName = name.split(" ")[0];
                const uniqueName = `@${firstName.toLocaleLowerCase()}${lastNumber}`;
                const hashedPass = yield lib_1.default.hashPass(autoPass);
                const userRes = yield model.createUser(Object.assign({ password: hashedPass, username: uniqueName.toLocaleLowerCase(), phone,
                    email,
                    name }, rest));
                if (typeof add_card == "undefined") {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: "Card not given",
                    };
                }
                if (add_card) {
                    const cardModel = this.Model.upcCardModel(trx);
                    const parse_card = JSON.parse(add_card);
                    const { card_id, card_expire_date } = parse_card;
                    // check card
                    const checkCard = yield cardModel.getSingleCard(card_id);
                    if (!checkCard.length) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_NOT_FOUND,
                            message: "Card not found",
                        };
                    }
                    // card number generate
                    const gen_card_num = lib_1.default.otpGenNumber(15);
                    const now_gen_card_num = gen_card_num + parseInt(lastNumber);
                    const card_user_res = yield model.cardAddInCardUser({
                        upc_user_id: userRes[0].id,
                        card_id,
                        expire_date: card_expire_date,
                        sell_by,
                        card_number: parseInt(now_gen_card_num),
                    });
                    const { card_amenities } = checkCard[0];
                    const cardUserAmenitiesPayload = card_amenities.map((item) => {
                        return {
                            upc_card_user_id: card_user_res[0].id,
                            amenities_id: item.amenities_id,
                            quantity: item.quantity,
                        };
                    });
                    // insert in card user amenities
                    yield model.insertCardAmenitiesInCardUserAmenities(cardUserAmenitiesPayload);
                }
                // send sms
                yield lib_1.default.sendEmail(email, constants_1.OTP_FOR_CREDENTIALS, (0, upcUserCredentials_template_1.newUpcUserAccount)(email, autoPass));
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "User inserted succefully",
                };
            }));
        });
    }
    // get single user
    getSingleUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.upcUserModel();
            const data = yield model.getSingleUser({
                id: parseInt(req.params.id),
            });
            if (!data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const _a = data[0], { password } = _a, rest = __rest(_a, ["password"]);
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: rest,
            };
        });
    }
    // update single user
    updateSingleUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const _a = req.body, { update_card, user_status } = _a, rest = __rest(_a, ["update_card", "user_status"]);
                const model = this.Model.upcUserModel(trx);
                const data = yield model.getSingleUser({
                    id: parseInt(req.params.id),
                });
                if (!data.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: this.ResMsg.HTTP_NOT_FOUND,
                    };
                }
                const files = req.files || [];
                if (files === null || files === void 0 ? void 0 : files.length) {
                    files.forEach((item) => {
                        rest[item.fieldname] = item.filename;
                    });
                }
                if (rest && Object.keys(rest).length) {
                    yield model.updateUser(Object.assign(Object.assign({}, rest), { status: user_status }), { id: parseInt(req.params.id) });
                }
                if (update_card && Object.keys(update_card).length) {
                    const parse_update_card = JSON.parse(update_card);
                    const { id, status } = parse_update_card, rest = __rest(parse_update_card, ["id", "status"]);
                    yield model.updateUserCard(Object.assign(Object.assign({}, rest), { status: parseInt(status) }), { id: parseInt(id) });
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: this.ResMsg.HTTP_OK,
                };
            }));
        });
    }
    // get single user
    getSingleUsersCard(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.upcUserModel();
            const getAllCard = yield model.getAllCardByUser(parseInt(req.params.user_id));
            const getAllOtherCard = yield model.getAllOtherCardByUser(parseInt(req.params.user_id));
            const cards = [];
            if (getAllCard.length) {
                for (let i = 0; i < getAllCard.length; i++) {
                    cards.push({
                        id: getAllCard[i].id,
                        card_id: getAllCard[i].card_id,
                        name: getAllCard[i].name,
                        expire_date: getAllCard[i].expire_date,
                        status: getAllCard[i].status,
                        card_number: getAllCard[i].card_number,
                        is_other_card: 0,
                    });
                }
            }
            if (getAllOtherCard.length) {
                for (let i = 0; i < getAllOtherCard.length; i++) {
                    cards.push({
                        id: getAllOtherCard[i].id,
                        expire_date: getAllOtherCard[i].expire_date,
                        status: getAllOtherCard[i].status,
                        card_number: getAllOtherCard[i].card_number,
                        card_type: getAllOtherCard[i].card_type,
                        card_holder_name: getAllOtherCard[i].card_holder_name,
                        is_other_card: 1,
                    });
                }
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: cards,
            };
        });
    }
    // get single card
    getSingleCardByUserAndCardId(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, card_id } = req.params;
            const model = this.Model.upcUserModel();
            const singleCardData = yield model.getSingleCardByUser({
                upc_user_id: parseInt(user_id),
                card_id: parseInt(card_id),
            });
            const usedAmenites = yield model.getUsedAminitesBySingleUserAndCard({
                upc_user_id: parseInt(user_id),
                card_id: parseInt(card_id),
            });
            if (!singleCardData.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const { card_user_amenities, card_name, card_id: cardId, } = singleCardData[0];
            const { user_card_used_amenities } = usedAmenites[0];
            let totalUsedAmenities = [];
            let totalRemainAmenities = [];
            if (!user_card_used_amenities.length) {
                totalRemainAmenities = card_user_amenities;
            }
            else {
                for (let i = 0; i < user_card_used_amenities.length; i++) {
                    let found = false;
                    for (let j = 0; j < totalUsedAmenities.length; j++) {
                        if (user_card_used_amenities[i].amenities_id == totalUsedAmenities[j].id) {
                            found = true;
                            const totalQuantity = user_card_used_amenities[i].quantity +
                                totalUsedAmenities[j].quantity;
                            totalUsedAmenities[j].quantity = totalQuantity;
                            break;
                        }
                    }
                    if (!found) {
                        totalUsedAmenities.push({
                            id: user_card_used_amenities[i].amenities_id,
                            name: user_card_used_amenities[i].amenities_name,
                            quantity: user_card_used_amenities[i].quantity,
                        });
                    }
                }
                // remain amenities
                for (let i = 0; i < totalUsedAmenities.length; i++) {
                    let found = false;
                    for (let j = 0; j < card_user_amenities.length; j++) {
                        if (totalUsedAmenities[i].id == card_user_amenities[j].amenities_id) {
                            const totalRQuantity = card_user_amenities[j].quantity - totalUsedAmenities[i].quantity;
                            totalRemainAmenities.push({
                                id: totalUsedAmenities[i].id,
                                name: totalUsedAmenities[i].name,
                                quantity: totalRQuantity,
                            });
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        totalRemainAmenities.push({
                            id: totalUsedAmenities[i].id,
                            name: totalUsedAmenities[i].name,
                            quantity: totalUsedAmenities[i].quantity,
                        });
                    }
                }
                // step 2
                for (let i = 0; i < card_user_amenities.length; i++) {
                    let found = false;
                    for (let j = 0; j < totalRemainAmenities.length; j++) {
                        if (card_user_amenities[i].amenities_id == totalRemainAmenities[j].id) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        totalRemainAmenities.push({
                            id: card_user_amenities[i].amenities_id,
                            name: card_user_amenities[i].name,
                            quantity: card_user_amenities[i].quantity,
                        });
                    }
                }
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: {
                    card_id: cardId,
                    card_name,
                    remain_amenities: totalRemainAmenities,
                },
            };
        });
    }
}
exports.default = AdminUpcUserService;
