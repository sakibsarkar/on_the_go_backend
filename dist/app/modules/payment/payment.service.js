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
exports.paymentService = exports.failedPayment = exports.createPayment = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const user_model_1 = __importDefault(require("../user/user.model"));
const payment_model_1 = __importDefault(require("./payment.model"));
const createPayment = (amount, transactionId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield payment_model_1.default.create({
        amount: amount,
        transactionId,
        status: "Paid",
    });
    yield user_model_1.default.findByIdAndUpdate(userId, {
        isPremium: true,
    });
    const filePath = (0, path_1.join)(__dirname, "../../templates/success.html");
    let file = (0, fs_1.readFileSync)(filePath, "utf-8");
    file = file.replace("{{link}}", "https://onthego-frontend.vercel.app/");
    return file;
});
exports.createPayment = createPayment;
const failedPayment = () => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = (0, path_1.join)(__dirname, "../../templates/error.html");
    let file = (0, fs_1.readFileSync)(filePath, "utf-8");
    file = file.replace("{{link}}", "https://onthego-frontend.vercel.app/");
    return file;
});
exports.failedPayment = failedPayment;
exports.paymentService = {
    createPayment: exports.createPayment,
    failedPayment: exports.failedPayment,
};
