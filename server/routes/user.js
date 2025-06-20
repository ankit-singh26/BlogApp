const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

router.get("/:id/follow-data", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("followers", "name _id")
      .populate("following", "name _id");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      followers: user.followers,
      following: user.following,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password"); // don't send password

    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ author: userId }).sort({ timestamp: -1 });

    res.json({ user, posts });
  } catch (err) {
    console.error("User fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/:userId/follow", auth, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user.id;

    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: "You cannot follow yourself." });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!targetUser.followers.includes(currentUserId)) {
      targetUser.followers.push(currentUserId);
      currentUser.following.push(targetUserId);
      await targetUser.save();
      await currentUser.save();
    }

    res.json({ message: "Followed successfully." });
  } catch (err) {
    console.error("Follow error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:userId/unfollow", auth, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user.id;

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId
    );
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUserId
    );

    await targetUser.save();
    await currentUser.save();

    res.json({ message: "Unfollowed successfully." });
  } catch (err) {
    console.error("Unfollow error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:userId/is-following", auth, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user.id;

    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const isFollowing = targetUser.followers.includes(currentUserId);

    res.json({ isFollowing });
  } catch (err) {
    console.error("Check follow status error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
