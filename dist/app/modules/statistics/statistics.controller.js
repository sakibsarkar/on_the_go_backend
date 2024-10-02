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
exports.getUserStatistics = exports.paymentStatisticsController = void 0;
const catchAsyncError_1 = require("../../../utils/catchAsyncError");
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const statistics_service_1 = __importDefault(require("./statistics.service"));
exports.paymentStatisticsController = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, to } = req.query;
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const payload = {
        from: fromDate,
        to: toDate,
    };
    const result = yield statistics_service_1.default.getPaymentStatistic(payload);
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        message: "successfully get payment statistics",
        statusCode: 200,
    });
}));
exports.getUserStatistics = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield statistics_service_1.default.getUserStatistics();
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        message: "successfully get user statistics",
        statusCode: 200,
    });
}));
