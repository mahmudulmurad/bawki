const router = require("express").Router()
const Conversation = require("../models/conversationModel")
const auth = require('../auth/auth')
const User = require("../models/userModel")


// create conversation
router.post('/createConversation', auth, async (req, res) => {
  try {
    const { receiverId } = req.body
    let isExists = await Conversation.find({ members: { $in: [receiverId] } })

    if (isExists.length > 0) {

      res.status(403).json({
        status: false,
        error: 'conversation already exists'
      })

    }
    else {

      const shakeHand = await new Conversation({
        members: [req.user._id, receiverId]
      })

      await shakeHand.save()

      await User.findOneAndUpdate({ _id: receiverId },
        { $addToSet: { friends: req.user._id } }, { new: true }).exec()

      await User.findOneAndUpdate({ _id: req.user._id },
        { $addToSet: { friends: receiverId } }, { new: true }).exec()
      res.status(201).json(shakeHand)
    }

  } catch (error) {
    res.status(500).json(error.message)
  }
})

// get user conversation
router.get("/conversation/:userId", auth, async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router