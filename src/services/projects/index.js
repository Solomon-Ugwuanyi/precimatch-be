const express = require("express")
const q2m = require("query-to-mongo")

const ProjectModel = require("./schema")

const projectsRouter = express.Router()

projectsRouter.get("/", async (req, res, next) => {
    try {
        const project = await ProjectModel.find(req.query)
        res.send(project)
    } catch (error) {
        next(error)
    }
})

projectsRouter.get("/:id", async (req, res, next) => {
    try {
        const id = req.params.id
        const talent = await ProjectModel.findById(id)
        if (talent) {
            res.send(talent)
        } else {
            const error = new Error()
            error.httpStatusCode = 404
            next(error)
        }
    } catch (error) {
        console.log(error)
        next("While reading projects list a problem occurred!")
    }
})

projectsRouter.post("/:talentId", async (req, res, next) => {
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

projectsRouter.put("/:id", async (req, res, next) => {
    try {
        const talent = await ProjectModel.findByIdAndUpdate(req.params.id, req.body)
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

projectsRouter.delete("/:id", async (req, res, next) => {
    try {
        const talent = await ProjectModel.findByIdAndDelete(req.params.id)
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

module.exports = projectsRouter
