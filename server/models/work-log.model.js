import mongoose from "mongoose";

const WorkLogSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	worked: {
		type: Boolean,
		default: false
	}
});
const model = mongoose.model('WorkLog', WorkLogSchema);

export default model;