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
const group_service_1 = require("./group.service");
const createGroup = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield group_service_1.groupService.createGroup(req.body, req.user._id);
    (0, sendResponse_1.default)(res, {
        message: "group created successfully",
        success: true,
        data: result,
        statusCode: 200,
    });
}));
const getGroupSuggestions = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { result, totalCount } = yield group_service_1.groupService.getGroupSuggestions(req.user._id, req.query);
    (0, sendResponse_1.default)(res, {
        message: "group suggestions retrieved successfully",
        success: true,
        data: result,
        statusCode: 200,
        totalDoc: totalCount,
    });
}));
const getGroupDetailsById = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { group, member } = yield group_service_1.groupService.getGroupDetailsById(req.params.groupId, req.user._id);
    (0, sendResponse_1.default)(res, {
        message: "group details retrieved successfully",
        success: true,
        data: { group, member },
        statusCode: 200,
    });
}));
const getUsersGroups = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { result, totalCount } = yield group_service_1.groupService.getUsersGroups(req.user._id, req.query);
    (0, sendResponse_1.default)(res, {
        message: "user groups retrieved successfully",
        success: true,
        data: result,
        statusCode: 200,
        totalDoc: totalCount,
    });
}));
const groupController = {
    createGroup,
    getGroupSuggestions,
    getUsersGroups,
    getGroupDetailsById,
};
exports.default = groupController;
