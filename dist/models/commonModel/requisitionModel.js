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
const schema_1 = __importDefault(require("../../utils/miscellaneous/schema"));
class requisitionModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    createItems(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.db('requisition_items')
                .withSchema(this.DBO_SCHEMA)
                .insert(payload);
            return items;
        });
    }
    updateItems(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.db('requisition_items')
                .withSchema(this.DBO_SCHEMA)
                .where({ id })
                .update(payload);
            return items;
        });
    }
    insertRequisitionTrack(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.db('requisition_track')
                .withSchema(this.DBO_SCHEMA)
                .insert(payload);
            return items;
        });
    }
    createRequisition(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.db('requisitions')
                .withSchema(this.DBO_SCHEMA)
                .insert(payload)
                .returning('id');
            return items;
        });
    }
    updateRequisition(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.db('requisitions')
                .withSchema(this.DBO_SCHEMA)
                .where({ id })
                .update(payload);
            return items;
        });
    }
    createInventoryTransaction(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.db('inventory_transactions')
                .withSchema(this.DBO_SCHEMA)
                .insert(payload);
            return items;
        });
    }
    getAllItems(organization_id, { limit, skip, name, category }) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db('requisition_items');
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.DBO_SCHEMA)
                .select('id', 'name', 'description', 'unique_code', 'category', 'quantity', 'reorder_level', 'recorded_by', 'unit_price', 'created_at')
                .orderBy('id', 'desc')
                .where({ organization_id })
                .andWhere({ is_deleted: false })
                .andWhere(function (queryBuilder) {
                if (name) {
                    queryBuilder.andWhere('name', 'ILIKE', `%${name}%`);
                }
                if (category) {
                    queryBuilder.andWhere('category', 'ILIKE', `%${category}%`);
                }
            });
            const total = yield this.db('requisition_items')
                .count('id as total')
                .withSchema(this.DBO_SCHEMA)
                .where({ organization_id })
                .andWhere({ is_deleted: false })
                .andWhere(function (queryBuilder) {
                if (name) {
                    queryBuilder.andWhere('name', 'ILIKE', `%${name}%`);
                }
                if (category) {
                    queryBuilder.andWhere('category', 'ILIKE', `%${category}%`);
                }
            });
            return {
                data,
                total: parseInt(total[0].total),
            };
        });
    }
    getAllTransaction(organization_id, { limit, skip, name, category, from_date, to_date }) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db('inventory_transactions as it');
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.DBO_SCHEMA)
                .select('it.id as transaction_id', 'it.item_id', 'it.transaction_type', 'it.quantity', 'it.unit_price', 'it.subtotal', 'it.transaction_date', 'it.remarks', 'it.remarks', 'ri.unique_code', 'ri.name', 'ri.category', 'ua.name as created_by')
                .leftJoin('requisition_items as ri', 'ri.id', '=', 'it.item_id')
                .joinRaw('LEFT JOIN crm.user_admin AS ua ON it.created_by = ua.id')
                .orderBy('it.id', 'desc')
                .where('it.organization_id', organization_id)
                .andWhere('ri.is_deleted', false)
                .modify((queryBuilder) => {
                if (name) {
                    queryBuilder.andWhere('ri.name', 'ILIKE', `%${name}%`);
                }
                if (category) {
                    queryBuilder.andWhere('ri.category', 'ILIKE', `%${category}%`);
                }
                if (from_date && to_date) {
                    queryBuilder.whereBetween('it.transaction_date', [
                        from_date,
                        to_date,
                    ]);
                }
                else if (from_date) {
                    queryBuilder.where('it.transaction_date', '>=', from_date);
                }
                else if (to_date) {
                    queryBuilder.where('it.transaction_date', '<=', to_date);
                }
            });
            const total = yield this.db('inventory_transactions as it')
                .count('it.id as total')
                .withSchema(this.DBO_SCHEMA)
                .leftJoin('requisition_items as ri', 'ri.id', '=', 'it.item_id')
                .joinRaw('LEFT JOIN crm.user_admin AS ua ON it.created_by = ua.id')
                .where('it.organization_id', organization_id)
                .andWhere('ri.is_deleted', false)
                .modify((queryBuilder) => {
                if (name) {
                    queryBuilder.andWhere('ri.name', 'ILIKE', `%${name}%`);
                }
                if (category) {
                    queryBuilder.andWhere('ri.category', 'ILIKE', `%${category}%`);
                }
                if (from_date && to_date) {
                    queryBuilder.whereBetween('it.transaction_date', [
                        from_date,
                        to_date,
                    ]);
                }
                else if (from_date) {
                    queryBuilder.where('it.transaction_date', '>=', from_date);
                }
                else if (to_date) {
                    queryBuilder.where('it.transaction_date', '<=', to_date);
                }
            });
            return {
                data,
                total: parseInt(total[0].total),
            };
        });
    }
    getAllRequisitions(organization_id, { limit, skip, name, category, from_date, to_date, item_id, employee_name, employee_id, status, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db('requisitions as re');
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.DBO_SCHEMA)
                .select('re.id as requisition_id', 're.user_id', 're.item_id', 're.quantity', 're.rejection_reason', 're.require_reason', 're.status', 'e.name as employee_name', 'uaa.name as approved_by', 'uaf.name as fulfilled_by', 'ri.name as item_name', 'ri.category as category', 're.approved_at', 're.created_at', 're.fulfilled_at')
                .leftJoin('requisition_items as ri', 'ri.id', '=', 're.item_id')
                .joinRaw('LEFT JOIN crm.employee AS e ON re.user_id = e.id')
                .joinRaw('LEFT JOIN crm.user_admin AS uaa ON re.approved_by = uaa.id')
                .joinRaw('LEFT JOIN crm.user_admin AS uaf ON re.fulfilled_by = uaf.id')
                .orderBy('re.id', 'desc')
                .where('re.organization_id', organization_id)
                .modify((queryBuilder) => {
                if (name) {
                    queryBuilder.andWhere('ri.name', 'ILIKE', `%${name}%`);
                }
                if (category) {
                    queryBuilder.andWhere('ri.category', 'ILIKE', `%${category}%`);
                }
                if (employee_name) {
                    queryBuilder.andWhere('e.name', 'ILIKE', `%${category}%`);
                }
                if (employee_id) {
                    queryBuilder.andWhere('re.user_id', employee_id);
                }
                if (status) {
                    queryBuilder.andWhere('re.status', status);
                }
                if (item_id) {
                    queryBuilder.andWhere('re.item_id', item_id);
                }
                if (from_date && to_date) {
                    queryBuilder.whereBetween('re.created_at', [from_date, to_date]);
                }
                else if (from_date) {
                    queryBuilder.where('re.created_at', '>=', from_date);
                }
                else if (to_date) {
                    queryBuilder.where('re.created_at', '<=', to_date);
                }
            });
            const total = yield this.db('requisitions as re')
                .count('* as total')
                .withSchema(this.DBO_SCHEMA)
                .leftJoin('requisition_items as ri', 'ri.id', '=', 're.item_id')
                .joinRaw('LEFT JOIN crm.employee AS e ON re.user_id = e.id')
                .joinRaw('LEFT JOIN crm.user_admin AS uaa ON re.approved_by = uaa.id')
                .joinRaw('LEFT JOIN crm.user_admin AS uaf ON re.fulfilled_by = uaf.id')
                .where('re.organization_id', organization_id)
                .modify((queryBuilder) => {
                if (name) {
                    queryBuilder.andWhere('ri.name', 'ILIKE', `%${name}%`);
                }
                if (category) {
                    queryBuilder.andWhere('ri.category', 'ILIKE', `%${category}%`);
                }
                if (employee_name) {
                    queryBuilder.andWhere('e.name', 'ILIKE', `%${category}%`);
                }
                if (employee_id) {
                    queryBuilder.andWhere('re.user_id', employee_id);
                }
                if (status) {
                    queryBuilder.andWhere('re.status', status);
                }
                if (item_id) {
                    queryBuilder.andWhere('re.item_id', item_id);
                }
                if (from_date && to_date) {
                    queryBuilder.whereBetween('re.created_at', [from_date, to_date]);
                }
                else if (from_date) {
                    queryBuilder.where('re.created_at', '>=', from_date);
                }
                else if (to_date) {
                    queryBuilder.where('re.created_at', '<=', to_date);
                }
            });
            return {
                data,
                total: parseInt(total[0].total),
            };
        });
    }
    getCurrentStock(organization_id, { limit, skip, name, category }) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db('stock_view');
            if (limit && skip) {
                dtbs.limit(parseInt(limit));
                dtbs.offset(parseInt(skip));
            }
            const data = yield dtbs
                .withSchema(this.DBO_SCHEMA)
                .select('*')
                .where({ organization_id })
                .modify((queryBuilder) => {
                if (name) {
                    queryBuilder.andWhere('item_name', 'ILIKE', `%${name}%`);
                }
                if (category) {
                    queryBuilder.andWhere('category', 'ILIKE', `%${category}%`);
                }
            })
                .orderBy('item_name', 'asc');
            const total = yield this.db('stock_view')
                .count('item_id as total')
                .withSchema(this.DBO_SCHEMA)
                .where({ organization_id })
                .modify((queryBuilder) => {
                if (name) {
                    queryBuilder.andWhere('item_name', 'ILIKE', `%${name}%`);
                }
                if (category) {
                    queryBuilder.andWhere('category', 'ILIKE', `%${category}%`);
                }
            });
            return {
                data,
                total: parseInt(total[0].total),
            };
        });
    }
    //check if approver exists
    checkApprover(organization_id, admin_id, tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db(`${tableName}`)
                .withSchema(this.DBO_SCHEMA)
                .select('*')
                .where({ organization_id })
                .andWhere({ admin_id });
        });
    }
    checkItemStock(organization_id, item_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('stock_view')
                .withSchema(this.DBO_SCHEMA)
                .select('*')
                .where({ organization_id: organization_id })
                .andWhere({ item_id })
                .first();
        });
    }
    getSingleRequisition(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('requisition_view')
                .withSchema(this.DBO_SCHEMA)
                .select('*')
                .where({ requisition_id: id })
                .first();
        });
    }
    getSingleRequisitionTrack(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('requisition_track')
                .withSchema(this.DBO_SCHEMA)
                .select('*')
                .where({ requisition_id: id })
                .orderBy('id', 'asc');
        });
    }
    getRequisitionTrack(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('requisition_track')
                .withSchema(this.DBO_SCHEMA)
                .select('*')
                .where({ requisition_id: id });
        });
    }
    checkItems(organization_id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchTerm = name.trim().toLowerCase();
            const items = yield this.db('requisition_items')
                .withSchema(this.DBO_SCHEMA)
                .where({ organization_id: organization_id })
                .andWhere({ is_deleted: false })
                .andWhere(this.db.raw('LOWER(name) LIKE ?', [`%${searchTerm}%`]))
                // .orWhere(
                //   this.db.raw('LOWER(name) LIKE ?', [
                //     `%${searchTerm.replace(/\s+/g, '%')}%`,
                //   ])
                // )
                .select('*');
            return items;
        });
    }
    createPoll(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const discussion = yield this.db('polls')
                .withSchema(this.DISCUSSION)
                .insert(payload)
                .returning('*');
            return discussion;
        });
    }
    checkIfAlreadyVote(poll_id, employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const discussion = yield this.db('votes')
                .withSchema(this.DISCUSSION)
                .where({ poll_id })
                .where({ employee_id })
                .select('*');
            return discussion;
        });
    }
    castMyVote(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const discussion = yield this.db('votes')
                .withSchema(this.DISCUSSION)
                .insert(payload);
            return discussion;
        });
    }
    createOption(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const discussion = yield this.db('poll_options')
                .withSchema(this.DISCUSSION)
                .insert(payload);
            return discussion;
        });
    }
    updateDiscussion(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const discussion = yield this.db('discussion')
                .withSchema(this.DISCUSSION)
                .where({ id })
                .update(payload);
            return discussion;
        });
    }
    deleteDiscussion(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const discussion = yield this.db('discussion')
                .withSchema(this.DISCUSSION)
                .where({ id })
                .update({ is_deleted: true });
            return discussion;
        });
    }
    createComment(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.db('comment')
                .withSchema(this.DISCUSSION)
                .insert(payload)
                .returning('*');
            return comment;
        });
    }
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.db('comment')
                .withSchema(this.DISCUSSION)
                .where({ id })
                .update('is_deleted', true);
            return comment;
        });
    }
    getToReplied(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.db('comment')
                .withSchema(this.DISCUSSION)
                .where({ id })
                .select('user_id');
            return comment;
        });
    }
    getAllDiscussion(organization_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const discussion = yield this.db('discussionview')
                .withSchema(this.DISCUSSION)
                .where({ organization_id })
                .andWhere({ is_deleted: false })
                .select('id', 'organization_id', 'posted_from', 'user_id', 'discussion', 'status', 'posted_by_name', 'posted_by_photo');
            return { discussion };
        });
    }
    getAllPolls(organization_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const polls = yield this.db('polls')
                .withSchema(this.DISCUSSION)
                .where({ organization_id })
                .andWhere({ is_deleted: false })
                .select('*')
                .orderBy('id', 'desc');
            return { polls };
        });
    }
    getSinglePoll(poll_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const polls = yield this.db('polls')
                .withSchema(this.DISCUSSION)
                .where({ id: poll_id })
                .select('*');
            return { polls };
        });
    }
    getAllEmployeeVote(poll_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('votes_view')
                .withSchema(this.DISCUSSION)
                .where({ poll_id })
                .select('name', 'designation', 'option_text', 'created_at')
                .orderBy('id', 'desc');
        });
    }
    getSingleOptionInfo(poll_id, option_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [option] = yield this.db('votes')
                .withSchema(this.DISCUSSION)
                .where({ option_id })
                .count('id as vote');
            const [total_attendee] = yield this.db('votes')
                .withSchema(this.DISCUSSION)
                .where({ poll_id })
                .count('id as total');
            const final_attendee = Number(total_attendee.total);
            const final_option = Number(option.vote);
            const percentage = Math.round((final_option / final_attendee) * 100) || 0;
            return { final_option, percentage };
        });
    }
    getSinglePollInfo(poll_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('polls')
                .withSchema(this.DISCUSSION)
                .where({ id: poll_id })
                .select('*');
        });
    }
    getOptionsPollWise(poll_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db('poll_options')
                .withSchema(this.DISCUSSION)
                .where({ poll_id })
                .select('*');
            return { data };
        });
    }
    getEmployeeOptionPoll(poll_id, employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('votes')
                .withSchema(this.DISCUSSION)
                .where({ poll_id })
                .andWhere({ employee_id })
                .select('*');
        });
    }
    countVotes(poll_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db('votes')
                .withSchema(this.DISCUSSION)
                .where({ poll_id })
                .count('id as total');
            const total = data[0].total;
            return { total };
        });
    }
    getSingleDiscussion(organization_id, discussion_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const discussion = yield this.db('discussionview')
                .withSchema(this.DISCUSSION)
                .where({ organization_id })
                .andWhere({ id: discussion_id })
                .select('id', 'organization_id', 'posted_from', 'user_id', 'discussion', 'status', 'posted_by_name', 'posted_by_photo');
            return { discussion };
        });
    }
    getComments(discussion_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.db('comment_view')
                .withSchema(this.DISCUSSION)
                .where({ discussion_id })
                .andWhere({ is_deleted: false })
                .select('id', 'comment_from_type', 'parent_comment_id', 'comment', 'created_at', 'user_name', 'user_photo', 'user_id', 'posted_by_photo', 'posted_by');
            return { comment };
        });
    }
    getCommentsCount(discussion_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.db('comment_view')
                .withSchema(this.DISCUSSION)
                .where({ discussion_id })
                .andWhere({ is_deleted: false })
                .count('id as total');
            return { comment };
        });
    }
    getSingleComment(comment_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('comment')
                .withSchema(this.DISCUSSION)
                .where({ id: comment_id })
                .select('*');
        });
    }
}
exports.default = requisitionModel;
