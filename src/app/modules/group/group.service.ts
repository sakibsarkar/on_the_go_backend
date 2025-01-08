import mongoose from "mongoose";
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

  const pipeLine = [
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
        image: 1,
        privacy: 1,
        memberCount: 1,
        // groupMembers: 0,
      },
    },
  ]);
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

export const groupService = {
  createGroup,
  getGroupSuggestions,
  getUsersGroups,
  getGroupDetailsById,
};
