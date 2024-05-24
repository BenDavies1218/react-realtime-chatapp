import { useState, useRef, useEffect } from "react";
import "./userInfo.css";
import { useUserStore } from "../../../lib/userStore";
import { auth } from "../../../lib/firebase";

const Userinfo = () => {
  const [open, setOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { currentUser } = useUserStore();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    auth.signOut();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
        setOpenSettings(false);
        setOpenEdit(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
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
                <h4
                  onClick={() => {
                    setOpenEdit((prev) => !prev);
                    setOpen(false);
                  }}
                >
                  Edit Details
                </h4>
              </div>
              <div className="item">
                <h4
                  onClick={() => {
                    setOpenSettings((prev) => !prev);
                    setOpen(false);
                  }}
                >
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

      {openEdit && (
        <>
          <div className="editComponent">
            <div className="close" onClick={() => setOpenEdit(false)}>
              <img src="./plus.png" alt="" />
              <h5>Close</h5>
            </div>
            <h1>edit Component</h1>
          </div>
        </>
      )}

      {openSettings && (
        <>
          <div className="editComponent">
            <div className="close" onClick={() => setOpenSettings(false)}>
              <img src="./plus.png" alt="" />
              <h5>Close</h5>
            </div>
            <h1>Settings Component</h1>
          </div>
        </>
      )}
    </>
  );
};

export default Userinfo;
