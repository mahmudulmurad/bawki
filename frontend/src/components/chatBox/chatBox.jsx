import React,{useEffect ,useState} from 'react';
import './chatBox.css';
import axios from 'axios';
import CloseIcon from '@material-ui/icons/Close';



const ChatBox = ({one, user,i,handleRemoveItem}) => {

    const [friend, setFriend] = useState({})

    useEffect(() => {
        const friendID = one?.members?.find(m => m !== user._id)
        const getfriend = async () => {
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
        getfriend()
      }, [one, user])


 
    return (
        <div className="maindiv">
            <div className="minimize">
                <div className="username"> {friend.username}</div>
                <div className="closeicon" onClick={()=>handleRemoveItem(friend._id)}>
                    <CloseIcon style={{ fontSize: 15 }}/>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;