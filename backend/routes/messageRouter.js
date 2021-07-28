const router = require("express").Router()
const Message = require("../models/messageModel");
const auth = require('../auth/auth')

//creatre message
router.post('/message', auth, async (req, res) => {
    try {
        let data = {
            "conversationId": req.body.conversationId,
            "sender": req.user._id,
            "text": req.body.text
        }
        console.log(data)
        const newMessage = await new Message(data)
        await newMessage.save()
        res.status(201).json(newMessage)

    } catch (error) {
        res.status(500).json(error.message)
    }
})

//get message of a conversation
router.get('/getmessages/:conId', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conId
        })
        res.status(200).json(messages)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = router