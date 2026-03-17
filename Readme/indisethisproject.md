Authentication (Signup/Login) ✅
Video Upload ✅
Fetch All Videos (Feed) ✅
Get Video By ID (Watch Page) ✅
Like / Unlike System ✅
Comment System ✅
Subscribe / Unsubscribe System ✅
Subscriber Count ✅












when a user open a video backend provides 
Video
Title
Description
Channel
Subscriber Count
Likes
Views
Comments
Subscribe Button








for downlod the Pdf we use ====npm install pdfkit  this is pakage which hep to downlod the pdf or json data to the pdf 





Video Upload
     ↓
Extract Audio
     ↓
Speech-to-Text (Whisper)
     ↓
Generate Transcript
     ↓
Save in MongoDB
     ↓
AI can answer video doubts




for extract the audio from video we implement this 
We need FFmpeg to extract audio from video.

Install FFmpeg   [[] lecture.mp4  →  lecture.mp3]





we introduced rag 
Video Upload
     ↓
Transcript
     ↓
Split into chunks
     ↓
Generate embeddings
     ↓
Store in database
     ↓
Student question
     ↓
Vector search
     ↓
Relevant chunk
     ↓
AI answer