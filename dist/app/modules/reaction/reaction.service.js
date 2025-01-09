"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_model_1 = __importDefault(require("../post/post.model"));
const reaction_model_1 = __importDefault(require("./reaction.model"));
const changeReactionByPostIdService = (userId, postId, reactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const isReactionExist = yield reaction_model_1.default.findOne({
        user: userId,
        post: postId,
    });
    if (isReactionExist) {
        if (isReactionExist.reactionId == reactionId) {
            const res = yield reaction_model_1.default.findByIdAndDelete(isReactionExist._id);
            yield post_model_1.default.findByIdAndUpdate(isReactionExist.post, {
                $inc: {
                    reactionCount: -1,
                },
            });
            return res;
        }
        else {
            isReactionExist.reactionId = reactionId;
            yield isReactionExist.save();
            return isReactionExist;
        }
    }
    const result = yield reaction_model_1.default.create({
        user: userId,
        post: postId,
        reactionId,
    });
    yield post_model_1.default.findByIdAndUpdate(postId, {
        $inc: {
            reactionCount: 1,
        },
    });
    return result;
});
const reactionService = {
    changeReactionByPostIdService,
};
exports.default = reactionService;
