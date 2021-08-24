import './message.css';
import {format} from 'timeago.js'

const Message = ({one,own}) => {
    if(one.messageImage){
        var imageSrc=`http://localhost:3030/${one?.messageImage}`
    }
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messagetop">
                <img 
                    src="https://i2.wp.com/clipartart.com/images/facebook-profile-icon-clipart-7.png" 
                    alt="noimg" 
                    className="messageimg" />
                <div className="msgBody">
                { one.text ?
                    <p className="messagetext">{one.text}</p> : null
                }
                { one.messageImage ?
                    <div className="messageImage">
                    <img 
                        id="imageid"
                        src={imageSrc}
                        height="100px"
                        width="100px"
                        />
                    </div>
                     : null
                }
                 </div>  
            </div>
            <div className="messagebottom">{format(one.createdAt)}</div>
        </div>
    );
};

export default Message;