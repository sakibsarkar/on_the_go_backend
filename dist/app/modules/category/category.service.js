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
const category_model_1 = __importDefault(require("./category.model"));
const createCategory = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield category_model_1.default.create(payload);
    return result;
});
const getCategories = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const model = category_model_1.default.find();
    const queryBuilder = new QueryBuilder_1.default(model, query)
        .search(["label"])
        .paginate()
        .sort();
    const result = yield queryBuilder.modelQuery;
    return result;
});
const getCategoriesByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const model = category_model_1.default.find();
    const queryBuilder = new QueryBuilder_1.default(model, { searchTerm: name }).search([
        "label",
    ]);
    const result = yield queryBuilder.modelQuery;
    return result;
});
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield category_model_1.default.findById(id);
    if (!isExists) {
        throw new AppError_1.default(404, "Category not found");
    }
    const result = yield category_model_1.default.findByIdAndDelete(isExists._id);
    return result;
});
const categoryService = {
    createCategory,
    getCategories,
    getCategoriesByName,
    deleteCategory,
};
exports.default = categoryService;
