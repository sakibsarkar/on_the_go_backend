import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { IAnyObject } from "../../interface/error";
import User from "../user/user.model";
import { IFollower } from "./follower.interface";
import Follower from "./follower.model";

const createFollower = async (payload: IFollower) => {
  // whom to follow
  const isUserExist = await User.findOne({ _id: payload.user });
  if (!isUserExist) {
    throw new AppError(404, "User not found");
  }

  // who follows
  const isFollowerExist = await User.findOne({ _id: payload.follower });

  if (!isFollowerExist) {
    throw new AppError(404, "Follower not found");
  }

  const isFollowing = await Follower.findOne({
    user: isUserExist._id,
    follower: isFollowerExist._id,
  });
  if (isFollowing) {
    const result = await Follower.deleteOne({
      user: isUserExist._id,
      follower: isFollowerExist._id,
    });
    return result;
  }

  const result = await Follower.create(payload);
  return result;
};

const deleteFollower = async (payload: IFollower) => {
  const isUserExist = await User.findOne({ _id: payload.user });
  if (!isUserExist) {
    throw new AppError(404, "User not found");
  }
  const isFollowerExist = await User.findOne({ _id: payload.follower });
  if (!isFollowerExist) {
    throw new AppError(404, "Follower not found");
  }

  const isFollowing = await Follower.findOne({
    user: isUserExist._id,
    follower: isFollowerExist._id,
  });
  if (!isFollowing) {
    throw new AppError(404, "Following not found");
  }

  const result = await Follower.deleteOne({
    user: isUserExist._id,
    follower: isFollowerExist._id,
  });
  return result;
};

const getFollwers = async (user: string, query: IAnyObject) => {
  const model = Follower.find({ user: user })
    .populate("user")
    .populate("follower")
    .sort("-createdAt");
  const queryModel = new QueryBuilder(model, query).paginate().sort();

  const totalDoc = await queryModel.count();
  const result = await queryModel.modelQuery;
  return { result, totalDoc: totalDoc.totalCount };
};

const getFollowingList = async (user: string, query: IAnyObject) => {
  const model = Follower.find({ follower: user })
    .populate("user")
    .populate("follower")
    .sort("-createdAt");
  const queryModel = new QueryBuilder(model, query).paginate().sort();

  const totalDoc = await queryModel.count();
  const result = await queryModel.modelQuery;
  return { result, totalDoc: totalDoc.totalCount };
};

export const followerService = {
  createFollower,
  deleteFollower,
  getFollwers,
  getFollowingList,
};
