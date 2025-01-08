import mongoose, { Types } from "mongoose";

const groupMemberSchema = new mongoose.Schema(
  {
    user: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },

    group: {
      type: Types.ObjectId,
      required: true,
      ref: "Group",
    },
    role: {
      type: String,
      enum: ["owner", "member", "admin"],
      default: "member",
      required: true,
    },
  },
  { timestamps: true }
);

const GroupMember = mongoose.model("GroupMember", groupMemberSchema);

export default GroupMember;
