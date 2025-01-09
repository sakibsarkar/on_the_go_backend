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
const group_model_1 = __importDefault(require("../group/group.model"));
const gorupMember_model_1 = __importDefault(require("../groupMember/gorupMember.model"));
const reaction_model_1 = __importDefault(require("../reaction/reaction.model"));
const post_model_1 = __importDefault(require("./post.model"));
const createPost = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.create(payload);
    return result;
});
const getAllPosts = (query, user) => __awaiter(void 0, void 0, void 0, function* () {
    let model = post_model_1.default.find()
        .populate("user")
        .populate("categories")
        .populate("group");
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
    if (query.group) {
        const groupIds = query.group
            .split(",")
            .map((id) => new mongoose_1.default.Types.ObjectId(id));
        for (const groupId of groupIds) {
            const group = yield group_model_1.default.findById(groupId).select("privacy");
            if (!group) {
                throw new AppError_1.default(404, "Group not found");
            }
            if (group.privacy == "private") {
                const isMember = yield gorupMember_model_1.default.findOne({
                    group: groupId,
                    user: user._id,
                });
                if (!isMember) {
                    throw new AppError_1.default(400, "You are not a member of this group");
                }
            }
        }
    }
    const queryModel = new QueryBuilder_1.default(model, query)
        .fields()
        .paginate()
        .sort()
        .filter()
        .search(["title", "content"]);
    const totalDoc = yield queryModel.count();
    const result = yield queryModel.modelQuery;
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const postObjs = result.map((result) => result.toObject());
    for (let i = 0; i < postObjs.length; i++) {
        const post = postObjs[i];
        const reacted = yield reaction_model_1.default.findOne({
            // @ts-ignore
            post: post._id,
            user: user === null || user === void 0 ? void 0 : user._id,
        });
        postObjs[i] = Object.assign(Object.assign({}, post), { reacted });
    }
    return { result: postObjs, totalDoc: totalDoc.totalCount };
});
const getPostById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.default.findById(id)
        .populate("user")
        .populate("categories");
    return result;
});
const updatePost = (id, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield post_model_1.default.findById(id).populate("group");
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
    getPostById,
    updatePost,
};
exports.default = postService;
