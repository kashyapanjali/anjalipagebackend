const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isResume = file.fieldname === "resume";
    const filenameWithoutExt = file.originalname.replace(/\.[^/.]+$/, "");
    return {
      folder: isResume ? "resumes" : "profile_pictures",
      resource_type: isResume ? "auto" : "image",
      format: isResume ? undefined : "png",
      public_id: `${Date.now()}-${filenameWithoutExt}`,
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
