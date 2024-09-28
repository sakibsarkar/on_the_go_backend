"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("../modules/auth/auth.route"));
const booking_route_1 = __importDefault(require("../modules/booking/booking.route"));
const booking_route2_1 = __importDefault(require("../modules/booking/booking.route2"));
const payment_route_1 = __importDefault(require("../modules/payment/payment.route"));
const review_route_1 = __importDefault(require("../modules/review/review.route"));
const service_route_1 = __importDefault(require("../modules/service/service.route"));
const slot_route_1 = __importDefault(require("../modules/slot/slot.route"));
const slot_route2_1 = __importDefault(require("../modules/slot/slot.route2"));
const user_route_1 = __importDefault(require("../modules/user/user.route"));
// import userRoutes from "../modules/user/user.route";
const router = express_1.default.Router();
const moduleRoute = [
    {
        path: "/auth",
        route: auth_route_1.default,
    },
    {
        path: "/payment",
        route: payment_route_1.default,
    },
    {
        path: "/services",
        route: service_route_1.default,
    },
    {
        path: "/services",
        route: slot_route_1.default,
    },
    {
        path: "/slots",
        route: slot_route2_1.default,
    },
    {
        path: "/bookings",
        route: booking_route_1.default,
    },
    {
        path: "/review",
        route: review_route_1.default,
    },
    {
        path: "/user",
        route: user_route_1.default,
    },
    {
        path: "/",
        route: booking_route2_1.default,
    },
];
moduleRoute.forEach((route) => router.use(route.path, route.route));
exports.default = router;
