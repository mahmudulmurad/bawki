import Topbar from '../../components/topbar/topbar'
import './messanger.css'
import Conversation from '../../components/conversation/conversation'
import Message from '../../components/message/message'
import ChatBox from '../../components/chatBox/chatBox'
import OnlineUser from '../../components/onlineusers/onlineUser'
import { AuthContext } from '../../context/authContext'
import { useContext, useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import Allusers from '../../components/allusers/allusers'
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CloseIcon from '@material-ui/icons/Close';

function Messanger() {

    const { user } = useContext(AuthContext)
    const [conversations, setconversations] = useState([])
    const [allUsers, setAllusers] = useState([])
    const [currentchat, setCurrentchat] = useState(null)
    const [messages, setMessages] = useState(null)
    const [newMessage, setNewMessage] = useState("")
    const scrollRef = useRef()
    const socket = useRef()
    const [arraivalmessage, setarraivalmessage] = useState(null)
    const [onlineusers, setOnlineUsers] = useState([])
    const [chatbar, setChatbar] = useState([])
    const clickRef = useRef()
    const [popup, setPopup] = useState(false)
    const [friend, setFriend] = useState({})
    let [chatNumber, setChatNumber] = useState(0)
    const [chatList, setChatList] = useState(false)
    const [image, setImage] = useState({})
    const [previewLink, setPreviewLink] = useState(null)
    const [chatChange, setChatchange] = useState(false)
    const [previousChats, setPreviousChats] = useState(false)
    const [previousConverstation, setPreviousConversation] = useState([])
    const [allChats, setAllChats] = useState(true)
    const [activeChats, setActiveChats] = useState(false)



    useEffect(() => {
        socket.current = io(process.env.REACT_APP_WEB_SOCKET)
        socket.current.on("getMessage", (data) => {
            const { messageImage, senderId, text } = data
            console.log(data, 'messageasche from server');
            if (!messageImage && !text) {
                console.log('invalid message');
            } else {

                if (messageImage) {
                    setarraivalmessage({
                        sender: senderId,
                        text: text,
                        messageImage: messageImage,
                        createdAt: Date.now()
                    })
                }
                else {
                    setarraivalmessage({
                        sender: senderId,
                        text: text,
                        createdAt: Date.now()
                    })
                }
            }


        })
    }, [])

    useEffect(() => {
        arraivalmessage &&
            currentchat?.members.includes(arraivalmessage.sender) &&
            setMessages((prev) => [...prev, arraivalmessage])
    }, [arraivalmessage, currentchat])

    useEffect(() => {
        socket.current.emit("addUser", user._id)
        socket.current.on("getUsers", users => {
            setOnlineUsers(user.friends.filter((f) => users.some((u) => u.userId === f._id)))
        })
    }, [user])
    const conversationChange = () => {
        setChatchange(!chatChange)
    }

    const getConversations = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/conversation/${user._id}`,
                {
                    headers: {
                        "Content-type": "application/json;charset=UTF-8",
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    }
                });
            setconversations(res.data)
        } catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        getConversations()
    }, [user._id, chatChange]);

    const getAlluser = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/all/users`,
                {
                    headers: {
                        "Content-type": "application/json;charset=UTF-8",
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    }
                })
            setAllusers(res.data)
        } catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        getAlluser()
    }, [user._id, chatChange]);


    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/getmessages/${currentchat?._id}`,
                    {
                        headers: {
                            "Content-type": "application/json;charset=UTF-8",
                            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                        }
                    })
                setMessages(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        getMessages()
    }, [currentchat])

    const sendMessage = async (e) => {
        e.preventDefault()
        var formData = new FormData();

        if (image) {
            formData.append('messageImage', image)
        }
        if (image && newMessage) {
            formData.append('text', newMessage)
            formData.append('conversationId', currentchat?._id)
        }
        else if (!image && newMessage) {
            formData.append('text', newMessage)
            formData.append('conversationId', currentchat?._id)
        }
        else if (image && !newMessage) {
            formData.append('conversationId', currentchat?._id)
        }

        const receiverId = currentchat.members.find(
            (member) => member !== user._id
        )

        try {
            var res = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/message`, formData,
                {
                    headers: {
                        "Content-type": "application/json;charset=UTF-8",
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    }
                });
            if (res.status === 201) {
                setMessages([...messages, res.data])
            }
            setNewMessage("")
            setPreviewLink(null)
            setImage(null)
        } catch (err) {
            console.log(err);
        }
        if (res.status === 204) {
            console.log('invalid message');
        } else {
            if (res.data.messageImage) {
                socket.current.emit("sendMessage", {
                    senderId: user._id,
                    receiverId,
                    text: newMessage,
                    messageImage: res.data.messageImage
                })
            }
            else {
                socket.current.emit("sendMessage", {
                    senderId: user._id,
                    receiverId,
                    text: newMessage
                })
            }
        }
    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const noEffect = () => {
        console.log('nosuchfunctionalityofclick')
    }

    useEffect(() => {
        clickRef.current ? PushToChatBar() : noEffect()
    }, [clickRef])

    const PushToChatBar = (data) => {
        let test = chatbar.includes(data)
        if (!test) {
            setChatbar([...chatbar, data])
            if (chatbar.length >= 3) {
                setChatNumber(old => old + 1)
            }
        }
        console.log(chatbar.length)
        getfriend(data)
        setPopup(true)
        setCurrentchat(data)
    }

    const handleRemoveItem = data => {

        setChatbar(() => chatbar.filter(item => !item?.members?.includes(data)))
        if (friend._id === data) {
            setPopup(false)
        }
        if (chatbar.length >= 3) {
            setChatNumber(old => old - 1)
        }
        console.log(chatbar.length)
        if (chatbar.length <= 4) {
            setChatList(false)
        }
    }



    const toggleView = e => {
        e.preventDefault()
        setPopup(!popup)
    }
    const chatSetter = data => {
        setCurrentchat(data)
        getfriend(data)
        setPopup(true)
        setChatList(false)
    }
    const getfriend = async (data) => {
        const friendID = data?.members?.find(m => m !== user._id)
        await axios.get(`${process.env.REACT_APP_BACK_END_URL}/${friendID}`, {
            headers: {
                "Content-type": "application/json;charset=UTF-8",
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        }).then(res => {
            setFriend(res.data)
        })
            .catch(err => {
                console.log(err.messsage)
            })
    }

    useEffect(() => {
        getfriend()
    }, [currentchat, user])


    const showhiddenChatmembers = (e) => {
        e.preventDefault()
        setChatList(!chatList)
        setPopup(false)
    }

    const imageSetter = (e) => {
        setImage(e.target.files[0])
        var tmppath = URL.createObjectURL(e.target.files[0])
        setPreviewLink(tmppath);
    }
    const removePreview = (e) => {
        e.preventDefault()
        setPreviewLink(null)
        setImage(null)
    }
    const myAllChats = e => {
        e.preventDefault()
        setAllChats(true)
        setPreviousChats(false)
        setActiveChats(false)
    }
    const mychats = async (e) => {
        e.preventDefault()
        setAllChats(false)
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/chat/${user._id}`,
                {
                    headers: {
                        "Content-type": "application/json;charset=UTF-8",
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    }
                });
            setPreviousConversation(res.data)
            setPreviousChats(true)
            setActiveChats(false)

        } catch (err) {
            console.log(err)
        }
    }
    const activeUsers = e => {
        e.preventDefault()
        setPreviousChats(false)
        setAllChats(false)
        setActiveChats(true)
    }
    return (
        <>
            <Topbar />
            <div className="messanger">
                <div className="chatmenu">
                    <span className="chatmenutitle">All Conversations : </span>
                    <div className="chatmenuwrapper">
                        {
                            allChats ?
                                conversations.map((one, index) => (
                                    <div onClick={() => PushToChatBar(one)} ref={clickRef}>
                                        <Conversation
                                            key={index}
                                            one={one}
                                            user={user}
                                            onlineusers={onlineusers}
                                        />
                                    </div>
                                ))
                                :
                                previousChats ?
                                    previousConverstation.map((one, index) => (
                                        <div onClick={() => PushToChatBar(one)} ref={clickRef}>
                                            <Conversation
                                                key={index}
                                                one={one}
                                                user={user}
                                                onlineusers={onlineusers}
                                            />
                                        </div>
                                    ))
                                    : activeChats ?
                                        <OnlineUser
                                            onlineusers={onlineusers}
                                            user={user}
                                            PushToChatBar={PushToChatBar}
                                            ref={clickRef}
                                        />
                                        : null
                        }

                    </div>
                    <div className="extra">
                        <div className="extrachild alert"
                            onClick={myAllChats}
                        >All</div>
                        <div className="extrachild previouschat"
                            onClick={mychats}
                        >Chats</div>
                        <div className="extrachild active"
                            onClick={activeUsers}
                        >Active</div>
                    </div>
                </div>
                <div className="chatbox">
                    <div className="chatboxwrapper">
                        {/* { currentchat ?
                            (<>
                                <div className="chatboxtop">
                                    {messages.map((one, index) => (
                                        <div ref={scrollRef}>
                                            <Message one={one} key={index} own={one.sender === user._id} />
                                        </div>
                                    ))}
                                </div>
                                { previewLink ?
                                    <div className="preview">
                                        <img
                                            className="imagePreview"
                                            src={previewLink}
                                        />
                                    <span className="crossButton">
                                        <CloseIcon style={{ fontSize: 17 }}
                                            onClick={removePreview}
                                        />
                                    </span>
                                    </div>
                                    : null
                                    }
                                <div className="chatboxbottom">
                                    <textarea
                                        className="textinputs"
                                        placeholder="write something..."
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        value={newMessage}
                                    ></textarea>

                                    <label htmlFor="upload-button">
                                            <span className="fileIcon">
                                                <AttachFileIcon />
                                            </span>
                                        </label>

                                        <input type="file"
                                            name="messageImage"
                                            id="upload-button"
                                            onChange={(e) => imageSetter(e)}
                                            style={{ display: "none" }}
                                        />
                                    <button className="textsubmint" onClick={sendMessage}>Send</button>
                                </div>
                            </>)
                            :
                            (<span className="noconversation">open a conversation</span>)
                        } */}
                    </div>
                </div>
                <div className="alluser">
                    <span className="chatmenutitle">People you may know: </span>
                    <div className='allfriends'>
                        {allUsers.map((one, index) => (
                            <div>
                                <Allusers
                                    key={index}
                                    one={one}
                                    user={user}
                                    conversationChange={conversationChange}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="chatbar">
                <div className="singleChat">
                    {chatbar ?
                        chatbar.map((one, index) => {
                            /* <div onClick={() =>chatSetter(one)} > */
                            return index < 3 ?
                                <div>
                                    <ChatBox
                                        index={index}
                                        one={one}
                                        user={user}
                                        // onlineusers={onlineusers}
                                        currentchat={currentchat}
                                        handleRemoveItem={handleRemoveItem}
                                        chatSetter={chatSetter}
                                    />
                                </div>
                                :
                                null
                        })
                        : null
                    }
                    {
                        popup ?
                            <>
                                <div className='box'>

                                    <div className="boxheader" onClick={toggleView}>
                                        {friend?.username}
                                    </div>

                                    <div className="boxbody">
                                        <div>
                                            {messages.map((one, index) => (
                                                <div ref={scrollRef}>
                                                    <Message one={one} key={index} own={one.sender === user._id} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {
                                        previewLink ?
                                            <div className="preview">
                                                <img
                                                    className="imagePreview"
                                                    src={previewLink}
                                                    alt="noimg"
                                                />
                                                <span className="crossButton">
                                                    <CloseIcon style={{ fontSize: 17 }}
                                                        onClick={removePreview}
                                                    />
                                                </span>
                                            </div>
                                            : null
                                    }
                                    <div className="boxfooter">
                                        <textarea
                                            className="textinputs"
                                            placeholder="write something..."
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            value={newMessage}
                                        ></textarea>

                                        <label htmlFor="upload-button">
                                            <span className="fileIcon">
                                                <AttachFileIcon />
                                            </span>
                                        </label>

                                        <input type="file"
                                            name="messageImage"
                                            id="upload-button"
                                            onChange={(e) => imageSetter(e)}
                                            style={{ display: "none" }}
                                        />

                                        <button className="textsubmint" onClick={sendMessage}>Send</button>

                                    </div>
                                </div>
                            </> : null}
                </div>

                <div
                    className={`${chatNumber > 0 ? "chatNumber" : "hidden"}`}
                    onClick={showhiddenChatmembers}
                >
                    {chatNumber}
                </div>
                {
                    chatList ?
                        <div className="chatListContainer">
                            {chatbar.map((one, index) => {
                                return index > 2 ?
                                    <ChatBox
                                        index={index}
                                        one={one}
                                        user={user}
                                        // onlineusers={onlineusers}
                                        currentchat={currentchat}
                                        handleRemoveItem={handleRemoveItem}
                                        chatSetter={chatSetter}
                                    />
                                    : null
                            })}
                        </div>
                        : null
                }
                {/* <div className="extra">
                    <div className="extrachild alert">Alerts</div>
                    <div className="extrachild previouschat">Chats</div>
                    <div className="extrachild active">Active</div>
                </div> */}
            </div>

        </>

    );
}

export default Messanger;