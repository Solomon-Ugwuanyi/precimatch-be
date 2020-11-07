const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const TalentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    linkedinUrl: {
        type: String,
        required: true,
    },
    githubUrl: {
        type: String,
        required: true,
    },
    headline: {
        type: String,
        required: true,
    },
    aboutMe: {
        type: String,
        required: true,
    },
    techStack: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate: {
            validator: async (value) => {
                if (!v.isEmail(value)) {
                    throw new Error("Email is invalid")
                } else {
                    const checkEmail = await TalentSchema.findOne({ email: value })
                    if (checkEmail) {
                        throw new Error("Email already exists!")
                    }
                }
            },
        },
    },
    phone: {
        type: Number,
    },
    professions: Array,
})

module.exports = mongoose.model("Talent", TalentSchema)
