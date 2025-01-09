"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const groupMemberController_1 = __importDefault(require("./groupMemberController"));
const router = (0, express_1.Router)();
router.use(auth_1.isAuthenticatedUser);
router.post("/join-group/:groupId", groupMemberController_1.default.joinGroup);
router.get("/get-group-members/:groupId", groupMemberController_1.default.getGroupMembers);
router.post("/leave-group/:groupId", groupMemberController_1.default.leaveGroup);
const groupMemberRoute = router;
exports.default = groupMemberRoute;
