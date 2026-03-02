import { v2 as cloudinary } from "cloudinary"

const deletefilefromCloudinary = async (public_id) => {
    try {
        if (!public_id) return null
        const result = await cloudinary.uploader.destroy(public_id)
        return result
    } catch (error) {
        console.log("Error while deleting file from cloudinary", error)
        return null
    }
}

export { deletefilefromCloudinary }