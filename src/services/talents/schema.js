const { Schema } = require("mongoose")
const mongoose = require("mongoose")
const bcrypt = require ('bcrypt')
const TalentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    password:{
        type:String,
        required:true
    },
    imageUrl: {
        type: String,

    },
    linkedinUrl: {
        type: String,

    },
    githubUrl: {
        type: String,

    },
    headline: {
        type: String,

    },
    aboutMe: {
        type: String,

    },
    techStack: {
        type: String,

    },
    refresh_tokens:{
        type:Array(String)
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        // validate: {
        //     validator: async (value) => {
        //         if (!v.isEmail(value)) {
        //             throw new Error("Email is invalid")
        //         } else {
        //             const checkEmail = await TalentSchema.findOne({ email: value })
        //             if (checkEmail) {
        //                 throw new Error("Email already exists!")
        //             }
        //         }
        //     },
        // },
    },
    phone: {
        type: Number,
    },
    professions: Array,
})
TalentSchema.pre("save", async function preSave(next) {
    const user = this;
    if (!user.isModified("password")) next();

    else {
        try {
            const hash = await bcrypt.hash(user.password, 12);
            user.password = hash;
        } catch (e) {
            next(e);
        }
    }
});

TalentSchema.pre("findOneAndUpdate", async function preUpdate(next) {
    const user = this;
    if (!user._update.password) next();

    else {
        try {
            console.log(this);
            const hash = await bcrypt.hash(user._update.password, 12);
            this.update({ password: hash });
            next();
        } catch (e) {
            next(e);
        }
    }
});



TalentSchema.methods.comparePassword = async function comparePassword(
    candidate,
    callback
) {
    bcrypt.compare(candidate, this.password, function (err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

module.exports = mongoose.model("Talent", TalentSchema)
