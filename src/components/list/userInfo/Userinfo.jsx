import { useState, useRef, useEffect } from "react";
import "./userInfo.css";
import { useUserStore } from "../../../lib/userStore";
import { auth } from "../../../lib/firebase";
import SettingsMenu from "./SettingsMenu";
import useSettingsMenu from "../../../context/settingsMenuContext";
import useEditMenu from "../../../context/editMenuContext copy";

const Userinfo = () => {
  const { openSettings, setOpenSettings } = useSettingsMenu();
  const { openEdit, setOpenEdit } = useEditMenu();
  const { currentUser } = useUserStore();
  const dropdownRef = useRef(null);
  const [editMenu, setEditMenu] = useState(false);

  const handleLogout = () => {
    auth.signOut();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {openSettings && openEdit ? (
        <div className="userInfo">
          <div className="user">
            <img src={currentUser.avatar || "./avatar.png"} alt="" />
            <h2>{currentUser.username}</h2>
          </div>
          <div className="icons">
            <img
              src="./more.png"
              alt=""
              onClick={() => setOpen((prev) => !prev)}
            />
            {open && (
              <div ref={dropdownRef} className="dropdownMenu">
                <div className="item">
                  <h4>Edit Details</h4>
                </div>
                <div className="item">
                  <h4 onClick={() => setSettingsMenu((prev) => !prev)}>
                    Settings
                  </h4>
                </div>
                <div className="item">
                  <h4 onClick={handleLogout}>Logout</h4>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : !openSettings ? (
        <h1>settings menu</h1>
      ) : (
        <>
          <SettingsMenu />
        </>
      )}
    </>
  );
};

export default Userinfo;
