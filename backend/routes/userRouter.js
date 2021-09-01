const router = require("express").Router()
const User = require("../models/userModel")
const auth = require("../auth/auth")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Conversation = require('../models/conversationModel')

router.post("/register", async (req, res) => {
    try {

        //generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        //save user and respond
        const user = await newUser.save();
        res.status(200).json(user);

    } catch (err) {
        console.log(err.message);
        res.status(500).json(err)
    }
});

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json("user not found")

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("wrong password")

        // Generate JWT token
        const token = await jwt.sign(
            { _id: user._id, name: user.username },
            process.env.JWT_SECRET, { expiresIn: '1d' })

        res.status(200).json({
            user,
            token
        })
    } catch (err) {
        res.status(500).json(err.message)
    }
})

//me
router.get('/me', auth, async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.user._id }, {
            updatedAt: 0,
            createdAt: 0
        }).populate("friends", "username email")
            .exec()
        res.send(user)
    } catch (error) {
        res.status(500).send(error.message)
    }

})

// make friends
router.put("/:id/friend", auth, async (req, res) => {
    if (req.user._id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.user._id)

            if (!currentUser.friends.includes(user._id)) {

                await user.updateOne({ $push: { friends: req.user._id } })
                await currentUser.updateOne({ $push: { friends: req.params.id } })
                res.status(200).json("you both are now friend")

            } else {
                res.status(403).json("you both are friend already")
            }

        } catch (err) {
            res.status(500).json(err.message)
        }
    } else {
        res.status(403).json("you cant follow yourself")
    }
})
//get a user 
router.get('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).exec()
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error.message)
    }
})
//get friends
router.get("/myFriends/my", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        const friends = await Promise.all(
            user.friends.map((friendId) => {
                return User.findById(friendId)
            })
        )
        let friendList = [];
        friends.map((friend) => {
            const { _id, username, email } = friend
            friendList.push({ _id, username, email })
        });
        res.status(200).json(friendList)
    } catch (err) {
        res.status(500).json(err.message)
    }
})

// all users
router.get("/all/users", auth, async (req, res) => {
    try {
        let oldfriends = await Conversation.find({
            members: { $in: [req.user._id] }
        }, {
            _id: 0,
            members: 1
        })

        oldfriends.map(one => one.members.splice(one.members.indexOf(req.user._id), 1))

        let user = await User.find({ _id: { $ne: req.user._id } })

        const getNonfriends = (one) => {
            user = user.filter(item => !one.members.includes(item._id))
            return user;
        }
        await oldfriends.map(getNonfriends)

        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err.message)
    }
})

module.exports = router