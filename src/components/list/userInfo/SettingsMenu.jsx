const SettingsMenu = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

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
      <h1>edit menu</h1>
    </>
  );
};

export default SettingsMenu;
