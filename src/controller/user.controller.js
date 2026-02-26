import {asynchandler,deletefilefromCloudinary} from "../utils/asynchandller.js";
import {ApiError} from "../utils/ApiError.js";
import {User}  from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
// import { Upload } from "../middleware/multer.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import jwt from "jsonwebtoken"
import { Aggregate } from "mongoose";


 // 1-generate access token ke andr
 //2-user ki detail find kro userId se usko save kro fir us user se access token generate kro by calling the method of user model and pass the userId in the method and store this access token in a variable and also generate refresh token by calling the method of user model and pass the userId in the method and store this refresh token in a variable and return both access token and refresh token to the frontend for future use
const generateAccessTokenandRefreshToken=async(userId)=>{
    try {
        const user=await User.findById(userId)
        console.log(user,"userdata--")
        const accessToken= user.generateAccessToken()
        console.log("Accesstoken ---",accessToken)
        const refreshToken= user.generateRefreshToken()
        console.log("refreshToken--===",refreshToken)

        user.refreshToken=refreshToken
        await user.save({validateBeforeSave: false})
         return{accessToken,refreshToken}
    } catch (error) {
   console.log("REAL ERROR:", error)
   throw error   // ya temporarily throw error
}

   
    
}



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

const loginUser=asynchandler(async(req,res)=>{
//1-data extract krna from frontend by { req.body}
//2-email and password verify validation lgana email.trim()=== ""  or password.trim()==="" then throw error
//3-find user by email or by using findOne method by email and if user not exist then throw error
//4-if not found  show  a message usernot register with this email
//5-if userfind then comapre password or validate bassword by using bycrpt.isverify method and if password not match then throw error
//6- if password match generate accestoken and refresh token by jwt.sign({},{},{})
// by caling both function generate and accesstoken and refresh token function 
//7-send refresh token and accestoken to the frontend and also store refresh token in the db for future use and also set this refresh token in the httpOnly cookie for security purpose because by this we can avoid the security issue because if we send this data to the frontend then it can be easily accessed by the hacker and they can use this data to hack our application so by this we can avoid this issue and also we can reduce the size of the responce because we don't need to send this data to the frontend 

 const {email,password,username} = req.body

 if([email,password,username].some((field)=>field?.trim()==="")){
    throw new ApiError(400,"please provide a email or password or username")
 }

 const user= await User.findOne({
    $or:[{email},{username}]
 })
 console.log("detail of user: ",user)
 if(!user){
    throw new ApiError(400,"user not register with this email or username")
 }
const isPasswordvalid= await user.isPasswordCorrect(password)
console.log("password ",isPasswordvalid)

if(!isPasswordvalid){
    throw new ApiError(409,"password invalid")

}


 const {accessToken,refreshToken}=await generateAccessTokenandRefreshToken(user._id)
 console.log("AccessToken",accessToken)
 console.log("reccessToken",refreshToken)

 const loggedInuser=await User.findById(user._id).select("-password -refreshToken")
console.log("loggedTnuser",loggedInuser)
 const option ={
    http:true,
    secure:true
 }

 res.status(200).cookie("accessToken",accessToken,option)
 .cookie("refreshToken",refreshToken,option)
 .json(
    new ApiResponce(200,"user login successfully",{user:loggedInuser,accessToken,refreshToken})
 )



})

const logoutUser =asynchandler(async(req,res)=>{
  await User.findByIdAndUpdate(req.user._id,{
    $unset:{refreshToken :1} },
    {
        new:true
    }
 )
   const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .clearcookies("accessToken",options)
    .clearcookies("refreshToken",options)
    .json(new ApiResponce(200,{},"user log out "))
})

const refreshAccessToken = asynchandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponce(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const changePassword=asynchandler(async(res,req)=>{
 const {oldpassword,newpassword}=req.boody

  const user= await User.findById(req.user?._id)
   const isPasswordCorrect= await user.isPasswordCorrect(oldpassword)

   if(!isPasswordCorrect){
    throw new ApiError(400,"Invalid password")
   }
  
   user.password=newpassword  /// here  passord which is in the data base  is change or replace by newPassword 
   await user.save({validateBeforeSave: false})  
   

   return res.send(200)
   .json(new ApiResponce(200,{},"Password change successfully"))


})

const getCurrentUser = asynchandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponce(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const updateAccountDetail=asynchandler(async(req,res)=>{
    const {fullname,email}=req.body
   if(!fullname || !email){
    throw new ApiError(400,"All field require")
   }
   const user= await User.findOneAndUpdate(req.user._id,{
    $set:{
        fullname:fullname,
        email:email
    } },
    {new:true}
       
  .select("-password"))

  return res.
  status(200)
  .json(new ApiResponce(200,user,"Account Detail updated successfully"))


});


const updateUserAvtar=asynchandler(async(req,res)=>{
    const avtarlocalpath=req.file?.path
    if(!avtarlocalpath){
        throw new ApiError(400,"Avtar file is ,issimg ")
}     
           
 const avtar= await uploadOnCloudinary(avtarlocalpath)

 if(!avtar.url){
    throw new ApiError(400,"error in uploding ")
 }
 const user= await userRegister.findById(req.user?._id)
 if(user.avtar?.public_id){
    await deletefilefromCloudinary(user.avatar.public_id)
 }


 user.avtar={
    url:avtar.url,
    public_id:avtar.public_id
 }

    await user.save({ validateBeforeSave: false })

        // const user= await User.findByIdAndUpdate(req.user?._id,
        //     {
        //         $set:avtar.url
        //     },
        //     {new: true}

        // ).select("-password")




        return res.status(200)
        .json(new ApiResponce(200,user,"Avtar image updated successfully"))

});

const updateUserCoverImage = asynchandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    //TODO: delete old image - assignment


    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on avatar")
        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponce(200, user, "Cover image updated successfully")
    )
})

const getUserChannelProfile=asynchandler(async(req,res)=>{
    const {username}= req.params
    if(!username?.trim()){
        throw new ApiError(400, "username is missing")
    }

    const chanel= await User.aggregate([
        {
            $match:{
                username:username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"Subscription",
                localField:"_id",
                foreignField:"channel",
                to:"subscribers"
            }
        },
        {
            $lookup:{
                from:"Subscription",
                localField:"_id",
                foreignField:"subscriber",
                to:"subscribedTo"
            }
        },
        {
            $addFields:{
                $subscriberCount:{
                    $size:"subscribers"
                },
                channelSubscribedToCount:{
                    $size:"subscribedTo"
                },
                isSubscribed:{
                     $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1

            }
        }
    ])
    if(!channel?.length){
        throw new ApiError(404, "channel does not exists")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
    )
})
const getWatchHistory = asyncHandler(async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )
})

export {userRegister,loginUser,logoutUser,
    refreshAccessToken,
     changePassword,
  getCurrentUser,
  updateAccountDetail,
  updateUserCoverImage,
   updateUserAvtar,
   getUserChannelProfile
}