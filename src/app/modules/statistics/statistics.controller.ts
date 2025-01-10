import { catchAsyncError } from "../../../utils/catchAsyncError";
import sendResponse from "../../../utils/sendResponse";
import statisticsService from "./statistics.service";

export const paymentStatisticsController = catchAsyncError(async (req, res) => {
  const { from, to } = req.query;
  const fromDate = from ? new Date(from as string) : undefined;
  const toDate = to ? new Date(to as string) : undefined;

  const payload = {
    from: fromDate,
    to: toDate,
  };

  const result = await statisticsService.getPaymentStatistic(payload);
  sendResponse(res, {
    data: result,
    success: true,
    message: "successfully get payment statistics",
    statusCode: 200,
  });
});

export const getUserStatistics = catchAsyncError(async (req, res) => {
  const result = await statisticsService.getUserStatistics();
  sendResponse(res, {
    data: result,
    success: true,
    message: "successfully get user statistics",
    statusCode: 200,
  });
});

export const getRecentStatistics = catchAsyncError(async (req, res) => {
  const result = await statisticsService.getRecentStatistics();
  sendResponse(res, {
    data: result,
    success: true,
    message: "successfully get recent statistics",
    statusCode: 200,
  });
});
export const getTopUsersByPosts = catchAsyncError(async (req, res) => {
  const result = await statisticsService.getTopUsersByPosts();
  sendResponse(res, {
    data: result,
    success: true,
    message: "successfully get top 10 users by posts",
    statusCode: 200,
  });
});
