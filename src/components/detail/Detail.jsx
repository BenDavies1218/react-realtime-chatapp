import React, { useState } from "react";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import "./detail.css";

const Detail = () => {
  const {
    chatId,
    user,
    isCurrentUserBlocked,
    isReceiverBlocked,
    changeBlock,
    resetChat,
  } = useChatStore();
  const { currentUser } = useUserStore();

  const [dropdownStates, setDropdownStates] = useState({
    chatSettings: false,
    privacyHelp: false,
    sharedPhotos: false,
    sharedFiles: false,
  });

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = (option) => {
    setDropdownStates((prevState) => ({
      ...prevState,
      [option]: !prevState[option],
    }));
  };

  const handleLogout = () => {
    auth.signOut();
    resetChat();
  };

  return (
    <div className="detail">
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>
      <div className="dropdownMenu">
        <div className="info">
          <div className="option">
            <div className="title">
              <span>Chat Settings</span>
              <img
                src={
                  dropdownStates.chatSettings
                    ? "./arrowDown.png"
                    : "./arrowUp.png"
                }
                alt=""
                onClick={() => handleClick("chatSettings")}
                style={{ cursor: "pointer" }}
              />
            </div>
            {dropdownStates.chatSettings && (
              <div className="dropdownContent">
                <p>dropdown menu</p>
              </div>
            )}
          </div>
          <div className="option">
            <div className="title">
              <span>Privacy & help</span>
              <img
                src={
                  dropdownStates.privacyHelp
                    ? "./arrowDown.png"
                    : "./arrowUp.png"
                }
                alt=""
                onClick={() => handleClick("privacyHelp")}
                style={{ cursor: "pointer" }}
              />
            </div>
            {dropdownStates.privacyHelp && (
              <div className="dropdownContent">
                <p>dropdown menu</p>
              </div>
            )}
          </div>
          <div className="option">
            <div className="title">
              <span>Shared photos</span>
              <img
                src={
                  dropdownStates.sharedPhotos
                    ? "./arrowDown.png"
                    : "./arrowUp.png"
                }
                alt=""
                onClick={() => handleClick("sharedPhotos")}
                style={{ cursor: "pointer" }}
              />
            </div>
            {dropdownStates.sharedPhotos && (
              <div className="dropdownContent">
                <p>dropdown menu</p>
              </div>
            )}
          </div>
          <div className="option">
            <div className="title">
              <span>Shared Files</span>
              <img
                src={
                  dropdownStates.sharedFiles
                    ? "./arrowDown.png"
                    : "./arrowUp.png"
                }
                alt=""
                onClick={() => handleClick("sharedFiles")}
                style={{ cursor: "pointer" }}
              />
            </div>
            {dropdownStates.sharedFiles && (
              <div className="dropdownContent">
                <p>dropdown menu</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="buttons">
        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "User blocked"
            : "Block User"}
        </button>
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Detail;
