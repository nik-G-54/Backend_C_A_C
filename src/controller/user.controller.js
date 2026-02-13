import {asynchandler} from "../utils/asynchandller.js";


const userRegister= asynchandler( (req,res)=>{
    console.log("i am here"); 
   
    const {username,email,password}=req.body
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


})

export {userRegister}