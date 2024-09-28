"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const router = (0, express_1.Router)();
router.post("/success", payment_controller_1.successPaymentController);
router.post("/fail", payment_controller_1.failedPaymentController);
router.get("/fail", payment_controller_1.failedPaymentController);
exports.default = router;
