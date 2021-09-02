const router = require("express").Router()
const Message = require("../models/messageModel");
const auth = require('../auth/auth')
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    var filetype = '';
    if (file.mimetype === 'image/gif') {
      filetype = 'gif';
    }
    if (file.mimetype === 'image/png') {
      filetype = 'png';
    }
    if (file.mimetype === 'image/jpeg') {
      filetype = 'jpg';
    }
    if (file.mimetype === 'image/jpeg') {
      filetype = 'jpeg';
    }
    cb(null, 'image-' + Date.now() + '.' + filetype);
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 15
  }
});

//creatre message
router.post('/message', upload.single('messageImage'), auth, async (req, res) => {
  try {
    let data

    if (!req.file && !req.body.text) {
      res.status(204).json('not accepted')
    }

    else {
      if (req.file && req.body.text) {
        data = {
          "conversationId": req.body.conversationId,
          "sender": req.user._id,
          "text": req.body.text,
          "messageImage": req.file.path
        }
      }
      else if (!req.file && req.body.text) {
        data = {
          "conversationId": req.body.conversationId,
          "sender": req.user._id,
          "text": req.body.text
        }
      }
      else if (req.file && !req.body.text) {
        data = {
          "conversationId": req.body.conversationId,
          "sender": req.user._id,
          "messageImage": req.file.path
        }
      }

      const newMessage = await new Message(data)
      await newMessage.save()
      res.status(201).json(newMessage)

    }
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