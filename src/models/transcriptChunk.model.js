import mongoose from "mongoose";

const transcriptChunkSchema = new mongoose.Schema({

 video:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Video"
 },

 text:{
  type:String
 },

 embedding:{
  type:[Number]
 }

})

export const TranscriptChunk = mongoose.model(
 "TranscriptChunk",
 transcriptChunkSchema
)