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
const catchAsyncError_1 = require("../../../utils/catchAsyncError");
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const gorupMember_service_1 = __importDefault(require("./gorupMember.service"));
const joinGroup = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield gorupMember_service_1.default.joinGroup(req.user._id, req.params.groupId);
    (0, sendResponse_1.default)(res, {
        message: "group joined successfully",
        success: true,
        data: result,
        statusCode: 200,
    });
}));
const leaveGroup = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield gorupMember_service_1.default.leaveGroup(req.user._id, req.params.groupId);
    (0, sendResponse_1.default)(res, {
        message: "group left successfully",
        success: true,
        data: result,
        statusCode: 200,
    });
}));
const getGroupMembers = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { result, totalDoc } = yield gorupMember_service_1.default.getGroupMembers(req.params.groupId, req.user._id, req.query);
    (0, sendResponse_1.default)(res, {
        message: "group members retrieved successfully",
        success: true,
        data: result,
        statusCode: 200,
        totalDoc,
    });
}));
const groupMemberController = {
    joinGroup,
    leaveGroup,
    getGroupMembers,
};
exports.default = groupMemberController;
