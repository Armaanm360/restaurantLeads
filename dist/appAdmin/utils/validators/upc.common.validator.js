"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class AdminUpcCommonValidator {
    constructor() {
        //Create amenities
        this.createAmenitiesValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
            unit_price: joi_1.default.number().required(),
        });
        //update amenities
        this.updateAmenitiesValidator = joi_1.default.object({
            unit_price: joi_1.default.number().optional(),
        });
        //create card
        this.createCardValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
            card_amenities: joi_1.default.array().required(),
        });
        // add amenities in card
        this.addAmenitiesInCardValidator = joi_1.default.object({
            card_id: joi_1.default.number().required(),
            added: joi_1.default.array()
                .items(joi_1.default.object({
                amenities_id: joi_1.default.number().required(),
                quantity: joi_1.default.number().required(),
            }))
                .required(),
            delete: joi_1.default.array().items(joi_1.default.number().required()).optional(),
        });
        // create upc user
        this.createUpcUserValidator = joi_1.default.object({
            name: joi_1.default.string().required(),
            phone: joi_1.default.string().optional(),
            sell_by: joi_1.default.string().required(),
            email: joi_1.default.string().required(),
            add_card: joi_1.default.string()
                .custom((value, helpers) => {
                try {
                    const parsedObject = JSON.parse(value);
                    const addCardType = typeof parsedObject;
                    if (addCardType !== "object") {
                        return helpers.message({
                            custom: "invalid add_card, should be a JSON object",
                        });
                    }
                    return value;
                }
                catch (err) {
                    return helpers.message({
                        custom: "invalid add_card, should be a valid JSON Object",
                    });
                }
            })
                .optional(),
        });
        // update upc user
        this.updateUpcUserValidator = joi_1.default.object({
            name: joi_1.default.string().optional(),
            phone: joi_1.default.string().optional(),
            user_status: joi_1.default.string().optional(),
            update_card: joi_1.default.string()
                .custom((value, helpers) => {
                try {
                    const parsedObject = JSON.parse(value);
                    const updateCard = typeof parsedObject;
                    if (updateCard !== "object") {
                        return helpers.message({
                            custom: "invalid update_card, should be a JSON object",
                        });
                    }
                    return value;
                }
                catch (err) {
                    return helpers.message({
                        custom: "invalid update_card, should be a valid JSON Object",
                    });
                }
            })
                .optional(),
        });
        // add other card
        this.addUpcUserOtherCardValidator = joi_1.default.object({
            card_number: joi_1.default.number().required(),
            expire_date: joi_1.default.string().optional(),
            card_holder_name: joi_1.default.string().required(),
            card_type: joi_1.default.string().valid("bkash", "dbbl", "nrbc", "ebl", "rocket", "nagad", "brac", "other"),
        });
    }
}
exports.default = AdminUpcCommonValidator;
