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
exports.getUserBookings = exports.getAllBookings = exports.createBookingIntoDB = void 0;
const mongoose_1 = require("mongoose");
const catchAsyncError_1 = require("../../../utils/catchAsyncError");
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const payment_utils_1 = require("../payment/payment.utils");
const service_model_1 = __importDefault(require("../service/service.model"));
const slot_model_1 = __importDefault(require("../slot/slot.model"));
const booking_service_1 = require("./booking.service");
const { createBookingService, getAllBookingService, getUserBookingsService } = booking_service_1.bookingService;
exports.createBookingIntoDB = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const user = req.user;
    const isValidObjId = (0, mongoose_1.isValidObjectId)(body.service);
    if (!isValidObjId) {
        return (0, sendResponse_1.default)(res, {
            data: null,
            message: "invalid object id format",
            success: false,
            statusCode: 400,
        });
    }
    const isExistService = yield service_model_1.default.findById(body.service);
    if (!isExistService) {
        return (0, sendResponse_1.default)(res, {
            message: "Service not found",
            data: null,
            statusCode: 404,
            success: false,
        });
    }
    const slot = yield slot_model_1.default.findById(body.slot);
    if (!slot) {
        return (0, sendResponse_1.default)(res, {
            message: "slot not found",
            data: null,
            statusCode: 404,
            success: false,
        });
    }
    if (slot.isBooked !== "available") {
        (0, sendResponse_1.default)(res, {
            message: "this slot is not available for booking",
            data: null,
            statusCode: 404,
            success: false,
        });
    }
    const data = Object.assign({ customer: user._id, service: body.service, slot: body.slot }, body);
    yield createBookingService(data);
    const paymentPayload = {
        amount: isExistService.price,
        cus_add: user.address,
        cus_email: user.email,
        cus_name: user.firstName + user.lastName,
        cus_phone: user.phone,
        tran_id: `TXN-${Date.now()}`,
    };
    const paymentResponse = yield (0, payment_utils_1.initiatePayment)(paymentPayload, slot._id.toString());
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Booking successful",
        data: paymentResponse,
    });
}));
exports.getAllBookings = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { result, totalDoc } = yield getAllBookingService(req.query);
    if (result.length > 0) {
        return res.json({
            success: true,
            statusCode: 200,
            message: "All bookings retrieved successfully",
            data: result,
            totalDoc,
        });
    }
    (0, sendResponse_1.default)(res, {
        success: false,
        statusCode: 404,
        message: "No Data Found",
        data: [],
    });
}));
exports.getUserBookings = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield getUserBookingsService(user._id, req.query);
    if (result.length > 0) {
        return (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: 200,
            message: "User bookings retrieved successfully",
            data: result,
        });
    }
    (0, sendResponse_1.default)(res, {
        success: false,
        statusCode: 404,
        message: "No Data Found",
        data: [],
    });
}));
