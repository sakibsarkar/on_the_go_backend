"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("../modules/auth/auth.route"));
const category_route_1 = __importDefault(require("../modules/category/category.route"));
const comment_route_1 = __importDefault(require("../modules/comments/comment.route"));
const follower_route_1 = __importDefault(require("../modules/follower/follower.route"));
const payment_route_1 = __importDefault(require("../modules/payment/payment.route"));
const post_route_1 = __importDefault(require("../modules/post/post.route"));
const statistics_route_1 = __importDefault(require("../modules/statistics/statistics.route"));
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
        path: "/user",
        route: user_route_1.default,
    },
    {
        path: "/post",
        route: post_route_1.default,
    },
    {
        path: "/category",
        route: category_route_1.default,
    },
    {
        path: "/comment",
        route: comment_route_1.default,
    },
    {
        path: "/follower",
        route: follower_route_1.default,
    },
    {
        path: "/statistics",
        route: statistics_route_1.default,
    },
];
moduleRoute.forEach((route) => router.use(route.path, route.route));
exports.default = router;
