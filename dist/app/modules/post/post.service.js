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
    const result = yield post.save();
    return result;
});
const getAllPosts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const model = post_model_1.default.find().populate("user").populate("categories");
    const queryModel = new QueryBuilder_1.default(model, query)
        .fields()
        .paginate()
        .sort()
        .filter()
        .search(["title"]);
    const totalDoc = (yield queryModel.count()).totalCount;
    const result = yield queryModel.modelQuery;
    return { result, totalDoc };
});
const postService = {
    createPost,
    getAllPosts,
    votePost,
};
exports.default = postService;
