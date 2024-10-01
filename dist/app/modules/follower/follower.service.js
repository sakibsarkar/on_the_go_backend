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
exports.followerService = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = __importDefault(require("../user/user.model"));
const follower_model_1 = __importDefault(require("./follower.model"));
const createFollower = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // whom to follow
    const isUserExist = yield user_model_1.default.findOne({ _id: payload.user });
    if (!isUserExist) {
        throw new AppError_1.default(404, "User not found");
    }
    // who follows
    const isFollowerExist = yield user_model_1.default.findOne({ _id: payload.follower });
    if (!isFollowerExist) {
        throw new AppError_1.default(404, "Follower not found");
    }
    const isFollowing = yield follower_model_1.default.findOne({
        user: isUserExist._id,
        follower: isFollowerExist._id,
    });
    if (isFollowing) {
        const result = yield follower_model_1.default.deleteOne({
            user: isUserExist._id,
            follower: isFollowerExist._id,
        });
        return result;
    }
    const result = yield follower_model_1.default.create(payload);
    return result;
});
const deleteFollower = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.default.findOne({ _id: payload.user });
    if (!isUserExist) {
        throw new AppError_1.default(404, "User not found");
    }
    const isFollowerExist = yield user_model_1.default.findOne({ _id: payload.follower });
    if (!isFollowerExist) {
        throw new AppError_1.default(404, "Follower not found");
    }
    const isFollowing = yield follower_model_1.default.findOne({
        user: isUserExist._id,
        follower: isFollowerExist._id,
    });
    if (!isFollowing) {
        throw new AppError_1.default(404, "Following not found");
    }
    const result = yield follower_model_1.default.deleteOne({
        user: isUserExist._id,
        follower: isFollowerExist._id,
    });
    return result;
});
const getFollwers = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield follower_model_1.default.find({ user: user })
        .populate("follower")
        .populate("user")
        .sort("-createdAt");
    return result;
});
const getFollowingList = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield follower_model_1.default.find({ follower: user })
        .populate("user")
        .populate("follower")
        .sort("-createdAt");
    return result;
});
exports.followerService = {
    createFollower,
    deleteFollower,
    getFollwers,
    getFollowingList,
};
