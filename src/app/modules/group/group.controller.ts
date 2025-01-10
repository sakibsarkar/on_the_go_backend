import { catchAsyncError } from "../../../utils/catchAsyncError";
import sendResponse from "../../../utils/sendResponse";
import { groupService } from "./group.service";

const createGroup = catchAsyncError(async (req, res) => {
  const result = await groupService.createGroup(req.body, req.user._id);
  sendResponse(res, {
    message: "group created successfully",
    success: true,
    data: result,
    statusCode: 200,
  });
});

const getGroupSuggestions = catchAsyncError(async (req, res) => {
  const { result, totalCount } = await groupService.getGroupSuggestions(
    req.user._id,
    req.query
  );
  sendResponse(res, {
    message: "group suggestions retrieved successfully",
    success: true,
    data: result,
    statusCode: 200,
    totalDoc: totalCount,
  });
});

const getGroupDetailsById = catchAsyncError(async (req, res) => {
  const { group, member } = await groupService.getGroupDetailsById(
    req.params.groupId,
    req.user._id
  );
  sendResponse(res, {
    message: "group details retrieved successfully",
    success: true,
    data: { group, member },
    statusCode: 200,
  });
});

const getUsersGroups = catchAsyncError(async (req, res) => {
  const { result, totalCount } = await groupService.getUsersGroups(
    req.user._id,
    req.query
  );
  sendResponse(res, {
    message: "user groups retrieved successfully",
    success: true,
    data: result,
    statusCode: 200,
    totalDoc: totalCount,
  });
});

const getGroupMembersByGroupId = catchAsyncError(async (req, res) => {
  const { result, totalDoc } = await groupService.getGroupMembersByGroupId(
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

const updateGroupById = catchAsyncError(async (req, res) => {
  const result = await groupService.updateGroupById(
    req.params.groupId,
    req.user._id,
    req.body
  );
  sendResponse(res, {
    message: "group updated successfully",
    success: true,
    data: result,
    statusCode: 200,
  });
});

const groupController = {
  createGroup,
  getGroupSuggestions,
  getUsersGroups,
  getGroupDetailsById,
  getGroupMembersByGroupId,
  updateGroupById,
};

export default groupController;
