import mongoose from 'mongoose';
import { checkContractStatus } from './contractScheduler';

const run = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/mydb');
    console.log('✅ Connected to MongoDB');

    await checkContractStatus();

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (err) {
    console.error('❌ Error:', err);
  }
};

run();
