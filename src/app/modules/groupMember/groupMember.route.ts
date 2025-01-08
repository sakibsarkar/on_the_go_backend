import { Router } from "express";
import { isAuthenticatedUser } from "../../middlewares/auth";
import groupMemberController from "./groupMemberController";

const router = Router();
router.use(isAuthenticatedUser);

router.post("/join-group/:groupId",groupMemberController.joinGroup)
router.get("/get-group-members/:groupId",groupMemberController.getGroupMembers)
router.post("/leave-group/:groupId",groupMemberController.leaveGroup)

const groupMemberRoute = router;
export default groupMemberRoute;