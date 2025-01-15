/** @format */

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	profilePic: {
		type: String,
		required: false, // URL or path of the profile picture
	},
	projects: [
		{
			category: {
				type: String,
				enum: ["Ongoing", "completed"],
				required: true,
			}, // Type of certificate
			title: { type: String, required: true }, // e.g., "Docify"
			link: { type: String, required: false },
			description: { type: String, required: true }, // Details about the project
		},
	],

	skills: {
		frontend: { type: [String], required: true }, // e.g., ["HTML", "CSS", "JavaScript", "React"]
		backend: { type: [String], required: true }, // e.g., ["Node.js", "Express"]
		database: { type: [String], required: true }, // e.g., ["MySQL", "PostgreSQL"]
		tools: { type: [String], required: true }, // e.g., ["Git", "Figma", "Postman"]
	},

	certificates: [
		{
			category: {
				type: String,
				enum: ["Internship", "Course", "Completion"],
				required: true,
			}, // Type of certificate
			link: { type: String, required: false }, // Optional: URL to view/download the certificate
		},
	],
});

module.exports = mongoose.model("User", UserSchema);
