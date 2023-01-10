import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: 'database.env' });

export default async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(`mongodb://${process.env.DB_URL}:${process.env.DB_PORT}/manga`);
    console.log('[MongoDB]: has started👏');
  } catch (error) {
    console.log(error);
    
    console.log('[MongoDB]: has run failure🤔');
  }
}
