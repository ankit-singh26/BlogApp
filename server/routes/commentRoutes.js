const express = require("express");
const router = express.Router();
const Comment = require("../models/Comments");
const auth = require("../middleware/auth");

router.post("/:postId", auth, async (req, res) => {
  const { text, parent } = req.body;
  try {
    const newComment = new Comment({
      user: req.user.id,
      post: req.params.postId,
      text,
      parent: parent || null,
    });

    const saved = await newComment.save();
    const populated = await saved.populate("user", "name email");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Not found" });

    if (comment.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
