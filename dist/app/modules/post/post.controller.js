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
    const url = file.path;
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
    const { content, categories, images, premium } = req.body;
    const user = req.user._id;
    if (premium && !req.user.isPremium) {
        (0, sendResponse_1.default)(res, {
            success: false,
            data: null,
            message: "you need to subscribe to premium",
            statusCode: 400,
        });
        return;
    }
    const payload = {
        content,
        images,
        categories,
        premium: Boolean(premium),
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
const deletePost = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const user = req.user;
    const result = yield post_service_1.default.deletePost(postId, user);
    (0, sendResponse_1.default)(res, {
        message: "post deleted successfully",
        success: true,
        data: result,
        statusCode: 200,
    });
}));
const getAllPosts = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const user = req.user;
    const { result, totalDoc } = yield post_service_1.default.getAllPosts(query, user);
    (0, sendResponse_1.default)(res, {
        success: false,
        statusCode: 200,
        message: "No Data Found",
        data: result,
        totalDoc,
    });
}));
const getPostById = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield post_service_1.default.getPostById(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Data retrieved successfully",
        data: result,
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
    deletePost,
    getAllPosts,
    votePost,
    getPostById,
};
