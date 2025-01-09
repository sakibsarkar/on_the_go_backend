"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
// Define the valid reaction types
const ReactionTypeSchema = zod_1.z.enum([
    "like",
    "love",
    "haha",
    "wow",
    "sad",
    "angry",
]);
// Define the validation schema for the object
const change = zod_1.z.object({
    postId: zod_1.z.string({ message: "post id is required as string" }),
    reactionId: ReactionTypeSchema,
});
const reactionValidation = {
    change,
};
exports.default = reactionValidation;
