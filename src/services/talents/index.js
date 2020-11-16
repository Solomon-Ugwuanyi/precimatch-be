const express = require("express")
const q2m = require("query-to-mongo")

const TalentSchema = require("./schema")
const ProjectModel = require("../projects/schema")
const talentsRouter = express.Router()

talentsRouter.get("/", async (req, res, next) => {



    try {
        const talents = await TalentSchema.find(req.query)
        res.send(talents)
    } catch (error) {
        next(error)
    }
})

talentsRouter.get("/:id", async (req, res, next) => {
    try {
        const id = req.params.id
        const talent = await TalentSchema.findById(id)
        if (talent) {
            res.send(talent)
        } else {
            const error = new Error()
            error.httpStatusCode = 404
            next(error)
        }
    } catch (error) {
        console.log(error)
        next("While reading talents list a problem occurred!")
    }
})

talentsRouter.post("/", async (req, res, next) => {
    try {
        const newtalent = new TalentSchema(req.body)
        const { _id } = await newtalent.save()

        res.status(201).send(_id)
    } catch (error) {
        next(error)
    }
})


talentsRouter.post("/:talentId/projects", async (req, res, next) => {
    try {
        const newProject = new ProjectModel({ ...req.body, talentID: req.params.talentId })
        const addProject = await newProject.save()
        if (addProject) {
            res.status(201).send(newProject._id)

        } else {
            res.status(404).send(`Kindly check the infortmation provided with ${talentId}`)
        }
        //


    } catch (error) {
        next(error)
    }
})

talentsRouter.get("/:talentId/projects", async (req, res, next) => {
    try {
        const talentID = req.params.talentId

        const project = await ProjectModel.find({ talentID })
        res.send(project)
    } catch (error) {
        next(error)
    }
})

talentsRouter.put("/:id", async (req, res, next) => {
    try {
        const talent = await TalentSchema.findByIdAndUpdate(req.params.id, req.body)
        console.log(talent)
        if (talent) {
            res.send("Data Updated")
        } else {
            const error = new Error(`talent with id ${req.params.id} not found`)
            error.httpStatusCode = 404
            next(error)
        }
    } catch (error) {
        next(error)
    }
})

talentsRouter.delete("/:id", async (req, res, next) => {
    try {
        const talent = await TalentSchema.findByIdAndDelete(req.params.id)
        if (talent) {
            res.send("Deleted")
        } else {
            const error = new Error(`talent with id ${req.params.id} not found`)
            error.httpStatusCode = 404
            next(error)
        }
    } catch (error) {
        next(error)
    }
})

module.exports = talentsRouter
