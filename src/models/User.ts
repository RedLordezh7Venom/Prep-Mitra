import mongoose, { Document, Schema } from 'mongoose';

// Define the IUser interface
export interface IUser extends Document {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  password: string;
  profileImg?: string;
  mobile: number;
  country: string;
  rating: number;
  rank: number;
}

// Create the User schema
const UserSchema: Schema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/, 'Please fill a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    profileImg: {
      type: String,
      default: '',
    },
    mobile: {
      type: Number,
      required: true,
      unique: true,
    },
    country: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    rank: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } 
);

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
