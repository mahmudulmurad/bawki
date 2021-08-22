import Topbar from '../../components/topbar/topbar'
import './messanger.css'
import Conversation from '../../components/conversation/conversation'
import Message from '../../components/message/message'
import ChatBox from '../../components/chatBox/chatBox'
import { AuthContext } from '../../context/authContext'
import { useContext, useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import Allusers from '../../components/allusers/allusers'
import AttachFileIcon from '@material-ui/icons/AttachFile';

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
    let [chatNumber , setChatNumber] = useState(0)
    const [chatList , setChatList] = useState(false)
    const [image, setImage] = useState(null)




    useEffect(() => {
        socket.current = io("ws://localhost:3030")
        socket.current.on("getMessage", (data) => {
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
    useEffect(() => {
        getConversations()
    }, [user._id]);

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

    useEffect(() => {
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
        var formData = new FormData();

        if( image ){
            formData.append('messageImage', image)
        }
        if( image && newMessage ){
        formData.append('text', newMessage)
        formData.append('conversationId', currentchat?._id)
       }
       else if(!image && newMessage) {
        formData.append('text', newMessage)
        formData.append('conversationId', currentchat?._id)
       }
       else if(image && !newMessage){
        formData.append('conversationId', currentchat?._id)
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
            const res = await axios.post(`http://localhost:3030/message`,formData,
                {
                    headers: {
                        "Content-type": "application/json;charset=UTF-8",
                        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                    }
                });
            console.log(res.data)
            setMessages([...messages, res.data])
            setImage(null)
            setNewMessage("")
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const PushToChatBar = (data) => {

        let test = chatbar.includes(data)

        if(!test){
            setChatbar([...chatbar, data])
            if(chatbar.length >= 3){
                setChatNumber(old => old + 1)
            }
        }
        console.log(chatbar.length)

       

        getfriend(data)
        setPopup(true)
        setCurrentchat(data)

     }
     
    const handleRemoveItem = data => {

        setChatbar( ()=> chatbar.filter( item => !item?.members?.includes(data) ))
        if( friend._id === data ) {
            setPopup( false )
        }
        if(chatbar.length >= 3){
            setChatNumber(old => old - 1)
        }
        console.log(chatbar.length)
        if(chatbar.length <=4){
            setChatList(false)
        }
    }

    const noEffect = () =>{
        console.log('murad')
    }

    useEffect(() => {
        clickRef.current ? PushToChatBar() : noEffect()
    },[clickRef])

    const toggleView = e=>{
        e.preventDefault()
        setPopup(!popup)
    }
    const chatSetter = data =>{
        setCurrentchat(data)
        getfriend(data)
        setPopup(true)
        setChatList(false)
    }
    const  getfriend = async (data) => {
        const friendID = data?.members?.find(m => m !== user._id)
        await axios.get(`http://localhost:3030/${friendID}`, {
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


const showhiddenChatmembers = (e) =>{
    e.preventDefault()
    setChatList(!chatList)
    setPopup(false)
}

    return (
        <>
            <Topbar />
            <div className="messanger">
                <div className="chatmenu">
                    <div className="chatmenuwrapper">
                        <span>All conversations : </span>
                        {conversations.map((one, index) => (
                            <div onClick={() => PushToChatBar(one)} ref={clickRef}>
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
                        open a conversation
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
            <div className="chatbar">
                <div className="singleChat">
                    { chatbar ?
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
                         onChange={(e)=> setImage(e.target.files[0])} 
                         style={{ display: "none" }}
                         />

                        <button className="textsubmint" onClick={sendMessage}>Send</button>

                    </div> 
                </div>
            </> : null  }
                </div>

                <div 
                    className={`${chatNumber > 0 ? "chatNumber" :  "hidden"}`} 
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
                <div className="extra">
                    <div className="extrachild alert">Alerts</div>
                    <div className="extrachild previouschat">Chats</div>
                    <div className="extrachild active">Active</div>
                </div>
            </div>

        </>

    );
}

export default Messanger;