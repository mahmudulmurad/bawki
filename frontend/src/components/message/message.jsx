import './message.css';
import {format} from 'timeago.js'

const Message = ({one,own}) => {
    console.log(own);
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messagetop">
                <img 
                    src="https://i2.wp.com/clipartart.com/images/facebook-profile-icon-clipart-7.png" 
                    alt="noimg" 
                    className="messageimg" />
                <p className="messagetext">{one.text}</p>
            </div>
            <div className="messagebottom">{format(one.createdAt)}</div>
        </div>
    );
};

export default Message;