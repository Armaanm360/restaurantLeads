export const _ = require('lodash');

export const isNotEmpty = (data: any) => {
  return !_.isEmpty(data);
};
export const isEmpty = (data: any) => {
  return _.isEmpty(data);
};

export const generateVoucherNumber = (length: number, title?: string) => {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return title ? title + '-' + result : result;
};
