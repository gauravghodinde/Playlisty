import React from "react";
import "./userBox.css";
import PlayButton from "../../assests/playButton.svg";
import FallbackAvatar from "./userimage";
const UserBox = ({ displayName, followers, Profimage,userSpotifyLink }) => {

 
  
  return (
    <div>
      <div className="frame">
        <div className="overlap-wrapper">
          <div className="overlap">
            <div className="playlist">
              <div className="overlap-group">
                <div className="normal-state" />
                <div className="playlist-wrapper">
                  <div className="text-wrapper">{displayName}</div>
                </div>
                <div className="description-de-la">{followers} Followers</div>
              </div>
            </div>
            {/* <img className="profile-pic" alt="Profile pic" src={Profimage} /> */}
            {Profimage ? (
                  <img 
                    src={Profimage.url} 
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FallbackAvatar username={displayName} />
                )}
            {/* <a href={userSpotifyLink}><img className="play-btn" id="play-btn"  alt="Play btn" src={PlayButton} /></a> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBox;
