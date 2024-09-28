"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const booking_controller_1 = require("./booking.controller");
const router = (0, express_1.Router)();
router.get("/my-bookings", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("user"), booking_controller_1.getUserBookings);
const bookingRoutes2 = router;
exports.default = bookingRoutes2;
