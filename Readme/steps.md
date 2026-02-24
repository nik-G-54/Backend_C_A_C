1- steps to fallow in logout user 
2- firstly veryfy  the user that user that user is loggedin or not {router.route("loggout").post(veryfyjwt,userloggout)}

3- jwt veryfy the user is loggedin or not isf yes 
4- clear cookes(Access token ) and  clear refresh token from the data base 



Q-- if we uplod on cludinary then in return cloudinary return this 
{
  "asset_id": "1234567890",
  "public_id": "users/abc123-avatar",
  "version": 1700000000,
  "url": "https://res.cloudinary.com/demo/image/upload/v1700000000/users/abc123-avatar.jpg",
  "secure_url": "https://res.cloudinary.com/demo/image/upload/v1700000000/users/abc123-avatar.jpg"
}

so we have to save it as avtar=uploadoncloudinary(localpath)
data save  in this way     

 avtar={
  "asset_id": "1234567890",
  "public_id": "users/abc123-avatar",
  "version": 1700000000,
  "url": "https://res.cloudinary.com/demo/image/upload/v1700000000/users/abc123-avatar.jpg",
  "secure_url": "https://res.cloudinary.com/demo/image/upload/v1700000000/users/abc123-avatar.jpg"
}
so to extract the url we use (avtar.url)
