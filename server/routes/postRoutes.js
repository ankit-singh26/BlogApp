const express = require('express')
const auth = require('../middleware/auth')
const Post = require('../models/Post')
const router = express.Router()
const upload = require("../middleware/cloudinary.js");

router.post("/create", auth, upload.single("thumbnail"), async (req, res) => {
  const { title, body, tags } = req.body;
  const thumbnail = req.file ? req.file.path : "";

  try {
    const newPost = new Post({
      title,
      body,
      tags,
      thumbnail,
      author: req.user.id,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/all', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name email');

    const total = await Post.countDocuments();

    res.status(200).json({ posts, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/:slug', async (req, res) => {
    try {
        const post = await Post.findOne({slug: req.params.slug}).populate('author', 'name email')
        if(!post) {
            return res.status(404).json({message: "Post not found"})
        }
        return res.status(200).json({post})
    } catch (err) {
        return res.status(500).json({message: "Error getting post"})
    }
})

router.put("/:slug", auth, async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const { title, body, tags } = req.body;
    post.title = title || post.title;
    post.body = body || post.body;
    post.tags = tags || post.tags;

    const updated = await post.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating post" });
  }
});

router.delete("/:slug", auth, async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

module.exports = router;