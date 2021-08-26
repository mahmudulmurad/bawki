import React,{useEffect ,useState} from 'react';
import './chatBox.css';
import axios from 'axios';
import CloseIcon from '@material-ui/icons/Close';



const ChatBox = ({one, user, index, handleRemoveItem, chatSetter}) => {

    const [friend, setFriend] = useState({})

    useEffect(() => {
        const friendID = one?.members?.find(m => m !== user._id)
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
      }, [one, user])

        return (
          <div className="maindiv">
              <div className="minimize">
                  <div className="username" onClick={()=>chatSetter(one)}> {friend.username}</div>
                  <div className="closeicon">
                      <CloseIcon 
                        className="crossIcon"
                        onClick={()=>handleRemoveItem(friend._id)}
                        style={{ fontSize: 17 }}/>
                  </div>
              </div>
          </div>
        )
    
};

export default ChatBox;