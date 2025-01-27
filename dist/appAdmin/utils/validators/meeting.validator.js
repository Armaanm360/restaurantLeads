"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
class MeetingValidator {
    constructor() {
        this.timePattern = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
        this.createMeeting = joi_1.default.object({
            title: joi_1.default.string().min(3).max(50).required().messages({
                'string.base': 'Meeting title must be a string',
                'string.empty': 'Meeting title cannot be empty',
                'string.min': 'Meeting title must be at least {#limit} characters long',
                'string.max': 'Meeting title cannot exceed {#limit} characters',
                'any.required': 'Meeting title is required',
            }),
            description: joi_1.default.string().max(255).allow('').messages({
                'string.base': 'Meeting description must be a string',
                'string.empty': 'Meeting description cannot be empty',
                'string.max': 'Meeting description cannot exceed {#limit} characters',
            }),
            status: joi_1.default.string()
                .valid('upcoming', 'running', 'ended', 'cancelled')
                .messages({
                'any.only': 'Meeting status must be one of: upcoming, running, ended, cancelled',
                'any.required': 'Meeting status is required',
            }),
            place: joi_1.default.number().optional(),
            lead_id: joi_1.default.number().optional(),
            estimated_amount: joi_1.default.any().optional(),
            meeting_date: joi_1.default.date()
                .iso()
                // .min(new Date()) // Ensure start_time is not in the past
                .required(),
            start_time: joi_1.default.string().pattern(this.timePattern).required().messages({
                'string.pattern.base': 'Start time must be in HH:mm:ss format',
                'string.empty': 'Start time cannot be empty',
                'any.required': 'Start time is required',
            }),
            end_time: joi_1.default.string()
                .pattern(this.timePattern)
                .required()
                .custom((value, helpers) => {
                const { start_time } = helpers.state.ancestors[0];
                if (start_time && value <= start_time) {
                    return helpers.error('any.invalid', {
                        message: 'End time must be after the start time',
                    });
                }
                return value;
            })
                .messages({
                'string.pattern.base': 'End time must be in HH:mm:ss format',
                'string.empty': 'End time cannot be empty',
                'any.required': 'End time is required',
            }),
            meeting_type: joi_1.default.string().valid('online', 'offline').required().messages({
                'any.only': 'Meeting type must be either "online" or "offline"',
                'any.required': 'Meeting type is required',
            }),
            meeting_link: joi_1.default.string()
                .uri({ scheme: ['http', 'https'] }) // Validates that the string is a valid URI with HTTP or HTTPS schemes
                .optional()
                .messages({
                'string.uri': 'Meeting link must be a valid URL with HTTP or HTTPS scheme',
                'any.required': 'Meeting link is required',
            }),
            cancelled_reason: joi_1.default.string()
                .max(255) // Maximum length of the reason
                .allow('') // Allowing an empty string if no reason provided
                .messages({
                'string.base': 'Cancelled reason must be a string',
                'string.empty': 'Cancelled reason cannot be empty',
                'string.max': 'Cancelled reason cannot exceed {#limit} characters',
            }),
        });
        this.createPlace = joi_1.default.object({
            place_name: joi_1.default.string().max(255).required(),
            place_type: joi_1.default.string().optional(),
            description: joi_1.default.string().optional(),
            address: joi_1.default.string().optional(),
        });
        this.updatePlace = joi_1.default.object({
            place_name: joi_1.default.string().max(255).optional(),
            place_type: joi_1.default.string().optional(),
            description: joi_1.default.string().optional(),
            address: joi_1.default.string().optional(),
        });
        this.updateMeeting = joi_1.default.object({
            title: joi_1.default.string().min(3).max(50).optional().messages({
                'string.base': 'Meeting title must be a string',
                'string.empty': 'Meeting title cannot be empty',
                'string.min': 'Meeting title must be at least {#limit} characters long',
                'string.max': 'Meeting title cannot exceed {#limit} characters',
                'any.required': 'Meeting title is required',
            }),
            description: joi_1.default.string().max(255).allow('').messages({
                'string.base': 'Meeting description must be a string',
                'string.empty': 'Meeting description cannot be empty',
                'string.max': 'Meeting description cannot exceed {#limit} characters',
            }),
            status: joi_1.default.string()
                .valid('upcoming', 'running', 'ended', 'canceled')
                .messages({
                'any.only': 'Meeting status must be one of: upcoming, running, ended, canceled',
                'any.required': 'Meeting status is required',
            }),
            place: joi_1.default.number().optional(),
            lead_id: joi_1.default.number().optional(),
            estimated_amount: joi_1.default.any().optional(),
            meeting_end_note: joi_1.default.string().optional(),
            meeting_date: joi_1.default.date()
                .iso()
                // .min(new Date()) // Ensure start_time is not in the past
                .optional(),
            start_time: joi_1.default.string().pattern(this.timePattern).optional().messages({
                'string.pattern.base': 'Start time must be in HH:mm:ss format',
                'string.empty': 'Start time cannot be empty',
                'any.required': 'Start time is required',
            }),
            end_time: joi_1.default.string()
                .pattern(this.timePattern)
                .optional()
                .custom((value, helpers) => {
                const { start_time } = helpers.state.ancestors[0];
                if (start_time && value <= start_time) {
                    return helpers.error('any.invalid', {
                        message: 'End time must be after the start time',
                    });
                }
                return value;
            }),
            meeting_type: joi_1.default.string().valid('online', 'offline').optional().messages({
                'any.only': 'Meeting type must be either "online" or "offline"',
                'any.required': 'Meeting type is required',
            }),
            meeting_link: joi_1.default.string()
                .uri({ scheme: ['http', 'https'] }) // Validates that the string is a valid URI with HTTP or HTTPS schemes
                .optional()
                .messages({
                'string.uri': 'Meeting link must be a valid URL with HTTP or HTTPS scheme',
                'any.required': 'Meeting link is required',
            }),
            cancelled_reason: joi_1.default.string()
                .max(255) // Maximum length of the reason
                .allow('') // Allowing an empty string if no reason provided
                .messages({
                'string.base': 'Cancelled reason must be a string',
                'string.empty': 'Cancelled reason cannot be empty',
                'string.max': 'Cancelled reason cannot exceed {#limit} characters',
            }),
        });
    }
}
exports.default = MeetingValidator;
