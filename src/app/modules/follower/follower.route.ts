import { Router } from "express";
import { isAuthenticatedUser } from "../../middlewares/auth";
import { followerController } from "./follower.controller";

const router = Router();

router.get("/get", isAuthenticatedUser, followerController.getFollwers);
router.post(
  "/create",
  isAuthenticatedUser,
  followerController.createFollowerConstroller
);
router.delete(
  "/delete",
  isAuthenticatedUser,
  followerController.deleteFollowerController
);
const followerRoute = router;
export default followerRoute;
