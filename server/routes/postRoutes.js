const express = require('express')
const auth = require('../middleware/auth')
const Post = require('../models/Post')
const router = express.Router()
const upload = require("../middleware/cloudinary.js");

router.post("/create", auth, upload.single("thumbnail"), async (req, res) => {
  try {
    const { title, body } = req.body;

    // ✅ Safe parsing of tags
    let tags = [];
    try {
      tags = JSON.parse(req.body.tags);
      if (!Array.isArray(tags)) throw new Error("Tags must be an array");
    } catch (err) {
      return res.status(400).json({ message: "Invalid tags format" });
    }

    const thumbnail = req.file ? req.file.path : "";

    const newPost = new Post({
      title,
      body,
      author: req.user.id,
      thumbnail,
      tags,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error("POST CREATE ERROR:", err); // ✅ Debug log
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const tag = req.query.tag;

    const filter = tag ? { tags: tag } : {};

    const posts = await Post.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name email');

    const total = await Post.countDocuments(filter);

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

router.patch('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.user.id;

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const alreadyLiked = post.likedBy.includes(userId);

    if (alreadyLiked) {
      post.likes -= 1;
      post.likedBy = post.likedBy.filter(id => id.toString() !== userId);
    } else {
      post.likes += 1;
      post.likedBy.push(userId);
    }

    await post.save();
    res.status(200).json({ likes: post.likes, likedBy: post.likedBy });
  } catch (err) {
    res.status(500).json({ message: 'Error toggling like', error: err.message });
  }
});

// GET /api/posts/tags/all
router.get("/tags/all", async (req, res) => {
  try {
    const tags = await Post.distinct("tags");
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tags" });
  }
});

// routes/postRoutes.js
router.get("/user/:id", async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.id }).sort({ timestamp: -1 })
                            .populate('author', 'name');
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user posts" });
  }
});


module.exports = router;