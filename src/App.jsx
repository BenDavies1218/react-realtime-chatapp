// Importing Components
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import List from "./components/list/List";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";

// Firebase modules for Authentication, and fetching the user Data
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";

import { useEffect } from "react";

const App = () => {
  // Fetch user data and Chat from Firebase
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    // Function to get the UID
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    // return the UID to the user so they login again
    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  // Loading screen while we fetch the user Data
  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      {/* If the user has the UID then we display the List, Chat and Detail Components */}
      {currentUser ? (
        <>
          <List />
          {chatId && <Chat />}
          {chatId && <Detail />}
        </>
      ) : (
        // display the Login if the user UID is false
        <Login />
      )}
      {/* We always display the toast Notifications to update the user of successful requests or fails */}
      <Notification />
    </div>
  );
};

export default App;
