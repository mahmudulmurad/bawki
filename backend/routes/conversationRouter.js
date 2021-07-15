const router = require("express").Router()
const Conversation = require("../models/conversationModel")
const auth = require('../auth/auth')

// create conversation
router.post('/createConversation', auth, async (req, res) => {
    try {
        const shakeHand = await new Conversation({
            members: [req.user._id, req.body.receiverId]
        })
        await shakeHand.save()
        res.status(201).json(shakeHand)
    } catch (error) {
        res.status(500).json(error.message)
    }
})

// get user conversation
router.get("/conversation/:userId",auth, async (req, res) => {
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