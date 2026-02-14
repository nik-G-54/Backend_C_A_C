import {asynchandler} from "../utils/asynchandller.js";
import {ApiError} from "../utils/apierror.js";
import {User}  from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
// import { Upload } from "../middleware/multer.js";
import { ApiResponce } from "../utils/ApiResponce.js";




const userRegister= asynchandler( async (req,res)=>{
    console.log("i am here"); 
   
    const {fullname,username,email,password}=req.body
    console.log(email,"email")
    //1- data from body by req.body 
    //2-data check up empty or not
    //3-valiation
    //4-validate new user or old bt method Findone {email} aand by find by ID
    //5-   uplod fiile validation 
    //6- add middleware for files 
    //7- generate accestoen and refresh token 
    //8- refresh token with data store in the db 
    //9-extract data from the db 
    //10- and remove refresh token and password from the responce


    // 1st method
    // if(!username){
    //     return  console.log("username not found ") 
    // }


    // optimiseMethod


    if([username,email,password,fullname].some((field)=>field?.trim()==="")){   // this is the optimised method for check up empty field this accept  array and check up every field is empty or not
        throw new ApiError(400,"all fields required")
    }



    const existedUser=await User.findOne(
         {$or: [ {email},{username}]}
        )

    // if(!existedUser){  // wrong condition we have to check up if user exist then throw error
    //     throw new ApiError(409,"user already exist with this email")
    // }

    if(existedUser){
        throw new ApiError(409,"user already exist with this email or username")
    }

    /// step-2 file path

    const avtarlocalpath=req.files?.avtar[0]?.path // here we use optional chaining because if file not uplod then it will give error so by this we can avoid this error and it will return undefined if file not uplod
console.log(avtarlocalpath,"==avtarpath")  // basically here we get the file path of the uplod file and this path is store in the local storage of our project and after that we will uplod this file on cloudinary and after uplod we will get the url of the file and this url we will store in the db and this url we will use to display the image on the frontend
console.log(req.files);
const converImagelocalpath=req.files?.coverImage[0].path;
console.log(converImagelocalpath,"===coverimagepath");
console.log(req.files);
if(!avtarlocalpath){
    throw new ApiError(409,"error: file path not fpound")
}
if(!converImagelocalpath){
    throw new ApiError(409,"coverImage path not found")
 }


const avtar= await uploadOnCloudinary(avtarlocalpath)
console.log(avtar,"===avtar")  // here we get the responce of the uplod file on cloudinary and this responce contain the url of the uplod file and this url we will store in the db and this url we will use to display the image on the frontend
const coverImage=await uploadOnCloudinary(converImagelocalpath)
console.log(coverImage,"===coverImage")  // here we get the responce of the uplod file on cloudinary and this responce contain the url of the uplod file and this url we will store in the db and this url we will use to display the image on the frontend 
if(!avtar){
    throw new ApiError(500,"error in uploading avtar on cloudinary")
}
if(!coverImage){
    throw new ApiError(500,"error in uploading coverImage on cloudinary")
}


const user=await User.create({
    fullname,   
    username:username.toLowerCase(),
    email,
    avtar:avtar?.url,
    coverImage:coverImage?.url || "",
    password,
})


const createdUser= await User.findById(user._id).select("-password -refreshToken")  // here we use select method to exclude the password and refresh token from the responce because we don't want to send this data to the frontend and by this we can also avoid the security issue because if we send this data to the frontend then it can be easily accessed by the hacker and they can use this data to hack our application so by this we can avoid this issue and also we can reduce the size of the responce because we don't need to send this data to the frontend

if(!createdUser){
    throw new ApiError(500,"userdetails  not created properly somthing went wrong ")
}

    
return res.status(201).json(
    new ApiResponce(201,"user register successfully",createdUser)
)


})

export {userRegister}