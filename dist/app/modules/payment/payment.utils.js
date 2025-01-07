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
exports.initiatePayment = void 0;
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const initiatePayment = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, cus_add, cus_name, cus_phone, cus_email, tran_id } = payload;
    const paymentTokenObj = {
        transactionId: tran_id,
        userId,
        amount: amount.toString(),
    };
    const PT = jsonwebtoken_1.default.sign(paymentTokenObj, process.env.SIGNATURE_KEY, {
        expiresIn: "1m",
    });
    const url = "https://onthego-backend.vercel.app/api/v1";
    // const url = "http://localhost:5000/api/v1";
    const response = yield axios_1.default.post(`${process.env.PAYMENT_URL}`, {
        store_id: process.env.STORE_ID,
        signature_key: process.env.SIGNATURE_KEY,
        cus_name,
        cus_email,
        cus_phone,
        cus_add1: cus_add,
        cus_add2: "N/A",
        cus_city: "N/A",
        cus_country: "Bangladesh",
        currency: "BDT",
        amount,
        tran_id,
        success_url: `${url}/payment/success?pt=${PT}`,
        fail_url: `${url}/payment/fail?pt=${PT}`,
        cancel_url: `${url}/payment/fail?pt=${PT}`,
        desc: "Course Fee",
        type: "json",
    });
    return response.data;
});
exports.initiatePayment = initiatePayment;
