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
class adminDiscussionModel extends schema_1.default {
    constructor(db) {
        super();
        this.db = db;
    }
    createDiscussion(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const discussion = yield this.db('discussion')
                .withSchema(this.DISCUSSION)
                .insert(payload)
                .returning('*');
            return discussion;
        });
    }
    addNewMeal(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const discussion = yield this.db('meals')
                .withSchema(this.DISCUSSION)
                .insert(payload)
                .returning('*');
            return discussion;
        });
    }
    createMealPlan(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const discussion = yield this.db('meal_plan')
                .withSchema(this.DISCUSSION)
                .insert(payload);
            return discussion;
        });
    }
    selectMyMeal(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const discussion = yield this.db('meal_trx')
                .withSchema(this.DISCUSSION)
                .insert(payload)
                .returning('*');
            return discussion;
        });
    }
    dateOrganizationData(organization_id, meal_date) {
        return __awaiter(this, void 0, void 0, function* () {
            const discussion = yield this.db('meal_plan_view')
                .withSchema(this.DISCUSSION)
                .where({ organization_id })
                .andWhere({ meal_date })
                .select('order_end_time');
            return discussion;
        });
    }
    insertMealTransactionItems(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const discussion = yield this.db('meal_trx_item')
                .withSchema(this.DISCUSSION)
                .insert(payload);
            return discussion;
        });
    }
    updatetMealTransactionItems(id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const discussion = yield this.db('meal_trx_item')
                .withSchema(this.DISCUSSION)
                .where('trx_id', id)
                .insert('*');
            return discussion;
        });
    }
    checkMealExist(organization_id, meal_date, meal_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const discussion = yield this.db('meal_plan')
                .withSchema(this.DISCUSSION)
                .where({ organization_id: organization_id })
                .andWhere({ meal_id: meal_id })
                .andWhere({ meal_date: meal_date })
                .select('id');
            return discussion;
        });
    }
    checkSelectedMeal(employee_id, meal_date) {
        return __awaiter(this, void 0, void 0, function* () {
            const discussion = yield this.db('meal_trx')
                .withSchema(this.DISCUSSION)
                .where({ employee_id })
                .andWhere({ meal_date: meal_date })
                .select('*');
            return discussion;
        });
    }
    deleteExistingMeal(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const discussion = yield this.db('meal_trx_item')
                .withSchema(this.DISCUSSION)
                .where({ trx_id: id })
                .delete();
            return discussion;
        });
    }
    //get employee date wise mealse
    getEmployeeWiseMealInfo(employee_id, // Use lowercase 'number' for TypeScript type
    start_date, end_date) {
        return __awaiter(this, void 0, void 0, function* () {
            // Prepare the raw SQL query to run the stored procedure with the given parameters
            const result = yield this.db.raw(`SELECT * FROM discussion.get_meal_trx_by_employee(?, ?, ?)`, [employee_id, start_date, end_date]);
            // Assuming the result is in 'rows' property based on Knex's raw execution
            return result.rows; // Adjust based on how Knex returns the data in your setup
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
    //get meal info
    getMealInfo(organization_id, selected_date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('meal_report_view')
                .withSchema(this.DISCUSSION)
                .where({ organization_id })
                .andWhere({ meal_date: selected_date })
                .select('*')
                .orderBy('meal_id', 'desc');
        });
    }
    //ordered employee
    orderedEmployee(organization_id, selected_date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('meal_trx')
                .withSchema(this.DISCUSSION)
                .where({ organization_id })
                .andWhere({ meal_date: selected_date })
                .select('employee_id')
                .orderBy('employee_id', 'desc');
        });
    }
    //get meals
    getAllMeals(organization_id, name) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // Query to fetch meals
            const mealsQuery = this.db('meals')
                .withSchema(this.DISCUSSION)
                .where({ organization_id });
            // If 'name' is provided, apply a 'like' filter for name search
            if (name) {
                mealsQuery.andWhere('description', 'ILIKE', `%${name}%`);
            }
            // Fetch meals with order by 'id' in descending order
            const meals = yield mealsQuery.select('*').orderBy('id', 'desc');
            // Query to get total count of meals (you might want to adjust this)
            const totalQuery = this.db('meals')
                .withSchema(this.DISCUSSION)
                .where({ organization_id });
            // Apply 'name' search to the total count query as well
            if (name) {
                totalQuery.andWhere('description', 'ILIKE', `%${name}%`);
            }
            // Fetch total meals count
            const total = yield totalQuery.count({ total: '*' });
            return {
                data: meals,
                total: ((_a = total[0]) === null || _a === void 0 ? void 0 : _a.total) || 0, // returning the total as number
            };
        });
    }
    getEmployeeWisePaymentInfo(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id, employee_id, start_date, end_date } = payload || {};
            const dtbs = this.db('meal_trx_view as mt');
            const data = yield dtbs
                .withSchema(this.DISCUSSION)
                .select('*')
                .modify((queryBuilder) => {
                if (organization_id) {
                    queryBuilder.where('organization_id', organization_id);
                }
                if (employee_id) {
                    queryBuilder.where('employee_id', employee_id);
                }
                if (start_date) {
                    queryBuilder.where('meal_date', '>=', start_date);
                }
                if (end_date) {
                    queryBuilder.where('meal_date', '<=', end_date);
                }
            });
            return data;
        });
    }
    getEmployeeTransactions(organization_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db('employee as e');
            // Destructure payload for easier access
            const { limit, skip, name } = payload || {};
            // Apply pagination if limit and skip are provided
            if (limit && skip) {
                dtbs.limit(parseInt(limit, 10));
                dtbs.offset(parseInt(skip, 10));
            }
            // Build the query
            const data = yield dtbs
                .withSchema(this.CRM_SCHEMA)
                .select('e.id', 'e.name as employee_name', 'e.email', this.db.raw('SUM(dmi.cost) as total_cost'), // Calculate total cost
            this.db.raw('SUM(CASE WHEN dmt.is_paid THEN dmi.cost ELSE 0 END) as total_paid'), // Sum of paid amounts
            this.db.raw('SUM(CASE WHEN NOT dmt.is_paid THEN dmi.cost ELSE 0 END) as total_unpaid') // Sum of unpaid amounts
            )
                .joinRaw('LEFT JOIN discussion.meal_trx AS dmt ON e.id = dmt.employee_id')
                .joinRaw('LEFT JOIN discussion.meal_trx_item AS dmi ON dmt.id = dmi.trx_id')
                .where('e.organization_id', organization_id)
                .modify((queryBuilder) => {
                if (payload) {
                    // Add additional filters based on the payload
                    if (payload.employee_id) {
                        queryBuilder.andWhere('e.id', payload.employee_id);
                    }
                    if (payload.start_date) {
                        queryBuilder.andWhere('dmt.meal_date', '>=', payload.start_date);
                    }
                    if (payload.end_date) {
                        queryBuilder.andWhere('dmt.meal_date', '<=', payload.end_date);
                    }
                    if (name) {
                        queryBuilder.andWhere('e.name', 'ILIKE', `%${name}%`);
                    }
                }
            })
                .groupBy('e.id', 'e.email', 'e.name');
            return {
                data,
                // total: parseInt(total[0].total as string),
            };
        });
    }
    getPaymentList(organization_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtbs = this.db('meal_payment as mp');
            // Destructure payload for easier access
            const { limit, skip, name } = payload || {};
            // Apply pagination if limit and skip are provided
            if (limit && skip) {
                dtbs.limit(parseInt(limit, 10));
                dtbs.offset(parseInt(skip, 10));
            }
            // Build the query
            const data = yield dtbs
                .withSchema(this.DISCUSSION)
                .select('mp.id', 'mp.employee_id', 'mp.voucher_id', 'mp.total_paid', 'mp.payment_date', 'mp.received_by', 'employee.name', 'employee.phone', 'ua.name as received_by_admin')
                .joinRaw('JOIN crm.employee AS employee ON mp.employee_id = employee.id')
                .joinRaw('JOIN crm.user_admin AS ua ON mp.received_by = ua.id')
                .where('mp.is_deleted', false)
                .andWhere('mp.organization_id', organization_id)
                .modify((queryBuilder) => {
                if (payload) {
                    // Add additional filters based on the payload
                    if (payload.employee_id) {
                        queryBuilder.andWhere('mp.employee_id', payload.employee_id);
                    }
                    if (payload.start_date) {
                        queryBuilder.andWhere('mp.payment_date', '>=', payload.start_date);
                    }
                    if (payload.end_date) {
                        queryBuilder.andWhere('mp.payment_date', '<=', payload.end_date);
                    }
                    if (name) {
                        queryBuilder.andWhere('employee.name', 'ILIKE', `%${name}%`);
                    }
                }
            });
            const total = yield this.db('meal_payment as mp')
                .withSchema(this.DISCUSSION)
                .count('mp.id as total')
                .joinRaw('JOIN crm.employee AS employee ON mp.employee_id = employee.id')
                .where('mp.is_deleted', false)
                .andWhere('mp.organization_id', organization_id)
                .modify((queryBuilder) => {
                if (payload) {
                    // Add additional filters based on the payload
                    if (payload.employee_id) {
                        queryBuilder.andWhere('mp.employee_id', payload.employee_id);
                    }
                    if (payload.start_date) {
                        queryBuilder.andWhere('mp.payment_date', '>=', payload.start_date);
                    }
                    if (payload.end_date) {
                        queryBuilder.andWhere('mp.payment_date', '<=', payload.end_date);
                    }
                    if (name) {
                        queryBuilder.andWhere('employee.name', 'ILIKE', `%${name}%`);
                    }
                }
            });
            return {
                data,
                total: parseInt(total[0].total),
            };
        });
    }
    getSingleMealPayment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('meal_payment_view')
                .withSchema(this.DISCUSSION)
                .where({ meal_payment_id: id })
                .select('*');
        });
    }
    //update meal payment
    updateMealPayment(organization_id, employee_id, from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('meal_trx')
                .withSchema(this.DISCUSSION)
                .where({ organization_id })
                .andWhere({ employee_id })
                .whereBetween('meal_date', [from_date, to_date]) // Condition to filter by meal_date
                .andWhere('is_paid', false) // Condition to check if is_paid is false
                .update({
                is_paid: true,
            });
        });
    }
    //insert mealpayment
    insertPaymentReciept(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db('meal_payment')
                .withSchema(this.DISCUSSION)
                .insert(payload)
                .returning('*');
            return data;
        });
    }
    paymentItem(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('meal_payment_item')
                .withSchema(this.DISCUSSION)
                .insert(payload);
        });
    }
    //get meal plans
    getMealPlans(organization_id, start_date, end_date) {
        return __awaiter(this, void 0, void 0, function* () {
            // Build the base query for fetching meal plans
            const mealPlansQuery = this.db('meal_plan_view')
                .withSchema(this.DISCUSSION)
                .where({ organization_id });
            // Add date filter if both start_date and end_date are provided
            if (start_date && end_date) {
                mealPlansQuery.andWhereBetween('meal_date', [start_date, end_date]);
            }
            else if (start_date) {
                // If only start_date is provided, filter for meals on or after that date
                mealPlansQuery.andWhere('meal_date', '>=', start_date);
            }
            else if (end_date) {
                // If only end_date is provided, filter for meals on or before that date
                mealPlansQuery.andWhere('meal_date', '<=', end_date);
            }
            // Fetch the meal plans with ordering by meal_date in descending order
            const data = yield mealPlansQuery.select('*').orderBy('meal_date', 'desc');
            // Build a separate query to count the total number of records matching the same conditions
            const totalQuery = this.db('meal_plan_view')
                .withSchema(this.DISCUSSION)
                .where({ organization_id });
            // Apply the same date filters to the total count query
            if (start_date && end_date) {
                totalQuery.andWhereBetween('meal_date', [start_date, end_date]);
            }
            else if (start_date) {
                totalQuery.andWhere('meal_date', '>=', start_date);
            }
            else if (end_date) {
                totalQuery.andWhere('meal_date', '<=', end_date);
            }
            // Fetch the total count of records
            const total = yield totalQuery.count({ total: '*' }).first();
            return {
                data,
                total: total ? total.total : 0, // Return total as a number
            };
        });
    }
    //unorderedEmployee
    getEmployeeUsingArr(employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const unordered = yield this.db('employee')
                .withSchema(this.CRM_SCHEMA)
                .whereIn('id', employee_id)
                .select('id as employee_id', 'name as employee_name', 'phone as employee_phone')
                .orderBy('id', 'desc');
            const unorderedCount = yield this.db('employee')
                .withSchema(this.CRM_SCHEMA)
                .whereIn('id', employee_id)
                .count('id as unorderedCount');
            return { unordered, unorderedCount };
        });
    }
    //getSingleDayMealTrx
    getSingleDayMealTrx(organization_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.raw(`SELECT * FROM discussion.get_single_day_report(?, ?)`, [payload === null || payload === void 0 ? void 0 : payload.target_date, organization_id]);
            // Assuming the result is in 'rows' property based on Knex's raw execution
            return result.rows; // Adjust based on how Knex returns the data in your setup
        });
    }
    //getAdminTotalInfo
    getMealTrx(organization_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('meal_trx as mt')
                .withSchema(this.DISCUSSION)
                .select('mt.id', 'mt.meal_date', 'mt.meal_token', 'mt.is_paid', 'mti.meal_id', 'mt.employee_id', 'e.name as employee_name', 'e.phone as employee_phone', 'mti.quantity', 'mti.cost', 'ml.description', 'ml.cost as base_price')
                .where('mt.organization_id', organization_id)
                .leftJoin('meal_trx_item as mti', 'mti.trx_id', 'mt.id')
                .leftJoin('meals as ml', 'ml.id', 'mti.meal_id')
                .joinRaw('JOIN crm.employee AS e ON mt.employee_id = e.id')
                .modify((queryBuilder) => {
                if (payload) {
                    if (payload.employee_id) {
                        queryBuilder.andWhere('mt.employee_id', payload.employee_id);
                    }
                    if (payload.is_paid) {
                        queryBuilder.andWhere('mt.is_paid', payload.is_paid);
                    }
                    if (payload.start_date) {
                        queryBuilder.andWhere('mt.meal_date', '>=', payload.start_date);
                    }
                    if (payload.end_date) {
                        queryBuilder.andWhere('mt.meal_date', '<=', payload.end_date);
                    }
                }
            })
                .orderBy('mt.id', 'desc');
        });
    }
    getMealPaymentRecept(organization_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('meal_payment as mp')
                .withSchema(this.DISCUSSION)
                .select('*')
                .where({ organization_id })
                .leftJoin('meal_trx_item as mti', 'mti.trx_id', 'mt.id')
                .modify((queryBuilder) => {
                if (payload) {
                    if (payload.start_date) {
                        queryBuilder.andWhere('mp.meal_date', '>=', payload.start_date);
                    }
                    if (payload.end_date) {
                        queryBuilder.andWhere('mp.meal_date', '<=', payload.end_date);
                    }
                }
            });
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
    getTodayMeals(organization_id, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('meal_plan_view')
                .withSchema(this.DISCUSSION)
                .where({ organization_id: organization_id })
                .andWhere({ meal_date: date })
                .select('*');
        });
    }
}
exports.default = adminDiscussionModel;
