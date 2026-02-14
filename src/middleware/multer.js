import multer from "multer";


const storage=multer.diskStorage({
    filename: function (req,file,cb){
      cb(null, file.originalname) 
      console.log(file,"file")
    },
    destination: function (req,file,cb){
         cb(null,"./public")
         console.log(file,"file")
    }
})

export const Upload=multer({storage,})