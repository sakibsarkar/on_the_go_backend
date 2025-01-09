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
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const group_model_1 = __importDefault(require("../group/group.model"));
const gorupMember_model_1 = __importDefault(require("./gorupMember.model"));
const joinGroup = (userId, groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const isAlreadyMember = yield gorupMember_model_1.default.findOne({
        user: userId,
        group: groupId,
    });
    if (isAlreadyMember) {
        throw new AppError_1.default(400, "You are already a member of this group");
    }
    const result = yield gorupMember_model_1.default.create({
        user: userId,
        group: groupId,
        role: "member",
    });
    return result;
});
const leaveGroup = (userId, groupId) => __awaiter(void 0, void 0, void 0, function* () {
    const isMember = yield gorupMember_model_1.default.findOne({
        user: userId,
        group: groupId,
    });
    if (!isMember) {
        throw new AppError_1.default(400, "You are not a member of this group");
    }
    const result = yield gorupMember_model_1.default.findByIdAndDelete(isMember._id);
    return result;
});
const getGroupMembers = (groupId, userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const isGroupExist = yield group_model_1.default.findById(groupId);
    if (!isGroupExist) {
        throw new AppError_1.default(404, "Group not found");
    }
    if (isGroupExist.privacy == "private") {
        const isMember = yield gorupMember_model_1.default.findOne({
            user: userId,
            group: groupId,
        });
        if (!isMember) {
            throw new AppError_1.default(400, "You are not a member of this group");
        }
    }
    const model = gorupMember_model_1.default.find({ group: groupId });
    const queryBuilder = new QueryBuilder_1.default(model, query)
        .paginate()
        .sort()
        .filter();
    const totalDoc = yield queryBuilder.count();
    const result = yield queryBuilder.modelQuery;
    return { result, totalDoc: totalDoc.totalCount };
});
const groupMemberService = {
    joinGroup,
    leaveGroup,
    getGroupMembers,
};
exports.default = groupMemberService;
