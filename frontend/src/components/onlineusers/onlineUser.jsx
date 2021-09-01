import React from 'react';
import './onlineUsers.css';
import axios from "axios";
import { useEffect, useState } from "react";
const OnlineUser = ({onlineusers, user,PushToChatBar,ref}) => {

    const [friends, setFriends] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([]);

    useEffect(() => {
    const getFriends = async () => {
        const res = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/myFriends/my`,
        {
            headers: {
                "Content-type": "application/json;charset=UTF-8",
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        })
      setFriends(res.data);
    };
    getFriends();
  }, [user._id]);

  useEffect(() => {
    setOnlineFriends(friends.filter( f => onlineusers.find( (u) => u._id === f._id ))
    )
  }, [friends, onlineusers]);


  const handleClick = async (user) => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/findSingleConversation/${user._id}`,
        {
            headers: {
                "Content-type": "application/json;charset=UTF-8",
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
        })
      PushToChatBar(res.data);
    } catch (err) {
      console.log(err);
    }
  }


    return (
    <div>
    {onlineFriends.map((one)=>(
    <div className="conversation"
    onClick={() => handleClick(one)} ref={ref}>
        <div className="chatOnlineImgContainer">
        <img
            src="https://i2.wp.com/clipartart.com/images/facebook-profile-icon-clipart-7.png"
            alt=""
            className="conversationimage" />
        <div className='chatOnlineBadge'></div>
        </div>
        <span className="textspan">{one.username}</span>
        </div>
        ))
    }  
   </div>
  )
};

export default OnlineUser;