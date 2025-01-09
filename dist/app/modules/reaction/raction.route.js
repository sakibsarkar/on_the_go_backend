"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const validator_1 = require("../../middlewares/validator");
const reaction_controller_1 = __importDefault(require("./reaction.controller"));
const reaction_validation_1 = __importDefault(require("./reaction.validation"));
const router = (0, express_1.Router)();
router.patch("/change", (0, validator_1.validSchema)(reaction_validation_1.default.change), auth_1.isAuthenticatedUser, reaction_controller_1.default.changeReactionByPostId);
const reactionRoute = router;
exports.default = reactionRoute;
