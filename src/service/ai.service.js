// // import { GoogleGenerativeAI } from "@google/generative-ai";

// // export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // export const generateAIResponse = async (question) => {
// //     // 1. Setup the Router (Using the PREVIEW version which is currently free)
// //     // Note: If '3.1-flash-lite' fails, we use 'gemini-1.5-flash' as a safe backup.
// //     const routerModel = genAI.getGenerativeModel({ 
// //         model: "gemini-3.1-flash-lite-preview" // Added '-preview'
// //     });

// //     const classificationPrompt = `
// //         Classify this user query into one of two categories: "BASIC" or "ADVANCED".
// //         Query: "${question}"
// //         Return ONLY the word BASIC or ADVANCED.
// //     `;

// //     try {
// //         const classificationResult = await routerModel.generateContent(classificationPrompt);
// //         const category = classificationResult.response.text().trim().toUpperCase();

// //         // 2. Select the model
// //         // Make sure to include the '-preview' suffix for the newest models
// //         const targetModelName = (category === "ADVANCED") 
// //             ? "gemini-3-flash-preview" 
// //             : "gemini-3.1-flash-lite-preview";

// //         console.log(`Routing to: ${targetModelName}`);

// //         const finalModel = genAI.getGenerativeModel({ model: targetModelName });
// //         const result = await finalModel.generateContent(question);
// //         return result.response.text();

// //     } catch (error) {
// //         console.error("AI Routing Error:", error);
        
// //         // 3. EMERGENCY FALLBACK
// //         // If the 3.x models are busy or names changed, use the stable 1.5
// //         const fallbackModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// //         const result = await fallbackModel.generateContent(question);
// //         return result.response.text();
// //     }
// // }


// import { GoogleGenerativeAI } from "@google/generative-ai";

// export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export const generateAIResponse = async (question) => {
//     // 1. Setup the Router (Using the active 2026 free-tier model)
//     const routerModel = genAI.getGenerativeModel({ 
//         model: "gemini-3.1-flash-lite-preview" 
//     });

//     const classificationPrompt = `
//         Classify this user query into one of two categories: "BASIC" or "ADVANCED".
//         Query: "${question}"
//         Return ONLY the word BASIC or ADVANCED.
//     `;

//     try {
//         const classificationResult = await routerModel.generateContent(classificationPrompt);
//         const category = classificationResult.response.text().trim().toUpperCase();

//         // 2. Use 2026 Production Model IDs
//         // Use 'gemini-3-flash-preview' for Advanced and 'gemini-3.1-flash-lite-preview' for Basic
//         const targetModelName = (category === "ADVANCED") 
//             ? "gemini-3-flash-preview" 
//             : "gemini-3.1-flash-lite-preview";

//         console.log(`Routing request to: ${targetModelName}`);

//         const finalModel = genAI.getGenerativeModel({ model: targetModelName });
//         const result = await finalModel.generateContent(question);
//         return result.response.text();

//     } catch (error) {
//         console.error("AI Routing Error:", error);
        
//         // 3. SECURE FALLBACK (Using Gemini 2.5 Flash, which is the 2026 stable "old" version)
//         // Note: 'gemini-1.5-flash' is deleted; use 'gemini-2.5-flash' instead.
//         const fallbackModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
//         const result = await fallbackModel.generateContent(question);
//         return result.response.text();
//     }
// }



import Groq from "groq-sdk"

const groq = new Groq({
    apiKey:process.env.GROQ_API_KEY
})

export const generateAIResponse = async (question) => {

    const completion = await groq.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        messages: [
            {
                role: "system",
                content: "You are a helpful learning assistant that explains programming concepts clearly."
            },
            {
                role: "user",
                content: question
            }
        ]
    })

    return completion.choices[0].message.content
}