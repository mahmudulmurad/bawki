import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";
const Conversation = ({one, user}) => {
    
    const [friend, setFriend]=useState({})

    useEffect(()=>{
        const friendID = one.members.find(m => m !== user._id)
        const getfriend=async()=>{
            await axios.get(`http://localhost:3030/${friendID}`,{
            headers: {
              "Content-type": "application/json;charset=UTF-8",
              'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
          }).then(res =>{
            setFriend(res.data)
          })
          .catch(err =>{
              console.log(err.messsage)
          })
        }
        getfriend()
    },[one,user])

    return (
        <div className="conversation">
            <img 
            src="https://i2.wp.com/clipartart.com/images/facebook-profile-icon-clipart-7.png" 
            alt="" 
            className="conversationimage" />
            <span className="textspan">{friend.username}</span>
        </div>
    );
};

export default Conversation;