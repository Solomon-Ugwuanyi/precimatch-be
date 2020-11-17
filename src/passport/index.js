const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const TalentSchema = require("../services/talents/schema");



passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        function (email, password, cb) {
            return TalentSchema.findOne({ email }, (err, user) => {
                if (err) return cb(err);
                return user.comparePassword(password, function (err, isMatch) {
                    if (err) return cb(err);
                    if (isMatch)
                        return cb(null, user, { message: "Logged In Successfully" });
                    else
                        return cb(null, false, { message: "Incorrect email or password." });
                });
            });
        }
    )
);

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: function (req) {
                let token = null;
console.log(req.cookies)
                if (req && req.cookies) {
                    token = req.cookies["accessToken"]
                }
                return token;
            },
            secretOrKey: process.env.JWT_SECRET_KEY,
        },
        async function (jwtPayload, cb) {
            console.log("jwtPayload", jwtPayload);

            const user = await TalentSchema.findById(jwtPayload._id )
            console.log(user)
            if (user) {
                return cb(null, user);
            } else {
                return cb(null, false, { message: "unauthorized" })
            }
        }
    )
);