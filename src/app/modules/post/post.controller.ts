/* eslint-disable @typescript-eslint/no-explicit-any */
import { catchAsyncError } from "../../../utils/catchAsyncError";
import sendResponse from "../../../utils/sendResponse";
import { sendImageToCloudinary } from "../../../utils/uploadFile";
import { IPost } from "./post.interface";
import postService from "./post.service";

export const uploadPostImage = catchAsyncError(async (req, res) => {
  const file = req.file;
  if (!file) {
    return sendResponse(res, {
      message: "file not found",
      success: false,
      data: null,
      statusCode: 404,
    });
  }
  const uploadRes: any = await sendImageToCloudinary(file.filename, file.path);
  const url = uploadRes.secure_url as string;
  if (!url) {
    return sendResponse(res, {
      message: "failed to upload image",
      success: false,
      data: null,
      statusCode: 400,
    });
  }

  sendResponse(res, {
    message: "image uploaded successfully",
    success: true,
    data: url,
    statusCode: 200,
  });
});

const createPost = catchAsyncError(async (req, res) => {
  const { title, content, category, isPremium, images } = req.body;
  const user = req.user._id;
  const payload = {
    title,
    content,
    category,
    images,
    isPremium: isPremium || false,
    user: user as string,
  } as IPost;
  const result = await postService.createPost(payload);

  sendResponse(res, {
    message: "post created successfully",
    success: true,
    data: result,
    statusCode: 200,
  });
});

const getAllPosts = catchAsyncError(async (req, res) => {
  const query = req.query;
  const { result, totalDoc } = await postService.getAllPosts(query);
  if (result.length > 0) {
    return sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "All posts retrieved successfully",
      data: result,
      totalDoc,
    });
  }
  sendResponse(res, {
    success: false,
    statusCode: 404,
    message: "No Data Found",
    data: [],
    totalDoc: 0,
  });
});

export const postController = { createPost, uploadPostImage,getAllPosts };
