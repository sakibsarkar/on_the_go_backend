import QueryBuilder from "../../builder/QueryBuilder";
import { IAnyObject } from "../../interface/error";
import { IPost } from "./post.interface";
import Post from "./post.model";

const createPost = async (payload: IPost) => {
  const result = await Post.create(payload);
  return result;
};

const getAllPosts = async (query: IAnyObject) => {
  const queryModel = new QueryBuilder(Post.find(), query)
    .fields()
    .paginate()
    .sort()
    .filter()
    .search(["title"]);

  const totalDoc = (await queryModel.count()).totalCount;
  const result = await queryModel.modelQuery;
  return { result, totalDoc };
};

const postService = {
  createPost,getAllPosts
};
export default postService;
