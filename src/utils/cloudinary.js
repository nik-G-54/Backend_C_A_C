import {v2 as clodinary} from 'clodinary'


cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_URL, 
  api_key:process.env.API_Key, 
  api_secret:process.env.API_Secret
});