import './topbar.css';
import { Search,  Chat, ExitToApp } from "@material-ui/icons";
import { logoutUser } from '../../apiCalls';
import { useContext } from 'react';
import {AuthContext} from '../../context/authContext'

export default function Topbar() {
  const {dispatch } = useContext(AuthContext)
  const logout = (e) => {
    e.preventDefault()
    logoutUser(dispatch)
  }
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <span className="title">h3llo</span>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search here..."
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <ExitToApp onClick={logout} />
          </div>
        </div>
      </div>
    </div>
  );
}