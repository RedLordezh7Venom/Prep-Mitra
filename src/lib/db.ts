import mongoose from 'mongoose';
import User, { IUser } from '@/models/User'

const connectDB = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState >= 1) return;
    console.log(process.env.MONGODB_URI);
    if (!process.env.MONGODB_URI) {
      throw new Error('Mongo URI is not defined in environment variables');
    }
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
    console.log('MongoDB Connected');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error connecting to MongoDB:', error.message);
    } else {
      console.error('An unknown error occurred during MongoDB connection');
    }
  }
};

// export default connectDB;




export async function createUser(userData: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>) {
  
  connectDB();

  const user = {
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const result = await User.create(user)
  return result
}

export async function getUserByClerkId(clerkId: string) {
  connectDB();

  const user = await User.findOne({ clerkId })
  return user
}
