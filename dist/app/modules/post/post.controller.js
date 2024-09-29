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
exports.postController = exports.uploadPostImage = void 0;
const catchAsyncError_1 = require("../../../utils/catchAsyncError");
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const uploadFile_1 = require("../../../utils/uploadFile");
const post_service_1 = __importDefault(require("./post.service"));
exports.uploadPostImage = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!file) {
        return (0, sendResponse_1.default)(res, {
            message: "file not found",
            success: false,
            data: null,
            statusCode: 404,
        });
    }
    const uploadRes = yield (0, uploadFile_1.sendImageToCloudinary)(file.filename, file.path);
    const url = uploadRes.secure_url;
    if (!url) {
        return (0, sendResponse_1.default)(res, {
            message: "failed to upload image",
            success: false,
            data: null,
            statusCode: 400,
        });
    }
    (0, sendResponse_1.default)(res, {
        message: "image uploaded successfully",
        success: true,
        data: url,
        statusCode: 200,
    });
}));
const createPost = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, categories, isPremium, images } = req.body;
    const user = req.user._id;
    const payload = {
        title,
        content,
        images,
        categories,
        isPremium: isPremium || false,
        user: user,
    };
    const result = yield post_service_1.default.createPost(payload);
    (0, sendResponse_1.default)(res, {
        message: "post created successfully",
        success: true,
        data: result,
        statusCode: 200,
    });
}));
const getAllPosts = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const { result, totalDoc } = yield post_service_1.default.getAllPosts(query);
    (0, sendResponse_1.default)(res, {
        success: false,
        statusCode: 200,
        message: "No Data Found",
        data: result,
        totalDoc,
    });
}));
const votePost = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const { vote } = req.query;
    const userId = req.user._id;
    const voteType = ["upvote", "downvote"];
    if (!postId || !vote || !voteType.includes(vote)) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            statusCode: 400,
            message: "Invalid request",
            data: null,
        });
    }
    const result = yield post_service_1.default.votePost(postId, userId, vote);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "post voted successfully",
        data: result,
    });
}));
exports.postController = {
    createPost,
    uploadPostImage: exports.uploadPostImage,
    getAllPosts,
    votePost,
};
