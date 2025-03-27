"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVoucherNumber = exports.isEmpty = exports.isNotEmpty = exports._ = void 0;
exports._ = require('lodash');
const isNotEmpty = (data) => {
    return !exports._.isEmpty(data);
};
exports.isNotEmpty = isNotEmpty;
const isEmpty = (data) => {
    return exports._.isEmpty(data);
};
exports.isEmpty = isEmpty;
const generateVoucherNumber = (length, title) => {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return title ? title + '-' + result : result;
};
exports.generateVoucherNumber = generateVoucherNumber;
