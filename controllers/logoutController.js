const User = require('../model/User');

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken.

    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(204); // No Content
    }
    const refreshToken = cookies.jwt;

    // Is refreshToken in db.
    const foundUser =  await User.findOne({ refreshToken }).exec();;
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: true, secure: true });
        return res.sendStatus(204);
    }
    // Delete the refresh token in db
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, sameSite: true, secure: true }); // secure: true - only servers on https
    res.sendStatus(204);
}

module.exports = { handleLogout };