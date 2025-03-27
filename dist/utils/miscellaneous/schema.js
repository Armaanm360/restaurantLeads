"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Schema {
    constructor() {
        this.PROPERTY_SCHEMA = 'prop';
        this.SINGLE = 'single_entry_migration';
        // public readonly SINGLE = 'trabill';
        this.DOUBLE = 'iata_accounts';
        this.LEAD_SCHEMA = 'leads';
        this.USER_SCHEMA = 'users';
        this.DBO = 'dbo';
    }
}
exports.default = Schema;
