import { catchAsyncError } from "../../../utils/catchAsyncError";
import sendResponse from "../../../utils/sendResponse";
import { followerService } from "./Follower.service";

const createFollowerConstroller = catchAsyncError(async (req, res) => {
  const user = req.user._id;
  const { follower } = req.body;
  const payload = {
    user,
    follower,
  };
  const result = await followerService.createFollower(payload);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Follower created successfully",
    data: result,
  });
});

const deleteFollowerController = catchAsyncError(async (req, res) => {
  const user = req.user._id;
  const { follower } = req.body;
  const payload = {
    user,
    follower,
  };
  const result = await followerService.deleteFollower(payload);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Follower deleted successfully",
    data: result,
  });
});

const getFollwers = catchAsyncError(async (req, res) => {
  const user = req.user._id;
  const result = await followerService.getFollwers(user);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "No Data Found",
    data: result,
  });
});

export const followerController = {
  createFollowerConstroller,
  deleteFollowerController,
  getFollwers,
};
