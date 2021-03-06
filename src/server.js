const express = require("express")
const cors = require("cors")
const { join } = require("path")
const listEndpoints = require("express-list-endpoints")
const mongoose = require("mongoose")

const passport = require("passport");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const pass = require('./passport')
const projectsRouter = require("./services/projects")
const talentsRouter = require("./services/talents")

const {
    notFoundHandler,
    badRequestHandler,
    genericErrorHandler,
} = require("./errorHandlers")

const server = express()

const port = process.env.PORT

const staticFolderPath = join(__dirname, "../public")
server.use(express.static(staticFolderPath))
server.use(express.json())
server.use(cookieParser())
const whitelist = ["http://localhost:3000"]
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
server.use(cors(corsOptions))

server.use("/projects", projectsRouter)
server.use("/talents", talentsRouter)

// ERROR HANDLERS MIDDLEWARES

server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.log(listEndpoints(server))

mongoose
    .connect("mongodb://localhost:27017/precimatch", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(
        server.listen(port, () => {
            console.log("Running on port", port)
        })
    )
    .catch((err) => console.log(err))
