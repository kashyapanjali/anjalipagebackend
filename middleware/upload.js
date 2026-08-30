const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const path = require("path");
const fs = require("fs");

// Ensure uploads/resumes directory exists
const resumesDir = path.join(__dirname, "../uploads/resumes");
if (!fs.existsSync(resumesDir)) {
	try {
		fs.mkdirSync(resumesDir, { recursive: true });
	} catch (err) {
		console.error("Error creating resumes directory:", err);
	}
}

// Disk storage for PDF resume uploads
const resumeStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, resumesDir);
	},
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		const filenameWithoutExt = path.basename(file.originalname, ext);
		cb(null, `${Date.now()}-${filenameWithoutExt}${ext}`);
	},
});

// Cloudinary storage setup for profile pictures
const profilePicStorage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: "profile_pictures",
		format: "png",
		public_id: (req, file) => {
			const filenameWithoutExt = file.originalname.replace(/\.[^/.]+$/, "");
			return `${Date.now()}-${filenameWithoutExt}`;
		},
	},
});

const upload = multer({ storage: profilePicStorage });
const uploadResume = multer({ storage: resumeStorage });

module.exports = {
	upload,
	uploadResume,
};
