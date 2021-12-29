import { Router } from "express";
import authorization from "../middlewares/auth";
import cloudinary from "cloudinary";
const cloudMedia = cloudinary.v2;
const galleryRouter = Router();

const baseUrl = process.env.CLOUDINARY_URL;
galleryRouter.post("/upload", authorization, async (req, res) => {
  try {
    const fileStr = req.body.data;
    const { title, fileName } = req.body;
    const uploadImageResponse = await cloudMedia.uploader.upload(fileStr, {
      use_filename: true,
      public_id: `${title}/${fileName}`,
    });
    const cloudinaryPublicId = uploadImageResponse.public_id;
    const cloudinarySecureId = uploadImageResponse.secure_url;
    res.send({ cloudinaryPublicId, cloudinarySecureId });
  } catch (error) {
    console.log(error);
  }
});

export default galleryRouter;
