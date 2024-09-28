"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const slot_controller_1 = require("./slot.controller");
// "/slot/{pathname}"
const router = (0, express_1.Router)();
router.get("/availability", slot_controller_1.getAllAvailableSlots);
router.get("/availability/:id", slot_controller_1.getSlotById);
router.put("/toggle-status/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), slot_controller_1.toggleSlotStatus);
const slotRoutes2 = router;
exports.default = slotRoutes2;
