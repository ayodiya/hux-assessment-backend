import mongoose, { Schema, Document, Model, Types } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
export interface IContact extends Document {
  userId: Types.ObjectId;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNo: string;
  slug: string;
}

const contactSchema: Schema<IContact> = new Schema<IContact>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Contact: Model<IContact> = mongoose.model<IContact>(
  "Contact",
  contactSchema,
);
export default Contact;
