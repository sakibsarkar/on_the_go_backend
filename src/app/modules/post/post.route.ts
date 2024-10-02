import { Router } from "express";
import { multerUpload } from "../../config/cloudinaryMulter.config";
import {
  isAuthenticatedUser,
  isAuthenticatedUserOptional,
} from "../../middlewares/auth";
import { validSchema } from "../../middlewares/validator";
import { postController } from "./post.controller";
import { postValidationSchema } from "./post.validation";
const router = Router();
router.post(
  "/create",
  isAuthenticatedUser,
  validSchema(postValidationSchema),
  postController.createPost
);

router.delete(
  "/delete/:postId",
  isAuthenticatedUser,
  postController.deletePost
);
router.post(
  "/upload-image",
  isAuthenticatedUser,
  multerUpload.single("file"),
  postController.uploadPostImage
);
router.get("/get", isAuthenticatedUserOptional, postController.getAllPosts);
router.get("/get/:id", postController.getPostById);
router.patch("/vote/:postId", isAuthenticatedUser, postController.votePost);
const postRoute = router;

export default postRoute;
