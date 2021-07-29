import Topbar from '../../components/topbar/topbar'
import './messanger.css'
import Conversation from '../../components/conversation/conversation'
import Message from '../../components/message/message'
//import Chatonline from '../../components/chatonline/chatonline'
import { AuthContext } from '../../context/authContext'
import { useContext, useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import Allusers from '../../components/allusers/allusers';

function Messanger() {
    const { user } = useContext(AuthContext)
    const [conversations, setconversations] = useState([])
    const [allUsers , setAllusers] = useState([])
    const [currentchat, setCurrentchat] = useState(null)
    const [messages, setMessages] = useState(null)
    const [newMessage, setNewMessage] = useState("")
    const scrollRef = useRef()
    const socket = useRef()
    const [arraivalmessage , setarraivalmessage]=useState(null)
    const [onlineusers,setOnlineUsers] = useState([])


    useEffect(() => {
        socket.current = io("ws://localhost:3030")
        socket.current.on("getMessage",(data)=>{
            setarraivalmessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            })
        })
    }, [])


    useEffect(()=>{
        arraivalmessage && 
        currentchat?.members.includes(arraivalmessage.sender) &&
        setMessages((prev)=> [...prev, arraivalmessage])
    },[arraivalmessage,currentchat])

    useEffect(() => {
        socket.current.emit("addUser", user._id)
        socket.current.on("getUsers", users => {
            setOnlineUsers(user.friends.filter((f) => users.some((u) => u.userId === f._id)))
        })
    }, [user])

useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get(`http://localhost:3030/conversation/${user._id}`,
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
        getConversations()
    }, [user._id]);

    useEffect(() => {
        const getAlluser = async () => {
            try {
                const res = await axios.get(`http://localhost:3030/all/users`,
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
        getAlluser()
    }, [user._id]);


    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get(`http://localhost:3030/getmessages/${currentchat?._id}`,
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
        let date = {
            "conversationId": currentchat?._id,
            "text": newMessage
        }

        const receiverId = currentchat.members.find(
            (member) => member !== user._id
        )

        socket.current.emit("sendMessage", {
            senderId: user._id,
            receiverId,
            text:newMessage
        })

        try {
            const res = await axios.post(`http://localhost:3030/message`, date,
                {
                    headers: {
                        "Content-type": "application/json;charset=UTF-8",
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    }
                });
            console.log(res)
            setMessages([...messages, res.data])
            setNewMessage("")
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])
    return (
        <>
            <Topbar />
            <div className="messanger">
                <div className="chatmenu">
                    <div className="chatmenuwrapper">
                        <span>All conversations : </span>
                        {conversations.map((one, index) => (
                            <div onClick={() => setCurrentchat(one)}>
                                <Conversation 
                                    key={index} 
                                    one={one} 
                                    user={user} 
                                    onlineusers={onlineusers}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chatbox">
                    <div className="chatboxwrapper">
                        {currentchat ?
                            (<>
                                <div className="chatboxtop">
                                    {messages.map((one, index) => (
                                        <div ref={scrollRef}>
                                            <Message one={one} key={index} own={one.sender === user._id} />
                                        </div>
                                    ))}
                                </div>
                                <div className="chatboxbottom">
                                    <textarea
                                        className="textinputs"
                                        placeholder="write something..."
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        value={newMessage}
                                    ></textarea>
                                    <button className="textsubmint" onClick={sendMessage}>Send</button>
                                </div>
                            </>)
                            :
                            (<span className="noconversation">open a conversation</span>)
                        }
                    </div>

                </div>
                <div className="chatonline">
                <div className='allfriends'>
                    <span>Not Connect: </span>
                    {allUsers.map((one, index) => (
                            <div>
                                <Allusers 
                                key={index} 
                                one={one} 
                                user={user}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>

    );
}

export default Messanger;