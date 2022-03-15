import mongoose from 'mongoose';

export const genId: () => string = () =>
  new mongoose.Types.ObjectId().toHexString();
