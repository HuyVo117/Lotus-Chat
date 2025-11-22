import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, lowercase: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  hashedPassword: { type: String, required: true },
  displayName: { type: String, trim: true, required: true },
  avatarUrl: { type: String}, // link CDN hinh anh
  avatarId: { type: String }, // public_id tren cloudinary de xoa avatar
  bio: { type: String, maxlength: 500},
  phone: { type: String, sparse: true},


},{ timestamps: true }

);
const User = mongoose.model("User", userSchema);
export default User;