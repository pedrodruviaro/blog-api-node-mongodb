const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// register
router.post("/register", async (req, res) => {
    try {
        // bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
        });

        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});

// login
router.post("/login", async (req, res) => {
    try {
        //checando se username existe
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(400).json("Wrong credentials!");

        //se username existe, compara a senha
        const validate = await bcrypt.compare(req.body.password, user.password);
        !validate && res.status(400).json("Wrong credentials!");

        // everything is ok : manda tudo MENOS a senha
        const { password, ...other } = user._doc;
        res.status(200).json(other);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
