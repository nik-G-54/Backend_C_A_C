import { GoogleGenerativeAI } from "@google/generative-ai";

export const genAI= new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const generateAIResponse= async(question)=>{
       const model=genAI.getGenerativeModel({
          model: "gemini-1.5-flash"
       })


       const result= await model.generateContent(question)
       const responce= result.response

       return responce.text()
}