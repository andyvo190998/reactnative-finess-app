import mongoose from "mongoose"


const User = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        membership: { type: String, default: 'Free Trial' },
        trialStartDate: { type: Date, default: Date.now },
        trialEndDate: {
            type: Date,
            default: function () {
                // Calculate trial end date as 14 days from trial start date
                const endDate = new Date(this.trialStartDate);
                endDate.setDate(endDate.getDate() + 14);
                return endDate;
            }
        }
    },
    { collection: 'user-data' }
)

const model = mongoose.model('UserData', User)

export default model