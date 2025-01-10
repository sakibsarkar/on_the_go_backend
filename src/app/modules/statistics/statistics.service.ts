import { IAnyObject } from "../../interface/error";
import Payment from "../payment/payment.model";
import Post from "../post/post.model";
import User from "../user/user.model";

const getPaymentStatistic = async ({
  from,
  to,
}: {
  from: Date | undefined;
  to: Date | undefined;
}) => {
  const query: IAnyObject = {};

  if (from) {
    query.createdAt = {
      $gte: from || new Date(),
    };
  }

  if (to) {
    query.createdAt = {
      ...(query.createdAt || {}),
      $lte: to || new Date(),
    };
  }

  const result = await Payment.find(query).sort({ createdAt: -1 });

  return result;
};

const getUserStatistics = async () => {
  const premiumUserCount = await User.countDocuments({
    isPremium: true,
    role: { $ne: "admin" },
  });
  const normalUserCount = await User.countDocuments({
    isPremium: false,
    role: { $ne: "admin" },
  });

  return { premiumUserCount, normalUserCount };
};

const getRecentStatistics = async () => {
  const transactions = await Payment.aggregate([
    { $sort: { createdAt: -1 } },

    { $limit: 30 },

    // Group by date and sum the amounts
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, //YYYY-MM-DD
        totalAmount: { $sum: "$amount" },
      },
    },
    // Sort grouped data in ascending order by date
    { $sort: { _id: 1 } },
  ]);

  const formattedData = transactions.map((item) => ({
    date: item._id,
    amount: item.totalAmount,
  }));

  return formattedData;
};

const getTopUsersByPosts = async () => {
  const topUsers = await Post.aggregate([
    {
      $group: {
        _id: "$user",
        postCount: { $sum: 1 },
      },
    },
    // Sort users by post count in descending order
    { $sort: { postCount: -1 } },

    { $limit: 10 },

    {
      $lookup: {
        from: "users",
        localField: "_id", // _id is the user ID from Post
        foreignField: "_id", // _id in User collection
        as: "userDetails",
      },
    },
    { $unwind: "$userDetails" },

    {
      $project: {
        _id: 0,
        userId: "$_id",
        postCount: 1,
        image: "$userDetails.image",
        firstName: "$userDetails.firstName",
        lastName: "$userDetails.lastName",
        email: "$userDetails.email",
      },
    },
  ]);

  return topUsers;
};

const statisticsService = {
  getPaymentStatistic,
  getUserStatistics,
  getRecentStatistics,
  getTopUsersByPosts,
};

export default statisticsService;
