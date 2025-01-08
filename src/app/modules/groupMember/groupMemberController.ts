import { catchAsyncError } from "../../../utils/catchAsyncError";
import sendResponse from "../../../utils/sendResponse";
import groupMemberService from "./gorupMember.service";

const joinGroup = catchAsyncError(async (req, res) => {
  const result = await groupMemberService.joinGroup(
    req.user._id,
    req.params.groupId
  );
  sendResponse(res, {
    message: "group joined successfully",
    success: true,
    data: result,
    statusCode: 200,
  });
});

const leaveGroup = catchAsyncError(async (req, res) => {
  const result = await groupMemberService.leaveGroup(
    req.user._id,
    req.params.groupId
  );
  sendResponse(res, {
    message: "group left successfully",
    success: true,
    data: result,
    statusCode: 200,
  });
});

const getGroupMembers = catchAsyncError(async (req, res) => {
  const { result, totalDoc } = await groupMemberService.getGroupMembers(
    req.params.groupId,
    req.user._id,
    req.query
  );
  sendResponse(res, {
    message: "group members retrieved successfully",
    success: true,
    data: result,
    statusCode: 200,
    totalDoc,
  });
});

const groupMemberController = {
  joinGroup,
  leaveGroup,
  getGroupMembers,
};

export default groupMemberController;
