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
class CheckInService extends abstract_service_1.default {
    constructor() {
        super();
    }
    // get all check in
    getAllCheckIn(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { service_center_id } = req.service_center;
            const { name, limit, skip } = req.query;
            const { data, total } = yield this.Model.upcServiceCenterModel().getAllCheckIn({
                service_id: service_center_id,
                name: name,
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
    // get single check in
    getSingleCheckIn(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { service_center_id } = req.service_center;
            const data = yield this.Model.upcServiceCenterModel().getSingleCheckIn({
                service_id: service_center_id,
                id: parseInt(req.params.id),
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: data[0],
            };
        });
    }
    //check in
    // public async updateCheckIn(req: Request) {
    //   return await this.db.transaction(async (trx) => {
    //     const { id } = req.service_center;
    //     const { status } = req.body;
    //     const serviceCenterModel = this.Model.upcServiceCenterModel(trx);
    //     const upcUserModel = this.Model.upcUserModel(trx);
    //     const checkSingleCheckIn = await serviceCenterModel.getSingleCheckIn({
    //       service_id: id,
    //       id: parseInt(req.params.id),
    //     });
    //     if (!checkSingleCheckIn.length) {
    //       return {
    //         success: false,
    //         code: this.StatusCode.HTTP_NOT_FOUND,
    //         message: this.ResMsg.HTTP_NOT_FOUND,
    //       };
    //     }
    //     const {
    //       upc_user_id,
    //       card_id,
    //       check_in_items,
    //       status: check_in_status,
    //     } = checkSingleCheckIn[0];
    //     if (check_in_status != "approved" && status == "approved") {
    //       // get upc card user id
    //       const getSingleCard = await upcUserModel.getSingleCardByUser({
    //         upc_user_id,
    //         card_id,
    //       });
    //       if (!getSingleCard.length) {
    //         return {
    //           success: false,
    //           code: this.StatusCode.HTTP_NOT_FOUND,
    //           message: "Card not exist with this user",
    //         };
    //       }
    //       const { card_user_id, card_user_amenities } = getSingleCard[0];
    //       const checkInItemsPayload = check_in_items.map((item: any) => {
    //         return {
    //           upc_card_user_id: card_user_id,
    //           amenities_id: item.card_amenities_id,
    //           quantity: item.quantity,
    //         };
    //       });
    //       // check in update step
    //       await serviceCenterModel.updateCheckIn(
    //         { status, checked_in_by: id },
    //         { service_id: id, id: parseInt(req.params.id) }
    //       );
    //       // insert user card amenities
    //       await serviceCenterModel.insertUsedCardAmenities(checkInItemsPayload);
    //     } else {
    //       // check in update step
    //       await serviceCenterModel.updateCheckIn(
    //         { status },
    //         { service_id: id, id: parseInt(req.params.id) }
    //       );
    //     }
    //     return {
    //       success: true,
    //       code: this.StatusCode.HTTP_OK,
    //       message: `Successfully updated`,
    //     };
    //   });
    // }
    //check in v2
    updateCheckInV2(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { admin_id, service_center_id } = req.service_center;
                const { status } = req.body;
                const serviceCenterModel = this.Model.upcServiceCenterModel(trx);
                const checkSingleCheckIn = yield serviceCenterModel.getSingleCheckIn({
                    service_id: service_center_id,
                    id: parseInt(req.params.id),
                });
                if (!checkSingleCheckIn.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: this.ResMsg.HTTP_NOT_FOUND,
                    };
                }
                const { upc_user_id, card_id, check_in_items, status: check_in_status, } = checkSingleCheckIn[0];
                if (check_in_status == "rejected") {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: `You cannot approved cause already has been rejected `,
                    };
                }
                else if (check_in_status != "approved" && status == "approved") {
                    //check amenities if available or not
                    const upcUsermodel = this.Model.upcUserModel(trx);
                    const singleCardData = yield upcUsermodel.getSingleCardByUser({
                        upc_user_id,
                        card_id: parseInt(card_id),
                    });
                    if (!singleCardData.length) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_NOT_FOUND,
                            message: "Card not exist with this user",
                        };
                    }
                    const usedAmenites = yield upcUsermodel.getUsedAminitesBySingleUserAndCard({
                        upc_user_id,
                        card_id: parseInt(card_id),
                    });
                    const { card_user_amenities, card_user_id } = singleCardData[0];
                    const { user_card_used_amenities } = usedAmenites[0];
                    let totalRemainAmenities = [];
                    if (!user_card_used_amenities.length) {
                        totalRemainAmenities = card_user_amenities;
                    }
                    else {
                        const total_used_amenities = [];
                        for (let i = 0; i < user_card_used_amenities.length; i++) {
                            let found = false;
                            for (let j = 0; j < total_used_amenities.length; j++) {
                                if (user_card_used_amenities[i].amenities_id ==
                                    total_used_amenities[j].amenities_id) {
                                    found = true;
                                    total_used_amenities;
                                    total_used_amenities[j].quantity =
                                        total_used_amenities[j].quantity +
                                            user_card_used_amenities[i].quantity;
                                }
                            }
                            if (!found) {
                                total_used_amenities.push({
                                    amenities_id: user_card_used_amenities[i].amenities_id,
                                    amenities_name: user_card_used_amenities[i].amenities_name,
                                    quantity: user_card_used_amenities[i].quantity,
                                });
                            }
                        }
                        for (let i = 0; i < card_user_amenities.length; i++) {
                            let found = false;
                            for (let j = 0; j < total_used_amenities.length; j++) {
                                if (card_user_amenities[i].amenities_id ==
                                    total_used_amenities[j].amenities_id) {
                                    found = true;
                                    const remainQuantity = card_user_amenities[i].quantity -
                                        total_used_amenities[j].quantity;
                                    totalRemainAmenities.push({
                                        amenities_id: card_user_amenities[i].amenities_id,
                                        amenities_name: card_user_amenities[i].name,
                                        quantity: remainQuantity,
                                    });
                                    break;
                                }
                            }
                            if (!found) {
                                totalRemainAmenities.push({
                                    amenities_id: card_user_amenities[i].amenities_id,
                                    amenities_name: card_user_amenities[i].name,
                                    quantity: card_user_amenities[i].quantity,
                                });
                            }
                        }
                    }
                    if (totalRemainAmenities.length) {
                        let quantityLargerThanAvailable = false;
                        let found = false;
                        for (let i = 0; i < check_in_items.length; i++) {
                            if (quantityLargerThanAvailable || found) {
                                break;
                            }
                            for (let j = 0; j < totalRemainAmenities.length; j++) {
                                if (check_in_items[i].card_amenities_id ==
                                    totalRemainAmenities[j].amenities_id) {
                                    found = true;
                                    if (check_in_items[i].quantity > totalRemainAmenities[j].quantity) {
                                        quantityLargerThanAvailable = true;
                                        break;
                                    }
                                }
                            }
                        }
                        if (quantityLargerThanAvailable) {
                            return {
                                success: false,
                                code: this.StatusCode.HTTP_BAD_REQUEST,
                                message: "This user doing reedem more than card available amenities",
                            };
                        }
                    }
                    const checkInItemsPayload = check_in_items.map((item) => {
                        return {
                            upc_card_user_id: card_user_id,
                            amenities_id: item.card_amenities_id,
                            quantity: item.quantity,
                        };
                    });
                    // check in update step
                    yield serviceCenterModel.updateCheckIn({ status, checked_in_by: admin_id }, { service_id: service_center_id, id: parseInt(req.params.id) });
                    // insert user card amenities
                    yield serviceCenterModel.insertUsedCardAmenities(checkInItemsPayload);
                }
                else {
                    // check in update step
                    yield serviceCenterModel.updateCheckIn({ status, checked_in_by: admin_id }, { service_id: service_center_id, id: parseInt(req.params.id) });
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: `Successfully updated`,
                };
            }));
        });
    }
}
exports.default = CheckInService;
