import AppError from "../../errors/AppError";
import Post from "../post/post.model";
import { IComment } from "./comment.interface";
import Comment from "./comments.model";

const createComment = async (comment: IComment) => {
  const isPostExists = await Post.findById(comment.post);
  if (!isPostExists) {
    throw new AppError(404, "Post not found");
  }
  const result = await Comment.create(comment);
  isPostExists.commentCount = isPostExists.commentCount + 1;
  await isPostExists.save();
  return result;
};
const getCommentsByPostId = async (postId: string) => {
  const isPostExists = await Post.findById(postId);
  if (!isPostExists) {
    throw new AppError(404, "Post not found");
  }

  const result = await Comment.find({ post: isPostExists._id })
    .populate("user")
    .sort("-createdAt");

  return result;
};

const updateComment = async (
  id: string,
  userId: string,
  newComment: string
) => {
  const comment = await Comment.findById(id);
  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.user.toString() !== userId.toString()) {
    throw new Error("Unauthorized access");
  }

  const isPostExists = await Post.findById(comment.post);
  if (!isPostExists) {
    throw new Error("Post not found");
  }

  const result = await Comment.findByIdAndUpdate(
    id,
    {
      comment: newComment,
    },
    {
      new: true,
    }
  );

  return result;
};

const deleteComment = async (id: string, userId: string) => {
  const comment = await Comment.findById(id);
  if (!comment) {
    throw new AppError(404, "Comment not found");
  }

  if (comment.user.toString() !== userId.toString()) {
    throw new AppError(403, "Unauthorized access");
  }

  const isPostExists = await Post.findById(comment.post);
  if (!isPostExists) {
    throw new AppError(404, "Post not found");
  }

  const result = await Comment.findByIdAndDelete(id);
  isPostExists.commentCount = isPostExists.commentCount - 1;
  await isPostExists.save();
  return result;
};

export const commentService = {
  createComment,
  getCommentsByPostId,
  updateComment,
  deleteComment,
};
