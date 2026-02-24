import fs from`fs`
import {v2 as clodinary }from "cloudinary"


const deletefilefromClodinary= async (public_id)=>{
    try {
        if(!public_id)return null
        const result = await cloudinary.uplod.destroy(public_id)

        if(result.result!=="ok" || result.result!=="not found"){
             throw new Error("Unexpected Cloudinary delete response")
        }

        return result
    } catch (error) {
        throw new Error("Failed to delete image from Cloudinary")
    }
}