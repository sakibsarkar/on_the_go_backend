import AppError from "../../errors/AppError";
import User from "../user/user.model";
import { IFollower } from "./follower.interface";
import Follower from "./follower.model";

const createFollower = async (payload: IFollower) => {
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
  if (isFollowing) {
    const result = await Follower.deleteOne({
      user: payload.user,
      follower: payload.follower,
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
    user: payload.user,
    follower: payload.follower,
  });
  if (!isFollowing) {
    throw new AppError(404, "Follower not found");
  }

  const result = await Follower.deleteOne({
    user: payload.user,
    follower: payload.follower,
  });
  return result;
};

const getFollwers = async (user: string) => {
  const result = await Follower.find({ user: user }).populate("follower");
  return result;
};

export const followerService  = { createFollower, deleteFollower, getFollwers };
