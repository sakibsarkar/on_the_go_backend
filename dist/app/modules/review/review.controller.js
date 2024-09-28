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
exports.getReviews = exports.createReview = void 0;
const catchAsyncError_1 = require("../../../utils/catchAsyncError");
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const review_service_1 = __importDefault(require("./review.service"));
exports.createReview = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const auth = req.user;
    const result = yield review_service_1.default.createReviewService(Object.assign(Object.assign({}, body), { user: auth._id }));
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        message: "review created successfully",
    });
}));
exports.getReviews = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = req.query.limit || 2;
    const { result, totalDoc } = yield review_service_1.default.getReviewService(Number(limit));
    res.json({
        data: result,
        totalDoc,
        success: true,
        message: "successfully get reviews",
    });
}));
