import { Router } from "express";
import { multerUpload } from "../../config/cloudinaryMulter.config";
import { authorizeRoles, isAuthenticatedUser } from "../../middlewares/auth";
import {
  generateVerifyAccountPaymentUrl,
  getAllUser,
  isCapableForPremium,
  updateUserInfo,
  updateUserProfileImage,
} from "./user.controller";

const router = Router();
router.get("/all", isAuthenticatedUser, authorizeRoles("admin"), getAllUser);
router.put("/update", isAuthenticatedUser, updateUserInfo);
router.get("/can-have-premium", isAuthenticatedUser, isCapableForPremium);
router.post(
  "/get-varify-url",
  isAuthenticatedUser,
  generateVerifyAccountPaymentUrl
);
router.put(
  "/update-profile-image",
  isAuthenticatedUser,
  multerUpload.single("file"),
  updateUserProfileImage
);
const userRoute = router;
export default userRoute;
