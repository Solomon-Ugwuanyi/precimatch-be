const jwt = require("jsonwebtoken");
const TalentSchema = require('./schema')

const authenticate = async (user) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1 week",
    });
    const refreshToken = jwt.sign(
        { _id: user._id },
        process.env.REFRESH_JWT_KEY,
        {
            expiresIn: "1 week",
        }
    );

    user.refresh_tokens = user.refresh_tokens.concat(refreshToken);
    await TalentSchema.findByIdAndUpdate(
        { _id: user._id },
        { refresh_tokens: user.refresh_tokens }
    );

    return { accessToken: token, refreshToken };
};

module.exports = { authenticate };
