const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, password } = req.body;
    if (!user || !password) {
        return res.status(400).json({ "message": "Username and password are required."});
    }
    // check for duplicate user name in the db
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) {
        return res.sendStatus(409); // conflict;
    }

    try {
        // encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10) // sault rounds
        // create and store store the new user
        const result = await User.create({
            "username": user,
            "password": hashedPassword
        });

        /*const newUser = new User();
        newUser.username = user;
        const result = await newUser.save();*/

        console.log(result);

        res.status(201).json({'success': `New user ${user} created!`});
    } catch (err) {
        res.status(500).json({"message": err.message})
    }

}

module.exports = { handleNewUser };