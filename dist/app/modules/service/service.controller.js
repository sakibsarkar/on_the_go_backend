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
exports.deleteServiceById = exports.updateServiceById = exports.getAllServiceFromDB = exports.getServiceById = exports.getAllServiceNames = exports.createServiceIntoDB = void 0;
const mongoose_1 = require("mongoose");
const catchAsyncError_1 = require("../../../utils/catchAsyncError");
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const service_model_1 = __importDefault(require("./service.model"));
const service_service_1 = __importDefault(require("./service.service"));
const { createService, getSingleService, getAllServices, updateSingleService, deleteSingleService, getAllServiceName, } = service_service_1.default;
exports.createServiceIntoDB = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const result = yield createService(body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Service created successfully",
        data: result,
    });
}));
exports.getAllServiceNames = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield getAllServiceName();
    (0, sendResponse_1.default)(res, {
        message: "Successfully get all service names",
        data: result,
        statusCode: 200,
        success: true,
    });
}));
exports.getServiceById = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const isValidId = (0, mongoose_1.isValidObjectId)(id);
    if (!isValidId) {
        return (0, sendResponse_1.default)(res, {
            message: "Invalid object id",
            data: null,
            statusCode: 400,
            success: false,
        });
    }
    const result = yield getSingleService(id);
    if (!result) {
        (0, sendResponse_1.default)(res, {
            message: "No data found",
            data: null,
            success: false,
            statusCode: 404,
        });
    }
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        statusCode: 200,
        message: "Service retrieved successfully",
    });
}));
exports.getAllServiceFromDB = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield getAllServices(req.query);
    if (result.result.length > 0) {
        return res.json({
            success: true,
            statusCode: 200,
            message: "Services retrieved successfully",
            data: result.result,
            totalDoc: result.totalDoc,
        });
    }
    res.json({
        success: false,
        statusCode: 404,
        message: "No Data Found",
        data: [],
        totalDoc: 0,
    });
}));
exports.updateServiceById = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { body } = req;
    const isValidId = (0, mongoose_1.isValidObjectId)(id);
    if (!isValidId) {
        return (0, sendResponse_1.default)(res, {
            message: "Invalid object id",
            data: null,
            statusCode: 400,
            success: false,
        });
    }
    const isExist = service_model_1.default.findById(id);
    if (!isExist) {
        return (0, sendResponse_1.default)(res, {
            message: "Service not found",
            data: null,
            statusCode: 404,
            success: false,
        });
    }
    const result = yield updateSingleService(id, body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Service updated successfully",
        data: result,
    });
}));
exports.deleteServiceById = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const isValidId = (0, mongoose_1.isValidObjectId)(id);
    if (!isValidId) {
        return (0, sendResponse_1.default)(res, {
            message: "Invalid object id",
            data: null,
            statusCode: 400,
            success: false,
        });
    }
    const isExist = service_model_1.default.findById(id);
    if (!isExist) {
        return (0, sendResponse_1.default)(res, {
            message: "Service not found",
            data: null,
            statusCode: 404,
            success: false,
        });
    }
    const result = yield deleteSingleService(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Service updated successfully",
        data: result,
    });
}));
