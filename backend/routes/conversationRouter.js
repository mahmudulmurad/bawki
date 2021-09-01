const router = require("express").Router()
const Conversation = require("../models/conversationModel")
const auth = require('../auth/auth')
const User = require("../models/userModel")
const Message = require('../models/messageModel');

// create conversation
router.post('/createConversation', auth, async (req, res) => {
  try {
    const { receiverId } = req.body
    const conversation = await Conversation.where('members', [receiverId, req.user._id])

    if (conversation.length > 0) {
      res.status(403).send('Already conversation is created with this user')
    } else {
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
    const chat = await Message.find()
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get user chat
router.get("/chat/:userId", auth, async (req, res) => {
  try {
    let myChat = []
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });

    for (let i = 0; i < conversation.length; i++) {
      const chat = await Message.findOne({ conversationId: conversation[i]._id })
      if (chat) {
        myChat.push(conversation[i])
      }
    }
    res.status(200).json(myChat);

  } catch (err) {
    res.status(500).json(err);
  }
});

// get single conversation
router.get('/findSingleConversation/:receiverId', auth, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({members : [req.user._id,req.params.receiverId]})
    if(conversation) {
      res.status(200).json(conversation)
    }
    else{
    const conversation2 = await Conversation.findOne({members : [req.params.receiverId,req.user._id]})
      res.status(200).json(conversation2)
    } 
  } catch (error) {
    res.status(500).json(error.message)
  }
})

module.exports = router