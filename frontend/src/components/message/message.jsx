import './message.css';
import {format} from 'timeago.js'

const Message = ({one,own}) => {
   
    if(one.messageImage){
        var zz=`http://localhost:3030/${one?.messageImage}`;
    }
  
    console.log(one);
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messagetop">
                <img 
                    src="https://i2.wp.com/clipartart.com/images/facebook-profile-icon-clipart-7.png" 
                    alt="noimg" 
                    className="messageimg" />
                    { one.text ?
                     <p className="messagetext">{one.text}</p> : null
                    }
                    {
                    one.messageImage ?
                    <img 
                        id="imageid"
                        src={zz}
                        height="100px"
                        width="100px"
                    /> : null
                }
                
            </div>
            <div className="messagebottom">{format(one.createdAt)}</div>
        </div>
    );
};

export default Message;