import mongoose, { Document, Model } from "mongoose";

export interface IToken extends Document {
  userId: string;
  token: string;
}

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Token: Model<IToken> = mongoose.model<IToken>("Token", tokenSchema);
export default Token;
