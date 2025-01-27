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
const lib_1 = __importDefault(require("../../utils/lib/lib"));
const constants_1 = require("../../utils/miscellaneous/constants");
const upcServiceCenterCredentials_template_1 = require("../../utils/templates/upcServiceCenterCredentials.template");
const client_s3_1 = require("@aws-sdk/client-s3");
const qrcode_1 = __importDefault(require("qrcode"));
const config_1 = __importDefault(require("../../config/config"));
const uploaderConstants_1 = require("../../common/middleware/uploader/uploaderConstants");
class AdminUpcServiceCenterService extends abstract_service_1.default {
    constructor() {
        super();
        this.s3 = new client_s3_1.S3({
            region: "ap-south-1",
            credentials: {
                accessKeyId: config_1.default.AWS_S3_ACCESS_KEY,
                secretAccessKey: config_1.default.AWS_S3_SECRET_KEY,
            },
        });
    }
    //create service center
    createServiceCenter(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { email, name } = req.body;
                const files = req.files || [];
                if (files.length) {
                    req.body["logo"] = files[0].filename;
                }
                const model = this.Model.upcServiceCenterModel(trx);
                // check service center
                const { data: checkServiceCenter } = yield model.getAllserviceCenter({
                    email,
                });
                if (checkServiceCenter.length) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_CONFLICT,
                        message: this.ResMsg.HTTP_CONFLICT,
                    };
                }
                const res = yield model.createServiceCenter(Object.assign(Object.assign({}, req.body), { email,
                    name }));
                // insert user admin
                const passGen = lib_1.default.otpGenNumber(8);
                const hashPass = yield lib_1.default.hashPass(passGen);
                yield model.insertUserAdmin({
                    service_center_id: res[0].id,
                    email,
                    name,
                    password: hashPass,
                });
                // Generate QR code
                const qrCodeImageBuffer = yield qrcode_1.default.toBuffer(JSON.stringify({
                    id: res[0].id,
                }), {
                    type: "png",
                });
                const params = {
                    Bucket: config_1.default.AWS_S3_BUCKET,
                    Key: `${uploaderConstants_1.rootFileFolder}/upc_service_center/qrcode_${res[0].id}.png`,
                    Body: qrCodeImageBuffer,
                    ACL: "public-read",
                };
                const uploadCommand = new client_s3_1.PutObjectCommand(params);
                yield this.s3.send(uploadCommand);
                // update service center
                yield model.updateServiceCenter({
                    qr_code: `upc_service_center/qrcode_${res[0].id}.png`,
                }, { id: res[0].id });
                // send sms
                yield lib_1.default.sendEmail(email, constants_1.OTP_FOR_CREDENTIALS, (0, upcServiceCenterCredentials_template_1.newServiceCenterAccount)(email, passGen));
                return {
                    success: true,
                    code: this.StatusCode.HTTP_OK,
                    message: "Service center added successfully",
                };
            }));
        });
    }
    // update service center
    updateServiceCenter(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const files = req.files || [];
            if (files.length) {
                body["logo"] = files[0].filename;
            }
            const model = this.Model.upcServiceCenterModel();
            const data = yield this.Model.upcServiceCenterModel().getSingleServiceCenter({
                id: parseInt(req.params.id),
            });
            if (!data.length) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_NOT_FOUND,
                    message: this.ResMsg.HTTP_NOT_FOUND,
                };
            }
            // update service center
            yield model.updateServiceCenter(req.body, { id: parseInt(req.params.id) });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: "Service center added successfully",
            };
        });
    }
}
exports.default = AdminUpcServiceCenterService;
