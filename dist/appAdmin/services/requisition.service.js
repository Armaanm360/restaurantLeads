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
class AdminRequisitionService extends abstract_service_1.default {
    constructor() {
        super();
    }
    //create a new item for requisition
    createRequisition(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.requisitionModel();
                const { organization_id, id } = req.admin;
                req.body['user_id'] = Number(req.body['user_id']);
                req.body['organization_id'] = organization_id;
                req.body['status'] = 'PENDING';
                const requisition = yield model.createRequisition(req.body);
                const requisitionTrack = yield model.getSingleRequisition(requisition[0].id);
                //requisition track
                yield model.insertRequisitionTrack({
                    requisition_id: requisition[0].id,
                    status: 'PENDING',
                    track_description: `A requisition has been submitted by ${requisitionTrack.user_name} for ${requisitionTrack.item_name} on ${new Date(requisitionTrack.created_at).toLocaleString('en-US', {
                        timeZone: 'Asia/Dhaka',
                        dateStyle: 'long',
                        timeStyle: 'short',
                    })} (BST), citing the reason: "${requisitionTrack.require_reason}".`,
                });
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Requisition Submitted Successfully',
                };
            }));
        });
    }
    //create a new item for requisition
    updateRequisition(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const status = req.body.status;
                const model = this.Model.requisitionModel();
                const notifyService = new notification_service_1.default();
                const requisition_id = Number(req.params.id);
                const { organization_id, id } = req.admin;
                if (status === 'APPROVED') {
                    // const checkApprover = await model.checkApprover(
                    //   organization_id,
                    //   id,
                    //   'requisition_approvers'
                    // );
                    req.body['status'] = 'APPROVED';
                    req.body['approved_by'] = id;
                    req.body['approved_at'] = new Date();
                    const requisitionTrack = yield model.getSingleRequisition(requisition_id);
                    const checkStock = yield model.checkItemStock(organization_id, requisitionTrack.item_id);
                    // Ensure that there is enough stock
                    if (Number(checkStock.current_stock) < requisitionTrack.quantity) {
                        req.body['status'] = 'REJECTED';
                        req.body['rejected_by'] = id;
                        yield model.updateRequisition(requisition_id, req.body);
                        const notificationPayload = {
                            user_id: requisitionTrack.user_id,
                            type: 'requisition',
                            ref_id: requisition_id,
                            message: `Your Requisition Has Been ${req.body.status}`,
                            organization_id: organization_id,
                        };
                        yield notifyService.adminToSingleEmployee(notificationPayload);
                        //requisition track
                        yield model.insertRequisitionTrack({
                            requisition_id: requisition_id,
                            status: 'REJECTED',
                            track_description: `${requisitionTrack.rejected_by_name} rejected the requisition citing the reason: "Not enough stock for  ${checkStock.item_name}".`,
                        });
                        return {
                            success: true,
                            code: this.StatusCode.HTTP_SUCCESSFUL,
                            message: `Not enough stock for  ${checkStock.item_name}`,
                        };
                        // throw new Error(`Not enough stock for  ${checkStock.item_name}`);
                    }
                    yield model.updateRequisition(requisition_id, req.body);
                    //requisition track
                    yield model.insertRequisitionTrack({
                        requisition_id: requisition_id,
                        status: 'APPROVED',
                        track_description: `${requisitionTrack.approved_by_name} has  approved the requisition on ${new Date(requisitionTrack.approved_at).toLocaleString('en-US', {
                            timeZone: 'Asia/Dhaka',
                            dateStyle: 'long',
                            timeStyle: 'short',
                        })}`,
                    });
                    //==============================================
                    //                Notification Section
                    //==============================================
                    const notificationPayload = {
                        user_id: requisitionTrack.user_id,
                        type: 'requisition',
                        ref_id: requisition_id,
                        message: `Your Requisition Has Been ${req.body.status}`,
                        organization_id: organization_id,
                    };
                    yield notifyService.adminToSingleEmployee(notificationPayload);
                    //==============================================
                    //            End of Notification Section
                    //==============================================
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: 'Requisition Approved',
                    };
                }
                if (status === 'FULFILLED') {
                    // const checkApprover = await model.checkApprover(
                    //   organization_id,
                    //   id,
                    //   'requisition_fullfilers'
                    // );
                    req.body['status'] = 'FULFILLED';
                    req.body['fulfilled_by'] = id;
                    req.body['fulfilled_at'] = new Date();
                    yield model.updateRequisition(requisition_id, req.body);
                    //requisition track
                    const requisitionTrack = yield model.getSingleRequisition(requisition_id);
                    const checkStock = yield model.checkItemStock(organization_id, requisitionTrack.item_id);
                    // Ensure that there is enough stock
                    if (Number(checkStock.current_stock) < requisitionTrack.quantity) {
                        throw new Error(`Not enough stock for  ${checkStock.item_name}`);
                    }
                    //requisition track
                    yield model.insertRequisitionTrack({
                        requisition_id: requisition_id,
                        status: 'FULFILLED',
                        track_description: `${requisitionTrack.approved_by_name} delivered ${requisitionTrack.quantity} units of ${requisitionTrack.item_name} to ${requisitionTrack.user_name} on ${new Date(requisitionTrack.fulfilled_at).toLocaleString('en-US', {
                            timeZone: 'Asia/Dhaka',
                            dateStyle: 'long',
                            timeStyle: 'short',
                        })}.`,
                    });
                    //lets fix it from the store
                    //update my store
                    const requesData = yield model.getSingleRequisition(requisition_id);
                    const newItem = {
                        organization_id,
                        created_by: id,
                        transaction_type: 'OUT',
                        item_id: Number(requesData.item_id),
                        transaction_date: new Date().toDateString(),
                        quantity: requesData.quantity,
                        remarks: requesData.remarks,
                    };
                    yield model.createInventoryTransaction(newItem);
                    //==============================================
                    //                Notification Section
                    //==============================================
                    const notificationPayload = {
                        user_id: requisitionTrack.user_id,
                        type: 'requisition',
                        ref_id: requisition_id,
                        message: `Your Requisition Has Been ${req.body.status}`,
                        organization_id: organization_id,
                    };
                    yield notifyService.adminToSingleEmployee(notificationPayload);
                    //==============================================
                    //            End of Notification Section
                    //==============================================
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: 'Requisition Has Been Delivered',
                    };
                }
                if (status === 'REJECTED') {
                    req.body['status'] = 'REJECTED';
                    req.body['rejection_reason'] = id;
                    yield model.updateRequisition(requisition_id, req.body);
                    //requisition track
                    const requisitionTrack = yield model.getSingleRequisition(requisition_id);
                    //requisition track
                    yield model.insertRequisitionTrack({
                        requisition_id: requisition_id,
                        status: 'REJECTED',
                        track_description: `${requisitionTrack.rejected_by_name} rejected the requisition citing the reason: "${requisitionTrack.rejection_reason}".`,
                    });
                    //==============================================
                    //                Notification Section
                    //==============================================
                    const notificationPayload = {
                        user_id: requisitionTrack.user_id,
                        type: 'requisition',
                        ref_id: requisition_id,
                        message: `Your Requisition Has Been ${req.body.status}`,
                        organization_id: organization_id,
                    };
                    yield notifyService.adminToSingleEmployee(notificationPayload);
                    //==============================================
                    //            End of Notification Section
                    //==============================================
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: 'Requisition Has Been Rejected',
                    };
                }
                if (status === 'PENDING') {
                    req.body['status'] = 'PENDING';
                    yield model.updateRequisition(requisition_id, req.body);
                    const requisitionTrack = yield model.getSingleRequisition(requisition_id);
                    //requisition track
                    yield model.insertRequisitionTrack({
                        requisition_id: requisition_id,
                        status: 'UPDATE',
                        track_description: `${requisitionTrack.user_name} has updated the requisition`,
                    });
                    return {
                        success: true,
                        code: this.StatusCode.HTTP_SUCCESSFUL,
                        message: 'Requisition Has Been Updated',
                    };
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Requisition Submitted Successfully',
                };
            }));
        });
    }
    //create a new item for requisition
    createItem(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.requisitionModel();
                const { organization_id, id } = req.admin;
                req.body['organization_id'] = organization_id;
                req.body['recorded_by'] = id;
                const check = yield model.checkItems(organization_id, req.body.name);
                // if (check.length) {
                //   return {
                //     success: true,
                //     code: this.StatusCode.HTTP_BAD_REQUEST,
                //     message: 'Items Already Exists',
                //   };
                // }
                yield model.createItems(req.body);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Items Created Successfully',
                };
            }));
        });
    }
    //update an item for requisition
    updateItem(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const itemId = Number(req.params.id);
                const model = this.Model.requisitionModel();
                const { organization_id, id } = req.admin;
                req.body['organization_id'] = organization_id;
                req.body['recorded_by'] = id;
                // const check = await model.checkItems(organization_id, req.body.name);
                // if (check.length) {
                //   return {
                //     success: true,
                //     code: this.StatusCode.HTTP_BAD_REQUEST,
                //     message: 'Items Already Exists',
                //   };
                // }
                yield model.updateItems(itemId, req.body);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Items Updated Successfully',
                };
            }));
        });
    }
    //update an item for requisition
    deleteItem(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const itemId = Number(req.params.id);
                const model = this.Model.requisitionModel();
                const { organization_id, id } = req.admin;
                req.body['organization_id'] = organization_id;
                req.body['recorded_by'] = id;
                req.body['is_deleted'] = true;
                // const check = await model.checkItems(organization_id, req.body.name);
                // if (check.length) {
                //   return {
                //     success: true,
                //     code: this.StatusCode.HTTP_BAD_REQUEST,
                //     message: 'Items Already Exists',
                //   };
                // }
                yield model.updateItems(itemId, req.body);
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Items Deleted Successfully',
                };
            }));
        });
    }
    //insert new stock  for requisition
    createNewStock(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.requisitionModel();
                const { organization_id, id } = req.admin;
                // Assuming req.body is now an array of items
                for (const item of req.body) {
                    const newItem = Object.assign({ organization_id, created_by: id, transaction_type: 'IN' }, item);
                    yield model.createInventoryTransaction(newItem);
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Stock In Items Successfully',
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
                //==============================================
                //                Notification Section
                //==============================================
                const notify = yield this.Model.commonModel().createNotification({
                    type: 'polls',
                    ref_id: poll[0].id,
                    message: `A New Poll Has Been Created  ${poll[0].title}`,
                });
                const allUsers = yield this.Model.employeeModel().getAllEmployeeSocket(organization_id); // Fetch all connected users
                if (!allUsers || allUsers.length === 0) {
                    console.error('No connected users found.');
                }
                else {
                    console.log('All connected users:', allUsers);
                    allUsers.forEach((user) => {
                        if (user && user.socket_id) {
                            socket_1.io.to(user.socket_id).emit('notification', {
                                message: notify[0].message,
                                type: 'polls',
                                ref_id: poll[0].id,
                            });
                            console.log('Notification emitted to socket ID:', user.socket_id);
                        }
                        else {
                            console.error('Socket ID not found for user:', user.id);
                        }
                    });
                }
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
    //get all requisition items
    getAllItems(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, organization_id } = req.admin;
            const { limit, skip, name, category } = req.query;
            const { total, data } = yield this.Model.requisitionModel().getAllItems(organization_id, {
                name: name,
                limit: limit,
                skip: skip,
                category: category,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                total,
                data,
            };
        });
    }
    //get all transactions
    getAllTransactions(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, organization_id } = req.admin;
            const { limit, skip, name, category, from_date, to_date } = req.query;
            const { total, data } = yield this.Model.requisitionModel().getAllTransaction(organization_id, {
                name: name,
                category: category,
                from_date: from_date,
                to_date: to_date,
                limit: limit,
                skip: skip,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                total,
                data,
            };
        });
    }
    //get all Requisitions
    getAllRequisitions(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, organization_id } = req.admin;
            const { limit, skip, name, employee_name, status, item_id, category, from_date, to_date, } = req.query;
            const { total, data } = yield this.Model.requisitionModel().getAllRequisitions(organization_id, {
                name: name,
                employee_name: employee_name,
                status: status,
                category: category,
                from_date: from_date,
                to_date: to_date,
                limit: limit,
                skip: skip,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                total,
                data,
            };
        });
    }
    //get current stock
    getCurrentStock(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, organization_id } = req.admin;
            const { limit, skip, name, category } = req.query;
            const { total, data } = yield this.Model.requisitionModel().getCurrentStock(organization_id, {
                name: name,
                category: category,
                limit: limit,
                skip: skip,
            });
            return {
                success: true,
                code: this.StatusCode.HTTP_OK,
                message: this.ResMsg.HTTP_OK,
                total,
                data,
            };
        });
    }
    //get current stock
    adjustStock(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const model = this.Model.requisitionModel();
                const { organization_id, id } = req.admin;
                // Assuming req.body is now an array of items
                for (const item of req.body) {
                    const newItem = Object.assign({ organization_id, created_by: id, transaction_type: 'OUT', remarks: 'Stock Adjusted' }, item);
                    // Check stock only for 'OUT' transaction types
                    if (newItem.transaction_type === 'OUT') {
                        const checkStock = yield model.checkItemStock(organization_id, item.item_id);
                        // Ensure that there is enough stock
                        if (Number(checkStock.current_stock) < item.quantity) {
                            throw new Error(`Not enough stock for  ${checkStock.item_name}`);
                        }
                    }
                    // Proceed to create the inventory transaction
                    yield model.createInventoryTransaction(newItem);
                }
                return {
                    success: true,
                    code: this.StatusCode.HTTP_SUCCESSFUL,
                    message: 'Stock In Items Successfully',
                };
            }));
        });
    }
    //get all discussion and comments
    getSingleRequisitionTrack(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model.requisitionModel();
            const requisition_id = Number(req.params.id);
            const data = yield model.getSingleRequisitionTrack(requisition_id);
            // Return formatted response
            return {
                success: true,
                data: data,
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
    /* private organizeComments(comments: any[],id:Number): any[] {
      const commentMap = new Map();
  
      // First pass: create a map of all comments
      comments.forEach((comment) => {
        comment.replies = [];
        commentMap.set(comment.id, comment);
      });
  
      // Second pass: organize comments into a tree structure
      const rootComments: any[] = [];
      comments.forEach((comment) => {
        if (comment.parent_comment_id === null) {
          rootComments.push(comment);
        } else {
          const parentComment = commentMap.get(comment.parent_comment_id);
          if (parentComment) {
            parentComment.replies.push(comment);
          }
        }
      });
  
      return rootComments;
    } */
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
exports.default = AdminRequisitionService;
