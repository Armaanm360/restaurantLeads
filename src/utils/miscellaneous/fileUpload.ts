// import * as AWS from 'aws-sdk';
// const s3 = new AWS.S3();
import config from '../../config/config';
import { rootFileFolder } from '../../common/middleware/uploader/uploaderConstants';

const fileUpload = async (buffer: Buffer) => {
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
};

export default fileUpload;
