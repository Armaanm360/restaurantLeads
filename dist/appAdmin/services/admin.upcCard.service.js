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
class AdminUpcCardService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //create card
    createCard(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { name, card_amenities } = req.body;
                const model = this.Model.upcCardModel(trx);
                const amenities_model = this.Model.upcConfigurationModel(trx);
                const { data: checkCard } = yield model.getAllCard({
                    name,
                });
                if (checkCard.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: this.ResMsg.HTTP_CONFLICT,
                    };
                }
                // create card
                const res = yield model.createCard({
                    name,
                });
                // insert card amenities
                if (card_amenities) {
                    const amenities_ids = card_amenities.map((item) => item.amenities_id);
                    // check amenities if exist or not
                    const { data: check_amenities } = yield amenities_model.getAllAmenities({
                        ids: amenities_ids,
                    });
                    if (amenities_ids.length != check_amenities.length) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_NOT_FOUND,
                            message: "Invalid amenities",
                        };
                    }
                    const card_amenities_payload = card_amenities.map((item) => {
                        return {
                            card_id: res[0].id,
                            amenities_id: item.amenities_id,
                            quantity: item.quantity,
                        };
                    });
                    yield model.amenitiesAddInCard(card_amenities_payload);
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Card created",
                };
            }));
        });
    }
    // get all card
    getAllCard(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.query;
            const { data, total } = yield this.Model.upcCardModel().getAllCard({
                name: name,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data,
                total,
            };
        });
    }
    // get single card
    getSingleCard(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield this.Model.upcCardModel().getSingleCard(parseInt(id));
            if (!data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: data[0],
            };
        });
    }
    //amenities add in card
    amenitiesAddInCard(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { card_id, added, deleted } = req.body;
                const model = this.Model.upcCardModel(trx);
                const amenities_model = this.Model.upcConfigurationModel(trx);
                const checkCard = yield model.getSingleCard(card_id);
                if (!checkCard.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_NOT_FOUND,
                        message: this.ResMsg.HTTP_NOT_FOUND,
                    };
                }
                const { card_amenities } = checkCard[0];
                if (added === null || added === void 0 ? void 0 : added.length) {
                    const amenities_ids = added.map((item) => item.amenities_id);
                    // check amenities if exist or not
                    const { data: check_amenities } = yield amenities_model.getAllAmenities({
                        ids: amenities_ids,
                    });
                    if (amenities_ids.length != check_amenities.length) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_NOT_FOUND,
                            message: "Invalid amenities",
                        };
                    }
                    // check if exist already
                    let found = false;
                    for (let i = 0; i < added.length; i++) {
                        for (let j = 0; j < card_amenities.length; j++) {
                            if (added[i].amenities_id == card_amenities[j].amenities_id) {
                                found = true;
                                break;
                            }
                        }
                    }
                    if (found) {
                        return {
                            success: false,
                            code: this.StatusCode.HTTP_CONFLICT,
                            message: "Amenities already exist in this card",
                        };
                    }
                    const card_amenities_payload = added.map((item) => {
                        return {
                            card_id,
                            amenities_id: item.amenities_id,
                            quantity: item.quantity,
                        };
                    });
                    yield model.amenitiesAddInCard(card_amenities_payload);
                }
                if (deleted === null || deleted === void 0 ? void 0 : deleted.length) {
                    yield model.deleteAmenitiesInCard(card_id, deleted);
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: this.ResMsg.HTTP_SUCCESSFUL,
                    checkCard,
                };
            }));
        });
    }
    //update card
    updateCard(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.upcCardModel();
            const checkCard = yield model.getSingleCard(parseInt(req.params.id));
            if (!checkCard.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            const { data: checkCardByName } = yield model.getAllCard({
                name: req.body.name,
            });
            if (checkCardByName.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_CONFLICT,
                    message: this.ResMsg.HTTP_CONFLICT,
                };
            }
            // update card
            yield model.updateCard(Object.assign({}, req.body), parseInt(req.params.id));
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Card updated",
            };
        });
    }
}
exports.default = AdminUpcCardService;
