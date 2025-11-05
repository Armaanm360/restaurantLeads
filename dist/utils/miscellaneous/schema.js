"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Schema {
    constructor() {
        this.PROPERTY_SCHEMA = 'prop';
        this.SINGLE = 'trabill_iata_single_entry_2025';
        // public readonly SINGLE = 'trabill';
        this.DOUBLE = 'trabill_double_entry';
        this.LEAD_SCHEMA = 'leads';
        this.USER_SCHEMA = 'users';
        this.DBO = 'dbo';
    }
}
exports.default = Schema;
