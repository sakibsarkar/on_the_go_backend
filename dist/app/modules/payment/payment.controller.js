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
exports.failedPaymentController = exports.successPaymentController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsyncError_1 = require("../../../utils/catchAsyncError");
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const payment_service_1 = require("./payment.service");
exports.successPaymentController = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentInfoToken = req.query.pt;
    let decode;
    try {
        decode = jsonwebtoken_1.default.verify(paymentInfoToken, process.env.SIGNATURE_KEY);
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            data: null,
            success: false,
            message: "invalid payment info",
            statusCode: 400,
        });
    }
    const { amount, transactionId, userId } = decode;
    const result = yield payment_service_1.paymentService.createPayment(Number(amount), transactionId, userId);
    res.send(result);
}));
exports.failedPaymentController = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentInfoToken = req.query.pt;
    try {
        jsonwebtoken_1.default.verify(paymentInfoToken, process.env.SIGNATURE_KEY);
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            data: null,
            success: false,
            message: "invalid payment info",
            statusCode: 400,
        });
    }
    const result = yield payment_service_1.paymentService.failedPayment();
    res.send(result);
}));
