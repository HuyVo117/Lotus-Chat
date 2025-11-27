import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
    {
        from: {   
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",    
            required: true,
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message:{
            type: String,
            maxLength: 300,
        }

    },
    { timestamps: true }
);

friendRequestSchema.index({ from: 1, to: 1 }, { unique: true }); // tao index doc nhat cho from va to

friendRequestSchema.index({ to: 1, createdAt: -1 }); // de lay danh sach request gui den
friendRequestSchema.index({ from: 1, createdAt: -1 }); // de lay danh sach request da gui


const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
export default FriendRequest;