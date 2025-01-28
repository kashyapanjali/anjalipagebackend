/** @format */

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	profilePic: {
		type: String,
		required: false, 
	},

	skills: {
		frontend: { type: [String], required: true }, 
		backend: { type: [String], required: true }, 
		database: { type: [String], required: true }, 
		tools: { type: [String], required: true }, 
	},

	certificates: [
		{
			category: {
				type: String,
				enum: ["Internship", "Course", "Completion"],
				required: true,
			}, // Type of certificate
			link: { type: String, required: false }, 
		},
	],
});

module.exports = mongoose.model("User", UserSchema);
