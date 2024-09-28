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
/* eslint-disable @typescript-eslint/no-explicit-any */
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const service_model_1 = __importDefault(require("./service.model"));
const createService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_model_1.default.create(payload);
    return result;
});
const getAllServiceName = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_model_1.default.find({ isDeleted: false }).select("name");
    return result;
});
const getSingleService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_model_1.default.findById(id);
    return result;
});
const getAllServices = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { min, max } = query;
    const minPrice = min ? parseInt(min) : 0;
    const maxPrice = max ? parseInt(max) : 0;
    const filter = { isDeleted: false };
    if (minPrice && maxPrice) {
        filter.price = { $gte: minPrice, $lte: maxPrice };
    }
    else if (minPrice) {
        filter.price = { $gte: minPrice };
    }
    else if (maxPrice) {
        filter.price = { $lte: maxPrice };
    }
    const queryModel = service_model_1.default.find(filter);
    const queryBuild = new QueryBuilder_1.default(queryModel, query)
        .paginate()
        .sort()
        .search(["name"]);
    const total = yield queryBuild.count();
    const result = yield queryBuild.modelQuery;
    return { result, totalDoc: total.totalCount };
});
const updateSingleService = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_model_1.default.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
const deleteSingleService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
});
const servicesService = {
    createService,
    getSingleService,
    getAllServices,
    updateSingleService,
    deleteSingleService,
    getAllServiceName,
};
exports.default = servicesService;
