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
exports.categoryController = void 0;
const catchAsyncError_1 = require("../../../utils/catchAsyncError");
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const category_service_1 = __importDefault(require("./category.service"));
const createCategory = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_service_1.default.createCategory(req.body);
    (0, sendResponse_1.default)(res, {
        message: "category created successfully",
        success: true,
        data: result,
        statusCode: 200,
    });
}));
const getCategories = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_service_1.default.getCategories(req.query);
    (0, sendResponse_1.default)(res, {
        message: "category retrieved successfully",
        success: true,
        data: result,
        statusCode: 200,
    });
}));
const getCategoriesByName = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const label = req.params.label;
    const result = yield category_service_1.default.getCategoriesByName(label);
    (0, sendResponse_1.default)(res, {
        message: "category retrieved successfully",
        success: true,
        data: result,
        statusCode: 200,
    });
}));
const deleteCategory = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield category_service_1.default.deleteCategory(id);
    (0, sendResponse_1.default)(res, {
        message: "category deleted successfully",
        success: true,
        data: result,
        statusCode: 200,
    });
}));
exports.categoryController = {
    createCategory,
    getCategoriesByName,
    getCategories,
    deleteCategory,
};
