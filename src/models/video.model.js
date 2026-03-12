// import mongoose, { Schema } from "mongoose";

// const videoSchema = new Schema({
//     videoFile: {
//         type: String, //cloudinary url
//         required: true
//     },
//     thumbnail: {
//         type: String, //cloudinary url
//         required: true
//     },
//     title: {
//         type: String,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     duration: {
//         type: Number,
//         required: true
//     },
//     views: {
//         type: Number,
//         default: 0
//     },
//     owner: {
//         type: Schema.Types.ObjectId,
//         ref: "User"
//     },
//     isPublished: {
//         type: Boolean,
//         default: true
//     },
// }, { timestamps: true })


// export const Video = mongoose.model("Video", videoSchema)
import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema({
    videoFile: {
        url: String, //cloudinary url
        public_id: String,
        required: true
    },
    thumbnail: {
        url: String, //cloudinary url
        public_id: String,
        required: true
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