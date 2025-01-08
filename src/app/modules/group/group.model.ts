import mongoose, { Types } from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: false,
      default: "",
    },

    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "public",
      required: true,
    },

    memberCount: {
      type: Number,
      required: true,
    },

    owner: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);

export default Group;
