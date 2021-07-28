import "./allusers.css";
import { Add } from "@material-ui/icons";
import axios from 'axios';


const Allusers = ({one}) => {

    const addFriends = async() =>{
        let obj={
            "receiverId":one._id
        }
        try {
            await axios.post(`http://localhost:3030/createConversation`,obj,
            {
                headers: {
                    "Content-type": "application/json;charset=UTF-8",
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
                }
            });
            } catch (err) {
                console.log(err)
            }
    }

    return (
        <div className="singleuser">
            <img 
            src="https://i2.wp.com/clipartart.com/images/facebook-profile-icon-clipart-7.png" 
            alt="" 
            className="userimage" />
            <span className="textspan">{one.username}</span>
            <div>
                <Add onClick={addFriends}/>
            </div>
        </div>
    );
};

export default Allusers;