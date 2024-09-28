"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
// Regex for HH:mm format validation
const timeFormat = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/;
const BookingSchema = zod_1.z
    .object({
    service: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
    date: zod_1.z.date(),
    startTime: zod_1.z
        .string()
        .regex(timeFormat, "Invalid time format")
        .refine((val) => {
        const [hours, minutes] = val.split(":").map((e) => Number(e));
        return hours < 24 && minutes < 60;
    }, "Invalid time"),
    endTime: zod_1.z
        .string()
        .regex(timeFormat, "Invalid time format")
        .refine((val) => {
        const [hours, minutes] = val.split(":").map((e) => Number(e));
        return hours < 24 && minutes < 60;
    }, "Invalid time"),
    isBooked: zod_1.z.enum(["available", "booked", "canceled"]),
})
    .refine((data) => {
    const [startH, startM] = data.startTime.split(":").map((e) => Number(e));
    const [endH, endM] = data.endTime.split(":").map((e) => Number(e));
    return startH < endH || (startH === endH && startM < endM);
}, {
    message: "startTime must be earlier than endTime",
    path: ["startTime"],
});
