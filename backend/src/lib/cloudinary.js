import {v2 as cloudinary} from 'cloudinary';

import{ config} from 'dotenv';
config({ path: './src/.env' });  // Load environment variables

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//     secure: true
// });
// export const uploadToCloudinary = async (base64Image) => {
//     try {
//       const result = await cloudinary.uploader.upload(base64Image, {
//         resource_type: "auto",
//         folder: "chat-app"
//       });
//       return result.secure_url;
//     } catch (error) {
//       console.error("Error uploading to cloudinary:", error);
//       throw new Error("Could not upload image");
//     });

// export default cloudinary;




cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (base64Image) => {
    try {
      const result = await cloudinary.uploader.upload(base64Image, {
        resource_type: "auto",
        folder: "chat-app"
      });
      return result.secure_url;
    } catch (error) {
      console.error("Error uploading to cloudinary:", error);
      throw new Error("Could not upload image");
    }
  };

export default cloudinary;