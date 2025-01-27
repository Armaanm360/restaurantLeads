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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_service_1 = __importDefault(require("../../abstract/abstract.service"));
const socket_1 = require("../../app/socket");
const notification_service_1 = __importDefault(require("../../common/commonService/notification.service"));
const lib_1 = __importDefault(require("../../utils/lib/lib"));
const paymentAcknowledgment2_1 = require("../../utils/templates/paymentAcknowledgment2");
class AdminDiscussionService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //create new discussion topic
    createDiscussion(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.adminDiscussionModel();
                const notifyService = new notification_service_1.default();
                const { organization_id, id } = req.admin;
                req.body['organization_id'] = organization_id;
                req.body['posted_from'] = 'admin';
                req.body['user_id'] = id;
                req.body['status'] = 'approved';
                const createDiscussion = yield model.createDiscussion(req.body);
                //==============================================
                //                Notification Section
                //==============================================
                const notificationPayload = {
                    type: 'discussion',
                    ref_id: createDiscussion[0].id,
                    message: `নতুন আলোচনা এসেছে  ${createDiscussion[0].discussion}`,
                    organization_id: organization_id,
                    title: `নতুন আলোচনা এসেছে  ${createDiscussion[0].discussion}`,
                    description: `নতুন আলোচনা এসেছে  ${createDiscussion[0].discussion}`,
                };
                yield notifyService.adminToAllEmployee(notificationPayload);
                //==============================================
                //            End of Notification Section
                //==============================================
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Discussion Created Successfully',
                };
            }));
        });
    }
    //create new poll
    createPolls(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.adminDiscussionModel();
                const { organization_id } = req.admin;
                const _a = req.body, { options } = _a, rest = __rest(_a, ["options"]);
                const files = req.files || [];
                if (files.length) {
                    rest['image'] = files[0].filename;
                }
                rest['organization_id'] = organization_id;
                const poll = yield model.createPoll(rest);
                //created poll options
                const jsonParse = JSON.parse(options);
                const createdOptions = new Set();
                for (const option of jsonParse) {
                    if (!createdOptions.has(option.option_text)) {
                        try {
                            yield model.createOption({
                                poll_id: poll[0].id,
                                option_text: option.option_text,
                            });
                            createdOptions.add(option.option_text);
                        }
                        catch (error) {
                            console.error(`Failed to create option: ${option.option_text}`, error);
                        }
                    }
                    else {
                        console.warn(`Duplicate option skipped: ${option.option_text}`);
                    }
                }
                const notifyService = new notification_service_1.default();
                //==============================================
                //                Notification Section
                //==============================================
                const notificationPayload = {
                    type: 'polls',
                    ref_id: poll[0].id,
                    message: `A New Poll Has Been Created  ${poll[0].title}`,
                    organization_id: organization_id,
                    title: `A New Poll Has Been Created  ${poll[0].title}`,
                    description: `A New Poll Has Been Created  ${poll[0].title}`,
                };
                yield notifyService.adminToAllEmployee(notificationPayload);
                //==============================================
                //            End of Notification Section
                //==============================================
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Discussion Created Successfully',
                };
            }));
        });
    }
    //update discussion
    updateDiscussion(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.adminDiscussionModel();
                const dis_id = parseInt(req.params.id);
                yield model.updateDiscussion(dis_id, req.body);
                //==============================================
                //            End of Notification Section
                //==============================================
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Discussion Created Successfully',
                };
            }));
        });
    }
    //update discussion
    deleteDiscussion(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.adminDiscussionModel();
                const dis_id = parseInt(req.params.id);
                yield model.deleteDiscussion(dis_id);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Discussion Deleted Successfully',
                };
            }));
        });
    }
    //create comment on dis
    createComment(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.adminDiscussionModel();
                const { organization_id, id, name } = req.admin;
                // Ensure 'comment_from_type' and 'user_id' are set
                req.body['comment_from_type'] = 'admin';
                req.body['user_id'] = id;
                if (req.body['parent_comment_id'] === null) {
                    const { discussion } = yield model.getSingleDiscussion(organization_id, req.body['discussion_id']);
                    const userAdmin = yield this.Model.UserAdminModel().getSingleAdminInfo(discussion[0].user_id);
                    //replied to post no parent comment
                    let posterUser = discussion[0].posted_from;
                    yield model.createComment(req.body);
                    if (posterUser === 'admin') {
                        //==============================================
                        //                Notification Section
                        //==============================================
                        const notify = yield this.Model.commonModel().createNotificationAdmin({
                            type: 'discussion',
                            ref_id: req.body['discussion_id'],
                            message: `${name} Commented On Your Discussion`,
                        });
                        yield this.Model.commonModel().addAdminNotification({
                            notification_id: notify[0].id,
                            user_id: discussion[0].user_id,
                        });
                        if (userAdmin && userAdmin[0].socket_id) {
                            socket_1.io.to(userAdmin[0].socket_id).emit('notification', {
                                message: notify[0].message,
                                type: 'discussion',
                                ref_id: req.body['discussion_id'],
                            });
                            console.log('Notification emitted to socket ID:', userAdmin[0].socket_id);
                        }
                        else {
                            console.error('Failed to emit notification, socket ID is invalid.');
                        }
                        //==============================================
                        //            End of Notification Section
                        //==============================================
                        return {
                            success: true,
                            code: this.StatusCode.HTTP_SUCCESSFUL,
                            message: 'Comment Submitted Successfully',
                        };
                    }
                    else {
                        const userEmployee = yield this.Model.employeeModel().getSingleInfoEmployee(discussion[0].user_id);
                        //==============================================
                        //                Notification Section
                        //==============================================
                        const notify = yield this.Model.commonModel().createNotification({
                            type: 'discussion',
                            ref_id: req.body['discussion_id'],
                            message: `${name} Commented On Your Discussion`,
                        });
                        yield this.Model.commonModel().addEmployeeNotification({
                            notification_id: notify[0].id,
                            user_id: discussion[0].user_id,
                        });
                        if (userEmployee && userEmployee.socket_id) {
                            socket_1.io.to(userEmployee.socket_id).emit('notification', {
                                message: notify[0].message,
                                type: 'discussion',
                                ref_id: req.body['discussion_id'],
                            });
                            console.log('Notification emitted to socket ID:', userEmployee.socket_id);
                        }
                        else {
                            console.error('Failed to emit notification, socket ID is invalid.');
                        }
                        //==============================================
                        //            End of Notification Section
                        //==============================================
                    }
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: 'Comment Submitted Successfully',
                    };
                }
                else {
                    yield model.createComment(req.body);
                    const checkCommentType = yield model.getSingleComment(parseInt(req.body['parent_comment_id']));
                    if (checkCommentType[0].comment_from_type === 'admin') {
                        const userAdmin = yield this.Model.UserAdminModel().getSingleAdminInfo(checkCommentType[0].user_id);
                        //==============================================
                        //                Notification Section
                        //==============================================
                        const notify = yield this.Model.commonModel().createNotificationAdmin({
                            type: 'discussion',
                            ref_id: req.body['discussion_id'],
                            message: `${name} Replied To Your Comment`,
                        });
                        yield this.Model.commonModel().addAdminNotification({
                            notification_id: notify[0].id,
                            user_id: checkCommentType[0].user_id,
                        });
                        if (userAdmin && userAdmin[0].socket_id) {
                            socket_1.io.to(userAdmin[0].socket_id).emit('notification', {
                                message: notify[0].message,
                                type: 'discussion',
                                ref_id: req.body['discussion_id'],
                            });
                            console.log('Notification emitted to socket ID:', userAdmin[0].socket_id);
                        }
                        else {
                            console.error('Failed to emit notification, socket ID is invalid.');
                        }
                        //==============================================
                        //            End of Notification Section
                        //==============================================
                        return {
                            success: true,
                            code: this.StatusCode.HTTP_SUCCESSFUL,
                            message: 'Comment Submitted Successfully',
                        };
                    }
                    else {
                        const userEmployee = yield this.Model.employeeModel().getSingleInfoEmployee(checkCommentType[0].user_id);
                        //==============================================
                        //                Notification Section
                        //==============================================
                        const notify = yield this.Model.commonModel().createNotification({
                            type: 'discussion',
                            ref_id: req.body['discussion_id'],
                            message: `${name} Replied To Your Comment`,
                        });
                        yield this.Model.commonModel().addEmployeeNotification({
                            notification_id: notify[0].id,
                            user_id: checkCommentType[0].user_id,
                        });
                        if (userEmployee && userEmployee.socket_id) {
                            socket_1.io.to(userEmployee.socket_id).emit('notification', {
                                message: notify[0].message,
                                type: 'discussion',
                                ref_id: req.body['discussion_id'],
                            });
                            console.log('Notification emitted to socket ID:', userEmployee.socket_id);
                        }
                        else {
                            console.error('Failed to emit notification, socket ID is invalid.');
                        }
                        //==============================================
                        //            End of Notification Section
                        //==============================================
                    }
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: 'Comment Submitted Successfully',
                    };
                }
            }));
        });
    }
    //get all discussion and comments
    getAllDiscussion(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id, id } = req.admin;
            const type = 'admin';
            const model = this.Model.adminDiscussionModel();
            // Fetch discussions
            const { discussion } = yield model.getAllDiscussion(organization_id);
            // Fetch and organize comments for each discussion
            for (let i = 0; i < discussion.length; i++) {
                const discussion_id = discussion[i].id;
                const { comment } = yield model.getCommentsCount(discussion_id); // Assuming getComments fetches comments for a discussion
                // // Organize comments into nested structure using recursive function
                // Organize comments into nested structure using recursive function
                discussion[i].total_comments = comment[0].total;
                // want to use reccursive here instead of for loop!
            }
            // Return formatted response
            return {
                success: true,
                data: discussion,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
    //get all discussion and comments
    getAllPolls(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id } = req.admin;
            const model = this.Model.adminDiscussionModel();
            // Fetch polls
            const { polls } = yield model.getAllPolls(organization_id);
            // Fetch options for each poll and add them to the poll object
            const pollsWithOptions = yield Promise.all(polls.map((poll) => __awaiter(this, void 0, void 0, function* () {
                const { data } = yield model.getOptionsPollWise(poll.id);
                return Object.assign(Object.assign({}, poll), { options: data.map((option) => ({
                        option_id: option.id,
                        option_text: option.option_text,
                    })) });
            })));
            // Return formatted response
            return {
                success: true,
                data: pollsWithOptions,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
    //get all discussion and comments
    getMealInfo(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id } = req.admin;
            const model = this.Model.adminDiscussionModel();
            // Get selected date from query or set to current date if not provided
            const selected_date = req.query.date || new Date().toISOString().split('T')[0]; // Default to today's date in YYYY-MM-DD format
            // Fetch meal info
            const data = yield model.getMealInfo(organization_id, selected_date);
            // Calculate the sum of ordered_count
            const totalOrderedCount = data.reduce((total, meal) => {
                return total + parseInt(meal.ordered_count, 10); // Convert ordered_count to an integer
            }, 0);
            /*  */
            //who didn't order
            const allemployee = yield this.Model.employeeModel().getAllEmployeeSocket(organization_id);
            const who_ordered = yield model.orderedEmployee(organization_id, selected_date);
            // all employee
            const empArr = allemployee.map((item) => item.id);
            // ordered employee
            const orderEmpArr = who_ordered.map((item) => item.employee_id);
            // employee who didn't order
            const underOrderedEmployee = empArr.filter((empId) => !orderEmpArr.includes(empId));
            const { unordered, unorderedCount } = yield model.getEmployeeUsingArr(underOrderedEmployee);
            // Return formatted response
            return {
                success: true,
                data: data,
                unOrderedEmployee: unordered,
                totalOrderedCount: totalOrderedCount,
                unOrderedEmployeeCount: Number(unorderedCount[0].unorderedCount),
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
    getMealTrx(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id } = req.admin;
            const model = this.Model.adminDiscussionModel();
            const { start_date, end_date, employee_id } = req.query;
            const data = yield model.getMealTrx(organization_id, {
                employee_id: Number(employee_id),
                start_date: start_date,
                end_date: end_date,
            });
            const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);
            const totalCost = data.reduce((sum, item) => sum + parseFloat(item.cost), 0);
            const received_amount = data
                .filter((item) => item.is_paid)
                .reduce((sum, item) => sum + parseFloat(item.cost), 0);
            // const processedData = data.reduce(
            //   (acc: any, item: any) => {
            //     acc.total_ordered_quantity += item.quantity;
            //     acc.total_cost += parseFloat(item.cost);
            //     if (item.is_paid) {
            //       acc.received_amount += parseFloat(item.cost);
            //     }
            //     return acc;
            //   },
            //   {
            //     total_ordered_quantity: 0,
            //     total_cost: 0,
            //     received_amount: 0,
            //   }
            // );
            // const summary = data.reduce(
            //   (acc: any, item: any) => {
            //     const itemCost = parseFloat(item.cost) || 0; // Default to 0 if cost is null or invalid
            //     acc.total_ordered_quantity += item.quantity || 0; // Default to 0 if quantity is null
            //     acc.total_cost += itemCost;
            //     if (item.is_paid) {
            //       acc.received_amount += itemCost;
            //     }
            //     return acc;
            //   },
            //   {
            //     total_ordered_quantity: 0,
            //     total_cost: 0,
            //     received_amount: 0,
            //   }
            // );
            const uniqueData = data.reduce((acc, item) => {
                if (!acc[item.id]) {
                    acc[item.id] = item; // Store the item if the ID is not yet present
                }
                return acc;
            }, {});
            const uniqueDataArray = Object.values(uniqueData); // Convert the object back to an array
            return {
                success: true,
                data: data,
                total_ordered_quantity: totalQuantity,
                total_cost: totalCost,
                // total_cost: processedData.total_cost,
                due_amount: totalCost - received_amount,
                received_amount: received_amount,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
    getSingleDayMealTrx(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id } = req.admin;
            const model = this.Model.adminDiscussionModel();
            const { target_date } = req.query;
            const data = yield model.getSingleDayMealTrx(organization_id, {
                target_date: target_date,
            });
            // Initialize the summary values
            let summary = {
                total_ordered_quantity: 0,
                total_cost: 0,
                due_amount: 0,
                received_amount: 0,
            };
            console.log(summary);
            // Calculate the overall summary by iterating over the data
            data.forEach((meal) => {
                summary.total_ordered_quantity += meal.total_quantity;
                summary.total_cost += parseFloat(meal.total_cost);
                summary.received_amount += parseFloat(meal.total_received_amount);
                summary.due_amount += parseFloat(meal.due_amount);
            });
            return {
                success: true,
                data: data,
                total_ordered_quantity: summary.total_ordered_quantity,
                total_cost: summary.total_cost.toFixed(2),
                due_amount: summary.due_amount.toFixed(2),
                received_amount: summary.received_amount.toFixed(2),
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
    getAllMeals(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id } = req.admin;
            const model = this.Model.adminDiscussionModel();
            const { name } = req.query;
            // Call the model function and pass organization_id and name (if provided)
            const meals = yield this.Model.adminDiscussionModel().getAllMeals(organization_id, name ? name : undefined // Pass 'name' only if it's provided
            );
            // Return formatted response
            return {
                success: true,
                total: meals.total,
                data: meals.data,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
    addNewMeal(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.adminDiscussionModel(trx);
                const { organization_id, id } = req.admin;
                req.body['organization_id'] = organization_id;
                req.body['created_by'] = id;
                req.body['category_id'] = 1;
                yield model.addNewMeal(req.body);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Meal Created Successfully',
                };
            }));
        });
    }
    //add new meal plan
    createMealPlan(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.adminDiscussionModel(trx);
                const { organization_id } = req.admin;
                const { meal_date, meals, order_end_time } = req.body;
                const conflictingMeals = [];
                const mealsToInsert = [];
                for (const meal of meals) {
                    // Check if the meal already exists in the plan
                    const existingMeal = yield model.checkMealExist(organization_id, meal_date, meal.meal_id);
                    if (existingMeal.length > 0) {
                        conflictingMeals.push({ meal_date, meal_id: meal.meal_id });
                    }
                    else {
                        mealsToInsert.push({
                            meal_date,
                            order_end_time,
                            meal_id: meal.meal_id,
                            organization_id,
                        });
                    }
                }
                if (conflictingMeals.length > 0) {
                    return {
                        success: false,
                        code: this.StatusCode.HTTP_BAD_REQUEST,
                        message: 'Some meals are already added to the plan',
                        conflictingMeals,
                    };
                }
                // Insert all non-conflicting meal plans
                if (mealsToInsert.length > 0) {
                    yield model.createMealPlan(mealsToInsert);
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Meal Plan created successfully',
                };
            }));
        });
    }
    //order new meal
    orderNewMeal(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id, id } = req.admin;
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.adminDiscussionModel(trx);
                /* checking if he already ordered something! */
                const exsistingData = yield model.checkSelectedMeal(req.body.employee_id, req.body.meal_date);
                if (exsistingData.length) {
                    //delete existing data
                    yield model.deleteExistingMeal(exsistingData[0].id);
                    console.log('meal_item_deleted');
                    console.log(req.body);
                    const mealItems = req.body.meals.map((meal) => ({
                        trx_id: exsistingData[0].id,
                        quantity: meal.quantity,
                        meal_id: meal.meal_id,
                        cost: meal.cost,
                    }));
                    const kosha = yield model.insertMealTransactionItems(mealItems);
                    console.log(kosha);
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: 'Meal System Updated Successfully',
                    };
                }
                /* end */
                // Function to generate meal token
                function generateOrderId() {
                    const now = new Date();
                    const dateString = now.toISOString().split('T')[0].replace(/-/g, '');
                    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
                    const orderId = `EMP${id}${organization_id}${randomNumber}`;
                    return orderId;
                }
                // Generate meal token
                const mealToken = generateOrderId();
                req.body['meal_token'] = mealToken;
                req.body['organization_id'] = organization_id;
                // req.body['employee_id'] = id;
                // Insert into the meal_trx table (main transaction)
                const mealTrxData = {
                    organization_id: req.body.organization_id,
                    employee_id: req.body.employee_id,
                    meal_date: req.body.meal_date,
                    meal_token: req.body.meal_token,
                };
                const mealTrxId = yield model.selectMyMeal(mealTrxData);
                // Insert each meal item into the meal_trx_items table (transaction details)
                const mealItems = req.body.meals.map((meal) => ({
                    trx_id: mealTrxId[0].id,
                    quantity: meal.quantity,
                    meal_id: meal.meal_id,
                    cost: meal.cost,
                }));
                yield model.insertMealTransactionItems(mealItems);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Thanks For Choosing Meal!!!',
                };
            }));
        });
    }
    //meal payment info
    getEmployeeWisePaymentInfo(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // Extract query parameters from the request
            const { employee_id, start_date, end_date, is_paid } = req.query;
            // Check if all required parameters are present
            if (!employee_id || !start_date || !end_date) {
                return {
                    success: false,
                    code: this.StatusCode.HTTP_BAD_REQUEST,
                    message: 'Missing required parameters. Please provide employee_id, start_date, and end_date.',
                    data: null,
                    summary: null,
                };
            }
            // Extract organization_id from the admin info in the request
            const { organization_id } = req.admin;
            // Call the model function to get employee-wise payment info
            const model = this.Model.adminDiscussionModel();
            const data = yield model.getMealTrx(organization_id, {
                employee_id: employee_id ? Number(employee_id) : undefined,
                start_date: start_date,
                is_paid: is_paid,
                end_date: end_date,
            });
            // Initialize total quantity and cost
            let total_quantity = 0;
            let total_cost = 0;
            let total_received_amount = 0;
            let total_due = 0;
            // Iterate over the meal data to calculate totals
            data.forEach((meal) => {
                total_quantity += meal.quantity; // Add to total quantity
                total_cost += parseFloat(meal.cost); // Convert cost to float and add to total cost
                if (meal.is_paid) {
                    total_received_amount += parseFloat(meal.cost);
                }
                total_due = total_cost - total_received_amount;
            });
            // Return the response
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                total_quantity,
                total_received_amount,
                total_cost,
                total_due,
                data,
            };
        });
    }
    //get meal payment list
    getMealPaymentList(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // Extract organization_id from the admin info in the request
            const { organization_id } = req.admin;
            // Extract relevant parameters from the request body or query
            const { employee_id, start_date, end_date, limit, skip, name } = req.query; // Adjust this to req.query if needed
            // Call the model function to get employee-wise payment info
            const model = this.Model.adminDiscussionModel();
            const { data, total } = yield model.getPaymentList(organization_id, {
                employee_id: Number(employee_id),
                start_date: start_date,
                end_date: end_date,
                limit: limit,
                skip: skip,
                name: name,
            });
            // Return the response
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: data,
                total,
            };
        });
    }
    //get single meal payment
    getSingleMealPayment(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // Extract organization_id from the admin info in the request
            const { organization_id } = req.admin;
            const payment_id = Number(req.params.id);
            // Call the model function to get employee-wise payment info
            const model = this.Model.adminDiscussionModel();
            const data = yield model.getSingleMealPayment(payment_id);
            // Return the response
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                data: data[0],
            };
        });
    }
    //add new meal plan
    createMealPayment(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id, id } = req.admin;
                const model = this.Model.adminDiscussionModel(trx);
                const from_date = req.body['from_date'];
                const to_date = req.body['to_date'];
                const employee_id = req.body['employee_id'];
                const total_paid = req.body['total_paid'];
                const currentDate = new Date(); // Ensure you have a current date
                // Update the meal payment for the employee
                yield model.updateMealPayment(organization_id, employee_id, from_date, to_date);
                function generateRandomCode() {
                    return Math.floor(100000 + Math.random() * 900000).toString();
                }
                // Example usage:
                const randomCode = generateRandomCode();
                // Insert a new payment receipt
                const receipt = yield model.insertPaymentReciept({
                    voucher_id: `PM-${organization_id}${organization_id}${randomCode}`,
                    total_paid: total_paid,
                    organization_id: organization_id,
                    payment_date: currentDate,
                    employee_id: employee_id,
                    received_by: id,
                });
                // Fetch employee-wise payment info
                const entered_data = yield model.getMealTrx(organization_id, {
                    employee_id: employee_id ? Number(employee_id) : undefined,
                    start_date: from_date,
                    end_date: to_date, // Ensure it's a string
                });
                console.log(organization_id, employee_id, from_date, to_date);
                // Loop through entered_data to insert payment items
                for (const data of entered_data) {
                    yield model.paymentItem({
                        payment_id: receipt[0].id,
                        meal_id: data.meal_id,
                        meal_date: data.meal_date,
                        meal_quantity: data.quantity,
                        cost: data.cost, // Assuming entered_data has a 'cost' field
                    });
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Meal Plan created successfully',
                };
            }));
        });
    }
    undoPayment(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id, id } = req.admin;
                const model = this.Model.adminDiscussionModel(trx);
                const from_date = req.body['from_date'];
                const to_date = req.body['to_date'];
                const employee_id = req.body['employee_id'];
                const total_paid = req.body['total_paid'];
                const currentDate = new Date(); // Ensure you have a current date
                // Update the meal payment for the employee
                yield model.updateMealPayment(organization_id, employee_id, from_date, to_date);
                function generateRandomCode() {
                    return Math.floor(100000 + Math.random() * 900000).toString();
                }
                // Example usage:
                const randomCode = generateRandomCode();
                // Insert a new payment receipt
                const receipt = yield model.insertPaymentReciept({
                    voucher_id: `PM-${organization_id}${organization_id}${randomCode}`,
                    total_paid: total_paid,
                    organization_id: organization_id,
                    payment_date: currentDate,
                    employee_id: employee_id,
                    received_by: id,
                });
                // Fetch employee-wise payment info
                const entered_data = yield model.getMealTrx(organization_id, {
                    employee_id: employee_id ? Number(employee_id) : undefined,
                    start_date: from_date,
                    end_date: to_date, // Ensure it's a string
                });
                console.log(organization_id, employee_id, from_date, to_date);
                // Loop through entered_data to insert payment items
                for (const data of entered_data) {
                    yield model.paymentItem({
                        payment_id: receipt[0].id,
                        meal_id: data.meal_id,
                        meal_date: data.meal_date,
                        meal_quantity: data.quantity,
                        cost: data.cost, // Assuming entered_data has a 'cost' field
                    });
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Meal Plan created successfully',
                };
            }));
        });
    }
    //multiple payment at a time
    multipleEmployeePayment(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { organization_id, id } = req.admin;
                const model = this.Model.adminDiscussionModel(trx);
                const from_date = req.body['from_date'];
                const to_date = req.body['to_date'];
                const employee_ids = req.body['employee_ids']; // array of employee ids
                const currentDate = new Date();
                // Function to generate a random 6-digit voucher code
                function generateRandomCode() {
                    return Math.floor(100000 + Math.random() * 900000).toString();
                }
                // Loop through each employee_id and process the payment
                for (const employee_id of employee_ids) {
                    // Update the meal payment for the current employee
                    yield model.updateMealPayment(organization_id, employee_id, from_date, to_date);
                    //employee id get
                    // Fetch employee-wise payment info
                    const entered_data = yield model.getMealTrx(organization_id, {
                        employee_id: employee_id ? Number(employee_id) : undefined,
                        start_date: from_date,
                        end_date: to_date,
                    });
                    // Calculate the total cost from the fetched data, ensuring cost is treated as a number
                    const total_paid = entered_data.reduce((sum, data) => sum + parseFloat(data.cost), // Convert cost to float
                    0);
                    // Generate a random code for the payment receipt
                    const randomCode = generateRandomCode();
                    // Insert a new payment receipt for the current employee with the total calculated cost
                    const receipt = yield model.insertPaymentReciept({
                        voucher_id: `PM-${organization_id}${randomCode}`,
                        total_paid: total_paid,
                        organization_id: organization_id,
                        payment_date: currentDate,
                        employee_id: employee_id,
                        received_by: id,
                    });
                    // Loop through entered_data to insert payment items
                    for (const data of entered_data) {
                        yield model.paymentItem({
                            payment_id: receipt[0].id,
                            meal_id: data.meal_id,
                            meal_date: data.meal_date,
                            meal_quantity: data.quantity,
                            cost: parseFloat(data.cost), // Ensure cost is treated as a number
                        });
                    }
                    const empGet = yield this.Model.employeeModel().getSingleInfoEmployee(employee_id);
                    const paymentDateRange = `${from_date} - ${to_date}`;
                    // send sms
                    yield lib_1.default.sendEmail(empGet.email, 'Payment Acknowledgement', (0, paymentAcknowledgment2_1.paymentAcknowledgment2)(empGet.name, total_paid, paymentDateRange, total_paid, '12-12-2024'));
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Meal Plan created successfully for all employees',
                };
            }));
        });
    }
    //get all meal plans
    getAllMealPlans(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id } = req.admin;
            const model = this.Model.adminDiscussionModel();
            // Extract start_date and end_date from query parameters
            const { start_date, end_date } = req.query;
            // Fetch meal plan data and total count using the model
            const mealPlans = yield model.getMealPlans(organization_id, start_date ? start_date : undefined, end_date ? end_date : undefined);
            return {
                success: true,
                data: mealPlans.data,
                total: mealPlans.total,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
    ///get all employee wise transaction
    getEmployeeTransactions(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, organization_id } = req.admin;
            const model = this.Model.adminDiscussionModel();
            // Extract relevant parameters from the request body or query
            const { employee_id, start_date, end_date, limit, skip, name } = req.query; // Adjust this to req.query if needed
            const { data } = yield model.getEmployeeTransactions(organization_id, {
                employee_id: Number(employee_id),
                start_date: start_date,
                end_date: end_date,
                limit: limit,
                skip: skip,
                name: name,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                data: data,
            };
        });
    }
    //get all discussion and comments
    getSinglePolls(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.admin;
            const model = this.Model.adminDiscussionModel();
            const poll_id = req.params.id;
            // Fetch polls
            const { polls } = yield model.getSinglePoll(Number(poll_id));
            const checkAvailable = yield model.checkIfAlreadyVote(Number(poll_id), id);
            //checking options
            // Fetch options for each poll and add them to the poll object
            const pollsWithOptions = yield Promise.all(polls.map((poll) => __awaiter(this, void 0, void 0, function* () {
                const { data } = yield model.getOptionsPollWise(poll.id);
                const totalVotes = yield model.countVotes(poll.id);
                const optionsWithVotes = yield Promise.all(data.map((option) => __awaiter(this, void 0, void 0, function* () {
                    const [optionVotes] = yield Promise.all([
                        model.getSingleOptionInfo(poll.id, option.id),
                    ]);
                    const baseOption = {
                        option_text: option.option_text,
                        option_id: option.id,
                        vote_count: optionVotes.final_option,
                        percentage: optionVotes.percentage,
                    };
                    return Object.assign(Object.assign({}, baseOption), { voted: '' });
                })));
                return Object.assign(Object.assign({}, poll), { total_votes: totalVotes.total, options: optionsWithVotes });
            })));
            //get poll wise answers with employee
            const viewData = yield model.getAllEmployeeVote(Number(poll_id));
            // Return formatted response
            return {
                success: true,
                data: pollsWithOptions[0],
                employeeVote: viewData,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
    //get single Discussion
    getSingleDiscussion(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id, id } = req.admin;
            const { type } = req.admin;
            const discussion_id = req.params.id;
            const model = this.Model.adminDiscussionModel();
            // Fetch discussions
            const { discussion } = yield model.getSingleDiscussion(organization_id, parseInt(discussion_id));
            // Fetch and organize comments for each discussion
            for (let i = 0; i < discussion.length; i++) {
                const discussion_id = discussion[i].id;
                const { comment } = yield model.getComments(discussion_id); // Assuming getComments fetches comments for a discussion
                // // Organize comments into nested structure using recursive function
                // Organize comments into nested structure using recursive function
                discussion[i].comments = this.organizeComments(comment, id, type);
                // want to use reccursive here instead of for loop!
            }
            // Return formatted response
            return {
                success: true,
                data: discussion[0],
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
    //delete comment
    deleteComment(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { organization_id } = req.admin;
            const comment_id = parseInt(req.params.id);
            yield this.Model.adminDiscussionModel().deleteComment(comment_id);
            // Return formatted response
            return {
                success: true,
                code: this.StatusCode.HTTP_SUCCESSFUL,
                message: this.ResMsg.HTTP_OK,
            };
        });
    }
    organizeComments(comments, id, type) {
        const commentMap = new Map();
        // First pass: create a map of all comments and add delete_permission
        comments.forEach((comment) => {
            comment.replies = [];
            comment.delete_permission =
                comment.user_id === id && comment.comment_from_type === type;
            commentMap.set(comment.id, comment);
        });
        // Second pass: organize comments into a tree structure
        const rootComments = [];
        comments.forEach((comment) => {
            if (comment.parent_comment_id === null) {
                rootComments.push(comment);
            }
            else {
                const parentComment = commentMap.get(comment.parent_comment_id);
                if (parentComment) {
                    parentComment.replies.push(comment);
                }
            }
        });
        return rootComments;
    }
}
exports.default = AdminDiscussionService;
