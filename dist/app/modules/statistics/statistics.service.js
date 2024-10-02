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
const payment_model_1 = __importDefault(require("../payment/payment.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const getPaymentStatistic = (_a) => __awaiter(void 0, [_a], void 0, function* ({ from, to }) {
    const result = yield payment_model_1.default.find({
        createdAt: {
            $gte: from,
            $lte: to,
        },
    });
    return result;
});
const getUserStatistics = () => __awaiter(void 0, void 0, void 0, function* () {
    const premiumUserCount = yield user_model_1.default.countDocuments({
        isPremium: true,
        role: { $ne: "admin" },
    });
    const normalUserCount = yield user_model_1.default.countDocuments({
        isPremium: false,
        role: { $ne: "admin" },
    });
    return { premiumUserCount, normalUserCount };
});
const statisticsService = {
    getPaymentStatistic,
    getUserStatistics,
};
exports.default = statisticsService;
