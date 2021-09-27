const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Posts");

// CREATE NEW POST
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);

    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(error);
    }
});

// UPDATE POST
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post.username === req.body.username) {
            try {
                const updatedPost = await Post.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: req.body,
                    },
                    { new: true }
                );

                res.status(200).json(updatedPost);
            } catch (error) {
                res.status(500).json(error);
            }
        } else {
            res.status(401).json("You can update only your post!");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// DELETE POST
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post.username === req.body.username) {
            try {
                await post.delete();
                res.status(200).json("Post has been deleted");
            } catch (error) {
                res.status(500).json(error);
            }
        } else {
            res.status(401).json("You can update delete your post!");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET A SINGLE POST
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // enviando apenas infos nao sensiveis
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET ALL POSTS
router.get("/", async (req, res) => {
    // checando a query colocada
    const username = req.query.user;
    const catName = req.query.cat;

    try {
        let posts;
        if (username) {
            // se tem username na query
            posts = await Post.find({ username: username });
        } else if (catName) {
            // se tem category na query
            posts = await Post.find({
                categories: {
                    $in: [catName],
                },
            });
        } else {
            // se nao tem query, retorna tudo
            posts = await Post.find();
        }

        // enviando apenas infos nao sensiveis
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
