import mongoose, { ConnectOptions } from 'mongoose';
import { appLogger } from '@/common/logging/logger';

export const connectToMongoose = async (
  connectionString: string,
  options: ConnectOptions = {}
): Promise<void> => {
  try {
    await mongoose.connect(connectionString, options);
    appLogger.info(`MongoDB: ${connectionString}`);
  } catch (error) {
    appLogger.error(`Error connecting to Mongoose: ${(error as Error).message}`);
    process.exit(1);
  }
};
