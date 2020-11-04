const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const ProjectSchema = new Schema({

    projectName: {
        type: String,
        required: true
    },

    projectDescription: {
        type: String,
        required: true
    },

    projectImageUrl: {
        type: String,
        required: true
    },

    projectUrl: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Project", ProjectSchema)