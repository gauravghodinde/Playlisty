import React, { useEffect, useState } from 'react';
import { useKeenSlider } from "keen-slider/react";
import 'keen-slider/keen-slider.min.css';
import { Users, Music, MoreHorizontal, X } from 'lucide-react';
import FallbackAvatar from '../userBox/userimage';
const UserInfo = ({ userName, imageProf, playlists, followers, following, token, logout, onClose }) => {
  const [tracksData, setTracksData] = useState(null);
  const [tracks, updateTracks] = useState(null);

  const [sliderRef] = useKeenSlider({
    loop: false,
    mode: "free",
    slides: {
      perView: 3,
      spacing: 20,
    },
  });

  useEffect(() => {
    if (tracks) {
      getTracksFromPlaylists(tracks.href);
    }
  }, [tracks]);

  const getTracksFromPlaylists = async (url, e) => {
    const token = window.localStorage.getItem("token");
    if (token) {
      e = !e ? (e = new Event("dummy")) : e;
      e.preventDefault();
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setTracksData(data);
      } catch (error) {
        console.error("Error fetching tracks:", error);
        logout();
        window.location.reload();
      }
    }
  };

  const TrackObj = ({ trackNum, trackName, img, albumName, artistName }) => (
    <div className="flex items-center space-x-4 p-4 hover:bg-gray-800/50 rounded-lg transition-all duration-200">
      <span className="text-gray-400 w-8">{trackNum}</span>
      <img src={img || '/placeholder.png'} alt="" className="w-12 h-12 rounded-md" />
      <div className="flex-1">
        <h3 className="text-white font-medium">{trackName}</h3>
        <p className="text-gray-400 text-sm">{artistName} • {albumName}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen bg-gradient-to-b from-gray-900/50 to-black/50">
        <div className="container mx-auto px-6 pt-8 relative">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 p-2 hover:bg-gray-800/50 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>

          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-8 mb-12">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-75 group-hover:opacity-100 transition duration-200 blur"></div>
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-purple-500">
               
                {imageProf ? (
                  <img 
                    src={imageProf.url} 
                    alt={userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FallbackAvatar username={userName} />
                )}
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="text-sm text-gray-400 uppercase tracking-wide">Profile</div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                {userName}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-4 text-gray-300">
                <div className="flex items-center">
                  <Music className="w-4 h-4 mr-2" />
                  <span>{playlists.total} Public Playlists</span>
                </div>
                <div className="hidden md:block w-1 h-1 bg-gray-500 rounded-full"></div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{followers} Followers</span>
                </div>
                <div className="hidden md:block w-1 h-1 bg-gray-500 rounded-full"></div>
                <div>{following} Following</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center md:justify-start space-x-4 mb-8">
            <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:opacity-90 transition-opacity duration-200">
              Follow
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-200">
              <MoreHorizontal className="w-6 h-6" />
            </button>
          </div>

          {/* Playlists Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Public Playlists</h2>
            <div ref={sliderRef} className="keen-slider">
              {playlists.items.map((playlist) => (
                <div
                  key={playlist.id}
                  onClick={() => updateTracks(tracks ? null : playlist.tracks)}
                  className="keen-slider__slide"
                >
                  <div className="bg-gray-800/50 p-4 rounded-xl hover:bg-gray-800 transition-colors duration-200 cursor-pointer backdrop-blur-sm">
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-50 transition duration-200 rounded-lg"></div>
                      <img
                        src={playlist.images?  playlist.images[0]?.url : null}
                        alt={playlist.name}
                        className="relative w-full aspect-square object-cover rounded-lg mb-4"
                      />
                    </div>
                    <h3 className="font-medium truncate">{playlist.name}</h3>
                    <p className="text-sm text-gray-400 truncate">
                      {playlist.owner.display_name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tracks Section */}
          {tracks && tracksData && (
            <div className="space-y-2 pb-8">
              <h2 className="text-2xl font-bold mb-6">Tracks</h2>
              <div className="bg-gray-900/50 rounded-xl backdrop-blur-sm">
                {tracksData.items.map((track, index) => (
                  <TrackObj
                    key={track.track.id}
                    trackNum={index + 1}
                    trackName={track.track.name}
                    img={track.track.album.images[0]?.url}
                    albumName={track.track.album.name}
                    artistName={track.track.artists[0].name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;