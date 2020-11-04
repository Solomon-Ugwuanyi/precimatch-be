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
    headline: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    professions: Array,
})

module.exports = mongoose.model("Talent", TalentSchema)
