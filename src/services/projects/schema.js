const { Schema, model } = require("mongoose")
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
    },

    talentID: {
        type: Schema.Types.ObjectId,
        ref: 'talent',
        required: true

    }
}, { timestamp: true })

const ProjectModel = model("project", ProjectSchema)
module.exports = ProjectModel;
