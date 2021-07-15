import "./chatonline.css";

function Chatonline() {
    return (
        <div className="chatonline">
            <div className="chatonlinefriend">
                <div className="chatimgecontainer">
                    <img 
                    className="userimg"
                    src="https://i2.wp.com/clipartart.com/images/facebook-profile-icon-clipart-7.png" 
                    alt="" />
                    <div className="onlinebadge"></div>
                </div>
                <span className="onlinename">Murad</span>
            </div>
        </div>
    );
}

export default Chatonline;