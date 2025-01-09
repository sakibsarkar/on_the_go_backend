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
exports.groupService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const gorupMember_model_1 = __importDefault(require("../groupMember/gorupMember.model"));
const group_model_1 = __importDefault(require("./group.model"));
const createGroup = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const groupPayload = Object.assign(Object.assign({}, payload), { owner: userId, memberCount: 1 });
        // Create the group document
        const result = yield group_model_1.default.create([groupPayload], { session });
        if (!result[0]) {
            throw new AppError_1.default(400, "Failed to create group");
        }
        yield gorupMember_model_1.default.create([
            {
                group: result[0]._id,
                user: userId,
                role: "owner",
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return result[0];
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(400, "Failed to create group");
    }
});
const getGroupDetailsById = (groupId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield group_model_1.default.findById(groupId).populate("owner");
    const member = yield gorupMember_model_1.default.findOne({
        group: groupId,
        user: userId,
    }).populate("user");
    return {
        group: result,
        member,
    };
});
const getGroupSuggestions = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const pipeLine = [
        {
            $lookup: {
                from: "groupmembers",
                localField: "_id",
                foreignField: "group",
                as: "groupMembers",
            },
        },
        {
            $match: {
                $expr: {
                    $not: {
                        $in: [new mongoose_1.default.Types.ObjectId(userId), "$groupMembers.user"],
                    },
                },
            },
        },
    ];
    const result = yield group_model_1.default.aggregate([
        ...pipeLine,
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
        {
            $project: {
                name: 1,
                description: 1,
                image: 1,
                privacy: 1,
                memberCount: 1,
                // groupMembers: 0,
            },
        },
    ]);
    const totalCountResult = yield group_model_1.default.aggregate([
        ...pipeLine,
        {
            $count: "totalCount",
        },
    ]);
    const totalCount = totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;
    return { result, totalCount };
});
const getUsersGroups = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const pipeLine = [
        {
            $match: {
                user: userId,
            },
        },
        {
            $lookup: {
                from: "groups",
                localField: "group",
                foreignField: "_id",
                as: "group",
            },
        },
    ];
    const result = yield gorupMember_model_1.default.aggregate([
        ...pipeLine,
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $project: {
                group: 1,
            },
        },
    ]);
    const modifiedResult = result === null || result === void 0 ? void 0 : result.map((item) => item.group[0]);
    const totalCountResult = yield group_model_1.default.aggregate([
        ...pipeLine,
        {
            $count: "totalCount",
        },
    ]);
    const totalCount = totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;
    return { result: modifiedResult, totalCount };
});
exports.groupService = {
    createGroup,
    getGroupSuggestions,
    getUsersGroups,
    getGroupDetailsById,
};
