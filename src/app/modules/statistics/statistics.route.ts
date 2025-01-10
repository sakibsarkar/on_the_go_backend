import { Router } from "express";
import { authorizeRoles, isAuthenticatedUser } from "../../middlewares/auth";
import {
  getRecentStatistics,
  getTopUsersByPosts,
  getUserStatistics,
  paymentStatisticsController,
} from "./statistics.controller";

const router = Router();

router.get(
  "/payment",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  paymentStatisticsController
);

router.get(
  "/recent",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getRecentStatistics
);

router.get(
  "/user",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getUserStatistics
);
router.get(
  "/top-user",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getTopUsersByPosts
);

const statisticsRoute = router;
export default statisticsRoute;
