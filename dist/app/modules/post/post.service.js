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
/* eslint-disable @typescript-eslint/ban-ts-comment */
const mongoose_1 = __importDefault(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const post_model_1 = __importDefault(require("./post.model"));
const createPost = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.create(payload);
    return result;
});
const votePost = (postId, userId, vote) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_model_1.default.findById(postId);
    if (!post) {
        throw new Error("Post not found");
    }
    const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
    if (vote === "upvote") {
        // @ts-ignore
        const isAlreadyUpvoted = post.upvotes.includes(userObjectId);
        if (isAlreadyUpvoted) {
            post.upvotes.pull(userObjectId);
        }
        else {
            post.upvotes.addToSet(userObjectId);
            post.downvotes.pull(userObjectId);
        }
    }
    else {
        // @ts-ignore
        const isAlreadyDownvoted = post.downvotes.includes(userObjectId);
        if (isAlreadyDownvoted) {
            post.downvotes.pull(userObjectId);
        }
        else {
            post.downvotes.addToSet(userObjectId);
            post.upvotes.pull(userObjectId);
        }
    }
    // Update the upvoteCount and downvoteCount after updating the arrays
    post.upvoteCount = post.upvotes.length;
    post.downvoteCount = post.downvotes.length;
    // Save the post after updating counts
    yield post.save();
    const result = yield post.save();
    return result;
});
const getAllPosts = (query, user) => __awaiter(void 0, void 0, void 0, function* () {
    let model = post_model_1.default.find().populate("user").populate("categories");
    if (query.categories) {
        const ids = query.categories
            .split(",")
            .map((id) => new mongoose_1.default.Types.ObjectId(id));
        model = model.find({ categories: { $in: ids } });
    }
    delete query.categories;
    if (query.premium && user && user.isPremium) {
        model.find({ premium: true });
    }
    else {
        model = model.find({ premium: false });
    }
    delete query.premium;
    const queryModel = new QueryBuilder_1.default(model, query)
        .fields()
        .paginate()
        .sort()
        .filter()
        .search(["title", "content"]);
    const totalDoc = yield queryModel.count();
    const result = yield queryModel.modelQuery;
    return { result, totalDoc: totalDoc.totalCount };
});
const getPostById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.findById(id)
        .populate("user")
        .populate("categories");
    return result;
});
const updatePost = (id, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield post_model_1.default.findById(id);
    if (!isExists) {
        throw new AppError_1.default(404, "Post not found");
    }
    if (isExists.user.toString() !== user.toString()) {
        throw new AppError_1.default(403, "Unauthorized access");
    }
    const updatePayload = {};
    ["content", "images", "categories"].forEach((key) => {
        // @ts-ignore
        if (payload[key]) {
            // @ts-ignore
            updatePayload[key] = payload[key];
        }
    });
    const result = yield post_model_1.default.findByIdAndUpdate(id, updatePayload, { new: true });
    return result;
});
const deletePost = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield post_model_1.default.findById(id);
    if (!isExists) {
        throw new AppError_1.default(404, "Post not found");
    }
    if (isExists.user.toString() !== user._id.toString() &&
        user.role !== "admin") {
        ``;
        throw new AppError_1.default(403, "Unauthorized access");
    }
    const result = yield post_model_1.default.findByIdAndDelete(isExists._id);
    return result;
});
const postService = {
    createPost,
    deletePost,
    getAllPosts,
    votePost,
    getPostById,
    updatePost,
};
exports.default = postService;
