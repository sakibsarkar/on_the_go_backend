import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { IAnyObject } from "../../interface/error";
import Group from "../group/group.model";
import GroupMember from "./gorupMember.model";

const joinGroup = async (userId: string, groupId: string) => {
  const isAlreadyMember = await GroupMember.findOne({
    user: userId,
    group: groupId,
  });
  if (isAlreadyMember) {
    throw new AppError(400, "You are already a member of this group");
  }
  const result = await GroupMember.create({
    user: userId,
    group: groupId,
    role: "member",
  });

  await Group.updateOne({ _id: groupId }, { $inc: { memberCount: 1 } });

  return result;
};

const leaveGroup = async (userId: string, groupId: string) => {
  const isMember = await GroupMember.findOne({
    user: userId,
    group: groupId,
  });
  if (!isMember) {
    throw new AppError(400, "You are not a member of this group");
  }
  const result = await GroupMember.findByIdAndDelete(isMember._id);
  return result;
};

const getGroupMembers = async (
  groupId: string,
  userId: string,
  query: IAnyObject
) => {
  const isGroupExist = await Group.findById(groupId);

  if (!isGroupExist) {
    throw new AppError(404, "Group not found");
  }

  if (isGroupExist.privacy == "private") {
    const isMember = await GroupMember.findOne({
      user: userId,
      group: groupId,
    });

    if (!isMember) {
      throw new AppError(400, "You are not a member of this group");
    }
  }

  const model = GroupMember.find({ group: groupId });

  const queryBuilder = new QueryBuilder(model, query)
    .paginate()
    .sort()
    .filter();
  const totalDoc = await queryBuilder.count();
  const result = await queryBuilder.modelQuery;

  return { result, totalDoc: totalDoc.totalCount };
};

const groupMemberService = {
  joinGroup,
  leaveGroup,
  getGroupMembers,
};

export default groupMemberService;
