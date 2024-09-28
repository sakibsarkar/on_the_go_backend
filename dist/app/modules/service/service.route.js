"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middlewares/auth");
const validator_1 = require("../../middlewares/validator");
const service_controller_1 = require("./service.controller");
const service_validation_1 = __importDefault(require("./service.validation"));
const router = (0, express_1.Router)();
router.post("/", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), (0, validator_1.validSchema)(service_validation_1.default), service_controller_1.createServiceIntoDB);
router.get("/", service_controller_1.getAllServiceFromDB);
router.get("/g/names", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), service_controller_1.getAllServiceNames);
router.get("/:id", service_controller_1.getServiceById);
router.put("/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), service_controller_1.updateServiceById);
router.delete("/:id", auth_1.isAuthenticatedUser, (0, auth_1.authorizeRoles)("admin"), service_controller_1.deleteServiceById);
const serviceRoutes = router;
exports.default = serviceRoutes;
