"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const group_controller_1 = __importDefault(require("./group.controller"));
const router = (0, express_1.Router)();
router.use(auth_1.isAuthenticatedUser);
router.post("/create", group_controller_1.default.createGroup);
router.get("/get-my", group_controller_1.default.getUsersGroups);
router.get("/get/:groupId", group_controller_1.default.getGroupDetailsById);
router.get("/get-suggestions", group_controller_1.default.getGroupSuggestions);
const groupRoute = router;
exports.default = groupRoute;
