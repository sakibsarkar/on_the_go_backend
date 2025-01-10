import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { IAnyObject } from "../../interface/error";
import GroupMember from "../groupMember/gorupMember.model";
import { IGroup } from "./group.interface";
import Group from "./group.model";

const createGroup = async (payload: IGroup, userId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const groupPayload = { ...payload, owner: userId, memberCount: 1 };

    // Create the group document
    const result = await Group.create([groupPayload], { session });

    if (!result[0]) {
      throw new AppError(400, "Failed to create group");
    }

    await GroupMember.create(
      [
        {
          group: result[0]._id,
          user: userId,
          role: "owner",
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return result[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(400, "Failed to create group");
  }
};

const getGroupDetailsById = async (groupId: string, userId: string) => {
  const result = await Group.findById(groupId).populate("owner");
  const member = await GroupMember.findOne({
    group: groupId,
    user: userId,
  }).populate("user");
  return {
    group: result,
    member,
  };
};

const getGroupSuggestions = async (userId: string, query: IAnyObject) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const searchTerm = query.searchTerm?.trim(); // Extract and trim the search term if provided

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pipeLine: any[] = [
    {
      $lookup: {
        from: "groupmembers",
        localField: "_id",
        foreignField: "group",
        as: "groupMembers",
      },
    },
    {
      $match: {
        $expr: {
          $not: {
            $in: [new mongoose.Types.ObjectId(userId), "$groupMembers.user"],
          },
        },
      },
    },
  ];

  // Add search condition if searchTerm is provided
  if (searchTerm) {
    pipeLine.push({
      $match: {
        $or: [
          { name: { $regex: searchTerm, $options: "i" } }, // Case-insensitive search on name
          { description: { $regex: searchTerm, $options: "i" } }, // Case-insensitive search on description
        ],
      },
    });
  }

  // Fetch the results with sorting, pagination, and projection
  const result = await Group.aggregate([
    ...pipeLine,
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $project: {
        name: 1,
        description: 1,
        createdAt: 1,
        image: 1,
        privacy: 1,
        memberCount: 1,
      },
    },
  ]);

  // Fetch the total count of documents
  const totalCountResult = await Group.aggregate([
    ...pipeLine,
    {
      $count: "totalCount",
    },
  ]);
  const totalCount =
    totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;

  return { result, totalCount };
};

const getUsersGroups = async (userId: string, query: IAnyObject) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const pipeLine = [
    {
      $match: {
        user: userId,
      },
    },
    {
      $lookup: {
        from: "groups",
        localField: "group",
        foreignField: "_id",
        as: "group",
      },
    },
  ];

  const result = await GroupMember.aggregate([
    ...pipeLine,
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $project: {
        group: 1,
      },
    },
  ]);

  const modifiedResult = result?.map((item) => item.group[0]);

  const totalCountResult = await Group.aggregate([
    ...pipeLine,
    {
      $count: "totalCount",
    },
  ]);
  const totalCount =
    totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;
  return { result: modifiedResult, totalCount };
};

const getGroupMembersByGroupId = async (
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
      group: groupId,
      user: userId,
    });

    if (!isMember) {
      throw new AppError(
        400,
        "You are not a member of this group and the group is private"
      );
    }
  }

  const model = GroupMember.find({ group: groupId }).populate("user");
  const queryBuilder = new QueryBuilder(model, query)
    .paginate()
    .sort()
    .filter();

  const result = await queryBuilder.modelQuery;
  const totalDoc = await queryBuilder.count();

  return { result, totalDoc: totalDoc.totalCount };
};

const updateGroupById = async (
  groupId: string,
  userId: string,
  data: Partial<IGroup>
) => {
  const isGroupExist = await Group.findById(groupId);
  ["owner", "memberCount"].forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete data[key];
  });

  if (!isGroupExist) {
    throw new AppError(404, "Group not found");
  }

  const member = await GroupMember.findOne({
    group: groupId,
    user: userId,
  });

  if (!member) {
    throw new AppError(400, "You are not allowed to update this group");
  }

  const validRoles = ["owner", "admin"];

  if (!validRoles.includes(member.role)) {
    throw new AppError(400, "You are not allowed to update this group");
  }

  const result = await Group.findByIdAndUpdate(groupId, data, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const groupService = {
  createGroup,
  getGroupSuggestions,
  getUsersGroups,
  getGroupDetailsById,
  getGroupMembersByGroupId,
  updateGroupById,
};
