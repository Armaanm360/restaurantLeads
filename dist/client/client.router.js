"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const property_router_1 = __importDefault(require("./routers/property.router"));
class ClientRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.callRouter();
    }
    callRouter() {
        // employee
        this.router.use('/properties', new property_router_1.default().router);
    }
}
exports.default = ClientRouter;
