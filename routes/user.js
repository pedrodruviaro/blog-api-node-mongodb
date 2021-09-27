const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Post = require("../models/Posts");

// UPDATE
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id) {
        // caso seja alteracao de senha
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    // altera tudo que vem na requisicao
                    $set: req.body,
                },
                { new: true }
            ); //faz o update e devolve o novo usario, para podermos mostrar na ui

            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(401).json("You can update only your account");
    }
});

// DELETE USER and POSTS by the user
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            !user && res.status(404).json("User not found");

            // deletando todos os posts feitos pelo usuario
            await Post.deleteMany({ username: user.username });

            try {
                await User.findByIdAndDelete(req.params.id);

                res.status(200).json("User has been deleted");
            } catch (error) {
                res.status(500).json(error);
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        res.status(401).json("You can delete only your account");
    }
});

// GET ONE USER
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        // enviando apenas infos nao sensiveis
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
