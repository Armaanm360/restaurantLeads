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
Object.defineProperty(exports, "__esModule", { value: true });
const fileUpload = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
    // const params = {
    //   Bucket: config.AWS_S3_BUCKET,
    //   Key: `${rootFileFolder}/member-workShop/workShopQRCode-buffer`,
    //   Body: buffer,
    // };
    // const upload = s3.upload(params, (err: any, data: any) => {
    //   if (err) {
    //     console.error('Error uploading to S3:', err);
    //   } else {
    //     console.log('File uploaded successfully:', data);
    //   }
    // });
    // return upload;
});
exports.default = fileUpload;
