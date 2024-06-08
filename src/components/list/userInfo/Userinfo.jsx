import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import "./userInfo.css";
import { useUserStore } from "../../../lib/userStore";
import { auth } from "../../../lib/firebase";

const Userinfo = () => {
  const [open, setOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openBackground, setOpenBackground] = useState(false);
  const { currentUser } = useUserStore();
  const dropdownRef = useRef(null);

  const BackgroundArray = useMemo(
    () => [
      "./background1.jpg",
      "./background2.jpg",
      "./background3.jpg",
      "./background4.jpg",
      "./background6.jpg",
      "./background7.jpg",
      "./background8.jpg",
      "./background9.jpg",
    ],
    []
  );

  const handleBackground = useCallback(() => {
    setOpenBackground((prev) => !prev);
  }, []);

  const setBackground = useCallback((img) => {
    const body = document.getElementsByTagName("body")[0];
    console.log("button clicked");
    body.style.backgroundImage = `url('${img}')`;
  }, []);

  const handleLogout = useCallback(() => {
    auth.signOut();
  }, []);

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
        {openBackground && (
          <div className="container-background">
            <div className="close" onClick={() => setOpenBackground(false)}>
              <img src="./plus.png" alt="" />
              <h5>Close</h5>
            </div>
            <h3>Backgrounds</h3>
            <div className="image-container">
              {BackgroundArray.map((img, index) => (
                <div
                  key={index}
                  className="background-imgs"
                  style={{ backgroundImage: `url(${img})` }}
                  onClick={() => setBackground(img)}
                ></div>
              ))}
            </div>
          </div>
        )}
      </div>

      {openEdit && (
        <>
          <div className="editComponent">
            <div className="close" onClick={() => setOpenEdit(false)}>
              <img src="./plus.png" alt="" />
              <h5>Close</h5>
            </div>
            <h1>Edit Component</h1>
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
            <button onClick={handleBackground}>Change Background</button>
          </div>
        </>
      )}
    </>
  );
};

export default Userinfo;
