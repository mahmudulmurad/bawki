// import { useEffect, useState } from "react";
// import "./chatonline.css";
// import axios from 'axios'

// function Chatonline({ onlineusers, currentusers, setCurrentchat }) {
//     console.log(onlineusers);
//     const [allfriends, setAllfriends] = useState([])
//     const [onlinefriends, setOnlinefriends] = useState([])

//     useEffect(() => {

//         const getfriends = async () => {
//             const res = await axios.get('/friends', {
//                 headers: {
//                     "Content-type": "application/json;charset=UTF-8",
//                     'Authorization': 'Bearer ' + sessionStorage.getItem('token')
//                 }
//             })
//             setAllfriends(res.data)
//         }
//         getfriends()
//     }, [currentusers])

//     useEffect(() => {
//         setOnlinefriends(allfriends.filter(one => onlineusers.includes(one._id)))
//     }, [allfriends, onlineusers]);
//     return (
//         <div className="chatonline">
//             {onlinefriends.map((one,index) =>(
//                 <div className="chatonlinefriend" key={index}>
//                     <div className="chatimgecontainer">
//                         <img
//                             className="userimg"
//                             src="https://i2.wp.com/clipartart.com/images/facebook-profile-icon-clipart-7.png"
//                             alt="" />
//                         <div className="onlinebadge"></div>
//                     </div>
//                     <span className="onlinename">{one?.username}</span>
//                 </div>
//             ))}

//         </div>
//     );
// }

// export default Chatonline;