
import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema({
    videoFile: {
        url: {
            type: String,
            required: true
        },
        public_id: String
    },
    thumbnail: {
        url: {
            type: String,
            required: true
        },
        public_id: String
    },
    title: {
        type: String,
        required: true,
        trim:true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    isPublished: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });
// ✅ Add indexes here
videoSchema.index({ owner: 1 }); // this is for finding list of vedios
videoSchema.index({ createdAt: -1 });  // this is for sorting



export const Video = mongoose.model("Video", videoSchema)