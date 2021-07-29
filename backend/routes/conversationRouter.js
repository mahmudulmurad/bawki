const router = require("express").Router()
const Conversation = require("../models/conversationModel")
const auth = require('../auth/auth')
const User = require("../models/userModel")

// create conversation
router.post('/createConversation', auth, async (req, res) => {
    try {
        const { receiverId } = req.body
        const shakeHand = await new Conversation({
            members: [req.user._id, receiverId]
        })

          let otherUser = await User.findOneAndUpdate({ _id: receiverId },
          { $push: { friends: req.user._id } }, { new: true }).exec()

          let otherUser2 = await User.findOneAndUpdate({ _id: req.user._id },
            { $push: { friends: receiverId } }, { new: true }).exec()

        await shakeHand.save()
        await otherUser.save()
        await otherUser2.save()

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

// let searchUser = await User.findOneAndUpdate({ _id: searchUserId },
//   { $push: { pendingConnectionRequests: userId } }, { new: true }
// ).exec()
// if (!searchUser) {
//   res.status(500).json({
//       status: false,
//       message: "requesat not sent !"
//   })
//   return
// }
// await User.findOneAndUpdate({ _id: userId },
//   { $push: { sendConnectionRequests: searchUserId } }, { new: true }
// ).exec()