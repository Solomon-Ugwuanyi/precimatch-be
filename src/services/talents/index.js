const express = require("express")
const q2m = require("query-to-mongo")
const passport= require('passport')
const TalentSchema = require("./schema")
const ProjectModel = require("../projects/schema")
const talentsRouter = express.Router()
const jwt = require("jsonwebtoken");
const {authenticate} = require('./helpers')
require("dotenv").config();
talentsRouter.get("/", async (req, res, next) => {



    try {
        const talents = await TalentSchema.find(req.query)
        res.send(talents)
    } catch (error) {
        next(error)
    }
})

talentsRouter.route("/me").get(
    //passport.authenticate("jwt", { session: false }),
    async (req, res, next) => {

        passport.authenticate("jwt", { session: false }, async function (
            err,
            user,
            info
        ) {
            // console.log(err);
            // console.log(user);
            // console.log(info);
            if (err) {
                console.log("err", err);
                return next(err);
            }
            if (!user) {
                return res.status(404).send("no user");
            } else {
                try {
                    //console.log(user)
                    const talent = await TalentSchema.findById(user._id)
                    console.log(talent)
                    if (talent) {
                        res.send(talent)
                    } else {
                        const error = new Error(`talent with id ${req.params.id} not found`)
                        error.httpStatusCode = 404
                        next(error)
                    }

                } catch (e) {
                    console.log(e);
                    const error = new Error();
                    error.httpStatusCode = 404;
                    return next(error);
                }
            }
        })(req, res, next);
     }

);
talentsRouter.route("/refreshToken").post(async (req, res, next) => {
    console.log(req.cookies);
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_KEY);
            const user = await talentsRouter.findById(decoded._id);
            if (!user) {
                console.log("no user");

                res.status(401).send("no user");
            } else {
                const currentToken = user.refresh_tokens.find(
                    (token) => token === refreshToken
                );
                if (!currentToken) {
                    console.log("no token");
                    res.status(401).send("no token");
                } else {
                    user.refresh_tokens = user.refresh_tokens.filter(
                        (t) => t !== currentToken
                    );
                    const { accessToken, refreshToken } = authenticate(user);
                    res.cookie("accessToken", accessToken, {
                        //path: "/",
                        // secure: true,
                        // httpOnly: true,
                        // sameSite: "none",
                    });

                    res.cookie("refreshToken", refreshToken, {
                        //path: "/",
                        // secure: true,
                        // httpOnly: true,
                        // sameSite: "none",
                    });
                    res.send({
                        refreshToken,
                        accessToken,
                    });
                }
            }
        } else {
            console.log("catch");
            const error = new Error("no token");
            error.httpStatusCode = 500;
            next(error);
        }
    } catch (e) {
        res.status(500).send(e);
    }
});


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

talentsRouter.post('/login', async (req, res, next) => {
    try{
        passport.authenticate(
            "local",
            { session: false },
            async (err, user, info) => {
                if (err || !user) {
                    return res.status(404).json({
                        ...info,
                    });
                }
                req.login(user, { session: false }, async (err) => {
                    if (err) {
                        res.status(500).send(err);
                    }
                    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
                        expiresIn: "1 week",
                    });
                    const refreshToken = jwt.sign(
                        { id: user.id },
                        process.env.REFRESH_JWT_KEY,
                        {
                            expiresIn: "1 week",
                        }
                    );
                    user.refresh_tokens = user.refresh_tokens.concat(refreshToken);
                    console.log(user);
                    await TalentSchema.findOneAndUpdate(
                        { _id: user._id },
                        { refresh_tokens: user.refresh_tokens }
                    )
                    res.cookie("accessToken", token, {
                        path: "/",
                        // secure: true,
                        // httpOnly: true,
                        // sameSite: "none",
                    });

                    res.cookie("refreshToken", refreshToken, {
                        path: "/",
                        // secure: true,
                        // httpOnly: true,
                        // sameSite: "none",
                    });

                    return res.json({
                        refreshToken,
                        accessToken: token,
                    });
                });
            }
        )(req, res, next);
    }catch (e) {
        next(e)
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

talentsRouter.put("/:id",  async (req, res, next) => {

    passport.authenticate("jwt", { session: false }, async function (
        err,
        user,
        info
    ) {
        // console.log(err);
        // console.log(user);
        // console.log(info);
        if (err) {
            console.log("err", err);
            return next(err);
        }
        if (!user) {
            return res.status(404).send("no user");
        } else {
            try {
                //console.log(user)
                    const talent = await TalentSchema.findByIdAndUpdate(user._id, req.body)
                    //console.log(talent)
                    if (talent) {
                        res.send("Data Updated")
                    } else {
                        const error = new Error(`talent with id ${req.params.id} not found`)
                        error.httpStatusCode = 404
                        next(error)
                    }

            } catch (e) {
                console.log(e);
                const error = new Error();
                error.httpStatusCode = 404;
                return next(error);
            }
        }
    })(req, res, next);
}



)

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
