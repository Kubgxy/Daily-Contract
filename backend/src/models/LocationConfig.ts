// models/WorkLocationConfig.ts
import mongoose from 'mongoose';

const WorkLocationConfigSchema = new mongoose.Schema({
  name: { type: String, default: 'default', unique: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  radius: { type: Number, required: true }, // หน่วยเป็นเมตร
}, { 
    timestamps: true,
    collection: 'LocationConfig'
 });

export default mongoose.model('LocationConfig', WorkLocationConfigSchema);
