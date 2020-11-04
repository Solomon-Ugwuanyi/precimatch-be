const express = require("express")
const q2m = require("query-to-mongo")

const ProjectSchema = require("./schema")

const projectsRouter = express.Router()

projectsRouter.get("/", async (req, res, next) => {



    try {
        const projects = await ProjectSchema.find(req.query)
        res.send(projects)
    } catch (error) {
        next(error)
    }
})

projectsRouter.get("/:id", async (req, res, next) => {
    try {
        const id = req.params.id
        const talent = await ProjectSchema.findById(id)
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

projectsRouter.post("/", async (req, res, next) => {
    try {
        const newtalent = new ProjectSchema(req.body)
        const { _id } = await newtalent.save()

        res.status(201).send(_id)
    } catch (error) {
        next(error)
    }
})

projectsRouter.put("/:id", async (req, res, next) => {
    try {
        const talent = await ProjectSchema.findByIdAndUpdate(req.params.id, req.body)
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
        const talent = await ProjectSchema.findByIdAndDelete(req.params.id)
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
