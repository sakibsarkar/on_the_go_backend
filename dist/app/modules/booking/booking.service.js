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
exports.bookingService = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const slot_model_1 = __importDefault(require("../slot/slot.model"));
const booking_model_1 = __importDefault(require("./booking.model"));
const createBookingService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const create = yield booking_model_1.default.create(payload);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const update = yield slot_model_1.default.findByIdAndUpdate(payload.slot, {
        isBooked: "booked",
    });
    const result = yield booking_model_1.default.findById(create._id)
        .populate("service")
        .populate("slot")
        .populate("customer");
    return result;
});
const getAllBookingService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const find = booking_model_1.default.find()
        .sort("-createdAt")
        .populate("service")
        .populate("slot")
        .populate("customer");
    const queryBuilder = new QueryBuilder_1.default(find, query).filter().paginate();
    const totalDoc = yield queryBuilder.count();
    const result = yield queryBuilder.modelQuery;
    return { result, totalDoc: totalDoc.totalCount };
});
const getUserBookingsService = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const model = booking_model_1.default.find({ customer: userId })
        .populate("service")
        .populate("slot")
        .populate("customer");
    const queryBuild = new QueryBuilder_1.default(model, query).filter();
    const result = yield queryBuild.modelQuery;
    return result;
});
exports.bookingService = {
    createBookingService,
    getAllBookingService,
    getUserBookingsService,
};
