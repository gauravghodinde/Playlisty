"use client";
import React, { useCallback, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Copy, Check } from "lucide-react";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
} from "@firebase/storage";

import { initializeApp } from "firebase/app";
import { getDatabase, set } from "firebase/database";
import UserBox from "../../components/userBox/userBox";
import ProfileNan from "@/assests/profileNaN.svg";
import UserInfo from "../../components/userInfo/userInfo";
import MenuBar from "../../components/menuBar/MenuBar";
// import Search from "@/assests/MenuBarAssests/search.svg";
import CrossSvg from "@/assests/CrossSvg.svg";
import "./page.css";
import Navbar from "@/components/navbar/navbar.js";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk";
import Link from "next/link";
import { Search, X } from "lucide-react";

const APP_ID = process.env.NEXT_PUBLIC_APP_ID;
const APP_SECRET =process.env.NEXT_PUBLIC_APP_SECRET
const PROVIDER_ID = process.env.NEXT_PUBLIC_PROVIDER_ID

async function initializeReclaim() {
  const reclaimProofRequest = await ReclaimProofRequest.init(
    APP_ID,
    APP_SECRET,
    PROVIDER_ID
  );
  return reclaimProofRequest;
}

async function generateRequestUrl(reclaimProofRequest) {
  const requestUrl = await reclaimProofRequest.getRequestUrl();
  console.log("Request URL:", requestUrl);
  return requestUrl;
}

async function startVerificationSession(
  reclaimProofRequest,
  onSuccess,
  onFailure
) {
  await reclaimProofRequest.startSession({
    onSuccess: onSuccess,
    onFailure: onFailure,
  });
}
const App = () => {
  //spotify api
  const router = useRouter();
  

  //Variables
  const [userNameArrForSearch, updateuserNameArrForSearch] = useState(null);
  const [searchBoxContent, updateSearchBoxContent] = useState("");
  const [activeMenu, setActiveMenu] = useState(0);
  const [token, setToken] = useState("");
  const [data, setUser] = useState({});
  const [jsonData, setJsonData] = useState(null);
  const [uidArr, setUidArr] = useState([]);
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [username, setUsername] = useState(null);
  const [disabled, setdisabled] = useState(false);
  const handleVerifyUrl = () => {
    try {
      setdisabled(true);
      const urlPattern = /https:\/\/open\.spotify\.com\/user\/([a-zA-Z0-9]+)/;
      const match = spotifyUrl.match(urlPattern);
      if (match) {
        setUsername(match[1]);
        // alert(`Spotify Username: ${match[1]}`);
        // setTimeout(() => {
        if (uidArr && jsonData) {
          if (!uidArr.includes(match[1])) {
            console.log("uid not present you can add it\n", match[1]);
            const obj = { uid: `${match[1]}` };

            jsonData.users.push(obj);
            console.log(jsonData, "\n this is what i need", obj);

            const fileBlobJson = new Blob([JSON.stringify(jsonData, null, 2)], {
              type: "application/json",
            });

            writeToFirebase(fileBlobJson);

            // window.location.reload();
          } else {
            alert(`Spotify Username already present: ${match[1]}`);
            console.log(
              "already present",
              match[1],
              "\n",
              uidArr,
              "\n",
              jsonData
            );
          }
        }
        // }, 5000);
      } else {
        alert(
          "Invalid Spotify URL. Please ensure the URL is a Spotify profile link."
        );
      }
      setdisabled(false);
    } catch (error) {
      setdisabled(false);

      console.error("Error parsing URL:", error);
    }
  };
  const [userNameArr, updateUserNameArr] = useState([]);
  const [btnclicked, updatebtnclicked] = useState(false);
  const [userDetailsEnabled, setuserDetailsEnabled] = useState(null);
  const [userDetailsInfo, setUserDetailsInfo] = useState(null);
  const [requestUrl, setRequestUrl] = useState("");
  const [proofs, setProofs] = useState(null);
  const [reclaimusername, setreclaimusername] = useState(null);


  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
  const app = initializeApp(firebaseConfig);

  const writeToFirebase = (fileJson) => {
    const storage = getStorage();
    const fileRef = ref(storage, "/users.json");
    uploadBytes(fileRef, fileJson).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
    alert(`Spotify username successfully added`);

  };
  const handleReclaimProtocol = () => {
    async function setup() {
      try {
        const reclaimProofRequest = await initializeReclaim();
        const url = await generateRequestUrl(reclaimProofRequest);
        setRequestUrl(url);
        setStatus("Ready to start verification");

        await startVerificationSession(
          reclaimProofRequest,
          (proofs) => {
            if (proofs) {
              if (typeof proofs === "string") {
                // When using a custom callback url, the proof is returned to the callback url and we get a message instead of a proof
                console.log("SDK Message:", proofs);
                setProofs(proofs);
              } else if (typeof proofs !== "string") {
                // When using the default callback url, we get a proof object in the response
                console.log("Proof received:", proofs?.claimData.context);
                // console.log("Proof received:", proofs?.claimData.context);

                setProofs(JSON.stringify(proofs?.claimData.context));
                
              }
              const regex = /"username":"([^"]+)"/;
              console.log("regex");
              if (proofs) {
                console.log("proff not null]");
                console.log(
                  JSON.parse(proofs.claimData.context).extractedParameters
                );
                console.log(
                  JSON.parse(proofs.claimData.context).extractedParameters
                    .username
                );
                // console.log(JSON.parse(JSON.parse(proofs.claimData.context).extractedParameters).username);
                const username = JSON.parse(proofs.claimData.context)
                  .extractedParameters.username;
                // const match = proofs.match(regex);
                // console.log(match);
                // if (match) {
                //   console.log("matched");
                if (uidArr && jsonData) {
                  if (!uidArr.includes(username)) {
                    console.log("uid not present you can add it\n", username);
                    const obj = { uid: `${username}` };

                    jsonData.users.push(obj);
                    console.log(jsonData, "\n this is what i need", obj);

                    const fileBlobJson = new Blob(
                      [JSON.stringify(jsonData, null, 2)],
                      {
                        type: "application/json",
                      }
                    );

                    writeToFirebase(fileBlobJson);

                    // window.location.reload();
                  } else {
                    alert(`Spotify Username already present: ${username}`);
                    console.log(
                      "already present",
                      username,
                      "\n",
                      uidArr,
                      "\n",
                      jsonData
                    );
                  }
                }

                //   console.log(match[1]);
                //   setProofs3(match[1]);
                // }
                setreclaimusername(username);
              }

              setStatus("Proof received!");
            }
          },
          (error) => {
            console.error("Verification failed", error);
            setStatus(`Error: ${error.message}`);
          }
        );
      } catch (error) {
        console.error("Setup failed", error);
        setStatus(`Setup failed: ${error.message}`);
      }
    }

    setup();
  };

  useEffect(() => {
    let filteredList = [];
    let inputValue = searchBoxContent.toLowerCase;
    console.log(userNameArr);
    userNameArr.forEach((user) => {
      const isVisible = user.display_name
        .toLowerCase()
        .includes(searchBoxContent);
      if (isVisible) {
        console.log(isVisible, "is visibl;e");
        filteredList.push(user);
      }
    });
    updateuserNameArrForSearch(filteredList);
  }, [searchBoxContent]);

  useEffect(() => {
    setTimeout(() => {
      if (data && uidArr && jsonData) {
        if (!uidArr.includes(data.id)) {
          console.log("uid not present you can add it\n", data.id);
          const obj = { uid: `${data.id}` };

          jsonData.users.push(obj);
          console.log(jsonData, "\n this is what i need", obj);

          const fileBlobJson = new Blob([JSON.stringify(jsonData, null, 2)], {
            type: "application/json",
          });

          writeToFirebase(fileBlobJson);
        } else {
          console.log("already present", data, "\n", uidArr, "\n", jsonData);
        }
      }
    }, 5000);
  }, [uidArr]);
  useEffect(() => {
    showUsers();
  }, [jsonData]);
  useEffect(() => {
    //get the users json from firebase storage

    const storage = getStorage(app);
    const fileRef = ref(storage, "/users.json");
    getDownloadURL(fileRef)
      .then((url) => {
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            setJsonData(data);
            makeUidArray(data);
          })
          .catch((error) => console.error("Error fetching JSON:", error));
      })
      .catch((error) => console.error("Error getting download URL:", error));

    //geting the Token from Spotify Api
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }
    setToken(token);

    //geting user profile Data from spotify api
    let data = window.localStorage.getItem("user");
    if (!data || (Object.keys(data).length === 0 && hash)) {
      getUser();
      data = window.localStorage.getItem("user");
    }
    setUser(JSON.parse(data));
  }, []);

  const makeUidArray = (userDataJsonData) => {
    let arr = [];
    console.log(userDataJsonData);
    for (let i = 0; i < userDataJsonData.users.length; i++) {
      arr.push(userDataJsonData.users[i].uid);
    }
    setUidArr(arr);
  };

  //logout -> delete all the data
  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
    setUser({});
    window.localStorage.removeItem("user");
    window.location.reload();
  };

  //===================================
  const getUsersInfo = async (uid, e) => {
    let token = window.localStorage.getItem("token");
    console.log("token in Info", token);
    if (token) {
      e = !e ? (e = new Event("dummy")) : e;
      e.preventDefault();

      axios
        .get(`https://api.spotify.com/v1/users/${uid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response);
          // updateUserNameArr([...userNameArr, response.data.display_name]);
          updateUserNameArr((prevArr) => [...prevArr, response.data]);
        })
        .catch((error) => {
          console.log("this is error", error);
          logout();
          window.location.reload();
        });
        
    }
  };

  const updateMenuState = (stateNumber) => {
    setActiveMenu(stateNumber);
  };

  //Update Playlist of user
  useEffect(() => {
    if (userDetailsEnabled) {
      getPlaylistInfo(userDetailsEnabled.id);
    }
  }, [userDetailsEnabled]);

  //=================================================================================
  // GET PLAYLIST OF USER
  const getPlaylistInfo = async (uid, e) => {
    let token = window.localStorage.getItem("token");
    console.log("token in Info", token);
    if (token) {
      e = !e ? (e = new Event("dummy")) : e;
      e.preventDefault();
      axios
        .get(`https://api.spotify.com/v1/users/${uid}/playlists`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response);
          // updateUserNameArr([...userNameArr, response.data.display_name]);
          // updateUserNameArr((prevArr) => [...prevArr, response.data]);
          setUserDetailsInfo(response.data);
        })
        .catch((error) => {
          console.log("this is error", error);
          logout();
          // window.location.reload();
        });
    }
  };
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(requestUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleLinkClick = () => {
    window.open(requestUrl, "_blank", "noopener,noreferrer");
  };

  //==================================================

  const showUsers = async () => {
    // document.querySelector(".showUsersBtn").remove();
    if (!jsonData) return;
    updatebtnclicked(true);
    await Promise.all(
      jsonData.users.map(async (user) => {
        await getUsersInfo(user.uid);
      })
    );
  };

  //============================================
  //get user profile data with spotify api
  const getUser = async (e) => {
    let token = window.localStorage.getItem("token");
    console.log("token in getUser", token);
    if (token) {
      console.log("this is ", !token);

      e = !e ? (e = new Event("dummy")) : e;
      e.preventDefault();
      console.log(token);
      const { data } = await axios
        .get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .catch((error) => {
          console.log("this is error", error);
          logout();
          // window.location.reload();
        });

      window.localStorage.setItem("user", JSON.stringify(data));
      // window.location.reload();
    }
  };

  // const userDetailsEnabled=(user)=>{
  //   alert(user)
  // }

  // const UserBox = ({ userSpotifyLink, displayName, Profimage, followers }) => (
  //   <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer">
  //     <Link href={userSpotifyLink} target="_blank" rel="noopener noreferrer">
  //       <div className="flex flex-col items-center">
  //         <div className="relative w-24 h-24 mb-4">
  //           <img
  //             src={Profimage || '/profile-placeholder.png'}
  //             alt={displayName}
  //             fill = "true"
  //             className="rounded-full object-cover"
  //           />
  //         </div>
  //         <h3 className="text-lg font-semibold text-white mb-2">{displayName}</h3>
  //         <p className="text-gray-400">{followers} followers</p>
  //       </div>
  //     </Link>
  //   </div>
  // );

  return (
    <div className="min-h-screen bg-black text-white">
      {!jsonData ? (
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-2xl">Loading...</h1>
        </div>
      ) : (
        <div className="App">
          <Navbar
            logout={logout}
            userImg={data?.images && data.images[0] ? data.images[0].url : null}
            userName={data?.display_name}
          />
          <div className="container mx-auto px-4">
            <button
              className={`mt-4 bg-green-500 text-white px-6 py-2 rounded-full ${
                btnclicked
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-600"
              }`}
              disabled={btnclicked}
              onClick={showUsers}
            >
              Show Early Users
            </button>

            <div className="flex mt-8 gap-4">
              {/* Menu Bar */}
              <div className="w-64 flex-shrink-0">
                <nav className="space-y-2">
                  {["Users", "Search", "Add me", "About"].map((item, index) => (
                    <button
                      key={index}
                      onClick={() => updateMenuState(index)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        activeMenu === index
                          ? "bg-gray-800 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content Area */}
              <div className="flex-1">
                {activeMenu === 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {userNameArr ? (
                      userNameArr.map((user, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setuserDetailsEnabled(
                              userDetailsEnabled ? null : user
                            );
                          }}
                        >
                          <UserBox
                            userSpotifyLink={user.external_urls.spotify}
                            displayName={user.display_name}
                            Profimage={user.images[0]}
                            followers={user.followers.total}
                          />
                        </div>
                      ))
                    ) : (
                      <h1 className="text-xl">No users found</h1>
                    )}
                  </div>
                )}

                {activeMenu === 1 && (
                  <div className="space-y-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        value={searchBoxContent}
                        onChange={(e) => updateSearchBoxContent(e.target.value)}
                        className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Search by usernames"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {userNameArrForSearch ? (
                        userNameArrForSearch.map((user, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              setuserDetailsEnabled(
                                userDetailsEnabled ? null : user
                              );
                            }}
                          >
                            <UserBox
                              userSpotifyLink={user.external_urls.spotify}
                              displayName={user.display_name}
                              Profimage={user.images[0]}
                              followers={user.followers.total}
                            />
                          </div>
                        ))
                      ) : (
                        <h1 className="text-xl">No users found</h1>
                      )}
                    </div>
                  </div>
                )}

                {activeMenu === 2 && (
                  <div className="p-4">
                    <div className="spotify-section p-6 bg-gray-900 text-white rounded-lg shadow-lg space-y-6 max-w-md mx-auto">
                      {/* Input Field to Paste Spotify Profile URL */}
                      <div className="url-input">
                        <label
                          htmlFor="spotifyUrl"
                          className="block text-lg font-semibold text-green-400 mb-2"
                        >
                          Paste Spotify Profile URL:
                        </label>
                        <input
                          id="spotifyUrl"
                          type="text"
                          value={spotifyUrl}
                          onChange={(e) => setSpotifyUrl(e.target.value)}
                          placeholder="Paste Spotify URL here..."
                          className="w-full p-3 text-gray-900 rounded-md bg-gray-800 border border-green-500 text-sky-400/100 focus:outline-none focus:ring focus:ring-green-400 placeholder-gray-500"
                        />
                      </div>

                      {/* Verify URL Button */}
                      <div className="verify-url">
                        <button
                          onClick={handleVerifyUrl}
                          disabled={disabled}
                          className={`w-full p-3 ${
                            disabled ? "bg-black-500" : "bg-blue-500"
                          }   text-white rounded-md font-bold transition-transform transform hover:scale-105 hover:bg-blue-600`}
                        >
                          Add from URL
                        </button>
                        {username && (
                          <p className="text-center text-green-400 mt-2">
                            Username:{" "}
                            <span className="font-semibold">{username}</span>
                          </p>
                        )}
                      </div>

                      {/* Reclaim Protocol Button with QR Code */}

                      <div className="p-4">
                        <button
                          onClick={handleReclaimProtocol}
                          className="w-full p-3 bg-green-500 text-white rounded-md font-bold transition-transform transform hover:scale-105 hover:bg-green-600"
                        >
                          Add using Reclaim Protocol
                        </button>

                        {requestUrl && (
                          <div className="mt-4">
                            <div
                              className="cursor-pointer"
                              onClick={handleLinkClick}
                            >
                              {/* <QRCode
                                // size={}
                                style={{
                                  height: "auto",
                                  maxWidth: "100%",
                                  width: "100%",
                                }}
                                value={requestUrl}
                                viewBox="0 0 256 256"
                              /> */}
                              <img
                                src={`https://kissapi-qrcode.vercel.app/api/qrcode?chl=${requestUrl}`}
                              />
                            </div>

                            <div className="mt-4">
                              <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
                                <a
                                  href={requestUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 text-blue-600 hover:text-blue-800 overflow-hidden text-ellipsis"
                                >
                                  {requestUrl}
                                </a>
                                <button
                                  onClick={handleCopy}
                                  className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                                  title="Copy URL"
                                >
                                  {copied ? (
                                    <Check className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <Copy className="w-5 h-5 text-gray-600" />
                                  )}
                                </button>
                              </div>
                              <p className="mt-2 text-gray-600">
                                Click the QR code, URL, or copy button to start
                                the verification process
                              </p>
                            </div>
                          </div>
                        )}

                        {proofs && (
                          <div className="mt-4">
                            <h2 className="text-xl font-bold mb-2">
                              Verification Successful!
                            </h2>
                            <pre className="bg-gray-100 p-4 text-black rounded-md overflow-x-auto">
                              {/* {JSON.stringify(proofs2)} */}
                              {/* {proofs}
                              {
                                
                              } */}
                              {
                                reclaimusername
                              }
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeMenu === 3 && (
                  <div className="p-4">
                    <h2 className="text-2xl font-bold">About Me</h2>
                  </div>
                )}
              </div>

              {/* User Details Sidebar */}
              {userDetailsEnabled && (
                <div className="fixed inset-y-0 right-0 w-96 bg-gray-900 p-6 shadow-lg overflow-y-auto z-40 ">
                  <button
                    onClick={() => setuserDetailsEnabled(null)}
                    className="absolute  top-4 right-4 text-gray-400 hover:text-white"
                  >
                    <X className="" size={24} />
                  </button>

                  {userDetailsInfo && (
                    <div className="mt-8">
                      <div className="flex flex-col items-center mb-6">
                        <div className="w-32 h-32 mb-4 rounded-full overflow-hidden">
                          <img
                            src={
                              userDetailsEnabled.images[0]
                                ? userDetailsEnabled.images[0].url
                                : "/profile-placeholder.png"
                            }
                            alt={userDetailsEnabled.display_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h2 className="text-2xl font-bold">
                          {userDetailsEnabled.display_name}
                        </h2>
                        <p className="text-gray-400">
                          {userDetailsEnabled.followers.total} followers
                        </p>
                      </div>

                      <div className="space-y-4">
                        {userDetailsEnabled && (
                          <div className="container userDetails">
                            <div>
                              <img
                                onClick={() => setuserDetailsEnabled(null)}
                                className="close"
                                src={CrossSvg}
                              ></img>
                            </div>
                            {/* <h1>{JSON.stringify(userDetailsInfo)}</h1> */}
                            {userDetailsInfo && (
                              <UserInfo
                                // logout={logout}
                                userName={userDetailsEnabled.display_name}
                                imageProf={userDetailsEnabled.images[0]}
                                playlists={userDetailsInfo}
                                followers={userDetailsEnabled.followers.total}
                                token={token}
                                onClose={() => {
                                  setuserDetailsEnabled(null);
                                }}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
