"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const BookingValidationSchema = zod_1.z.object({
    customer: zod_1.z.string(),
    service: zod_1.z.string(),
    slot: zod_1.z.date(),
});
exports.default = BookingValidationSchema;
