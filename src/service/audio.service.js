import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import path from "path"
import { resolve } from "dns";
import { rejects } from "assert";


ffmpeg.setFfmpegPath(ffmpegPath)

const extractAudioFromVideo=async(videoPath)=>{

    const audioPath=videoPath.replace(".mp4", ".mp3")


    return new Promise((resolve,reject)=>{

        ffmpeg(videoPath)
        .noVideo()
        .audioCodec("libmp3lame")
        .save(audioPath)
        .on("end",()=>{
             console.log("Audio extraction completed")
             resolve(audioPath)
        })
         .on("error", (err) => {

                console.log("Error extracting audio:", err)

                reject(err)

            })
    })
}
export { extractAudioFromVideo }