import { Router } from "express";
import { isAuthenticatedUser } from "../../middlewares/auth";
import groupController from "./group.controller";
const router = Router();

router.use(isAuthenticatedUser);
router.post("/create", groupController.createGroup);
router.get("/get-my", groupController.getUsersGroups);
router.get("/get/:groupId", groupController.getGroupDetailsById);
router.get("/get-suggestions", groupController.getGroupSuggestions);
router.get("/get-members/:groupId", groupController.getGroupMembersByGroupId);
router.put("/update/:groupId", groupController.updateGroupById);

const groupRoute = router;
export default groupRoute;
