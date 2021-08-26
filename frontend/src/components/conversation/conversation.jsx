import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";
const Conversation = ({ one, user, onlineusers }) => {

  const [friend, setFriend] = useState({})
  const [light, setLight] = useState(Boolean)

  useEffect(() => {
    const friendID = one.members.find(m => m !== user._id)
    let exist = onlineusers.some(one => one._id === friendID)
    if (exist) {
      setLight(true)
    } else {
      setLight(false)
    }

    const getfriend = async () => {
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
    getfriend()
  }, [one, user ,onlineusers])


  return (
    <div className="conversation">
      <div className="chatOnlineImgContainer">
        <img
          src="https://i2.wp.com/clipartart.com/images/facebook-profile-icon-clipart-7.png"
          alt=""
          className="conversationimage" />
        <div className={light ? 'chatOnlineBadge' : null}></div>
      </div>
      <span className="textspan">{friend.username}</span>
    </div>
  );
};

export default Conversation;