import express from "express";
import authRoute from "../modules/auth/auth.route";

import paymentRoute from "../modules/payment/payment.route";
import postRoute from "../modules/post/post.route";
import userRoute from "../modules/user/user.route";

// import userRoutes from "../modules/user/user.route";
const router = express.Router();

const moduleRoute = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/payment",
    route: paymentRoute,
  },
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/post",
    route: postRoute,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

export default router;
