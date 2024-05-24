import { useContext, useEffect, useRef, useState } from "react";
import "./chatList.css";
import AddUser from "./addUser/addUser";
import { useUserStore } from "../../../lib/userStore";
import {
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  collection,
  query,
  where,
  setDoc,
  serverTimestamp,
  arrayUnion,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";
import { Context } from "../../../context/searchContext";

const ChatList = () => {
  const [adminAdded, setAdminAdded] = useState(false);
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useContext(Context);
  const [input, setInput] = useState("");
  const [adminUser, setAdminUser] = useState(null);
  const [showChats, setShowChats] = useState(false);

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  useEffect(() => {
    const fetchAdminUser = async () => {
      try {
        const userRefAdmin = collection(db, "users");
        const adminQuery = query(
          userRefAdmin,
          where("username", "==", "InstaChat Developer")
        );
        const querySnapShotAdmin = await getDocs(adminQuery);
        if (!querySnapShotAdmin.empty) {
          const adminData = querySnapShotAdmin.docs[0].data();
          setAdminUser(adminData);
        } else {
          console.log("Admin user not found.");
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchAdminUser();

    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const data = res.data();
        if (data && data.chats) {
          const items = data.chats;

          const promises = items.map(async (item) => {
            const userDocRef = doc(db, "users", item.receiverId);
            const userDocSnap = await getDoc(userDocRef);

            const user = userDocSnap.data();

            return { ...item, user };
          });

          const chatData = await Promise.all(promises);

          setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        } else {
          setChats([]);
        }
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      const newChat = {
        chatId: newChatRef.id,
        lastMessage: "",
        receiverId: adminUser.id,
        updatedAt: Date.now(),
      };

      const adminUserChatsRef = doc(userChatsRef, adminUser.id);
      const currentUserChatsRef = doc(userChatsRef, currentUser.id);

      // Check if the admin user's chat document exists
      const adminDocSnap = await getDoc(adminUserChatsRef);
      if (adminDocSnap.exists()) {
        await updateDoc(adminUserChatsRef, {
          chats: arrayUnion({
            ...newChat,
            receiverId: currentUser.id,
          }),
        });
      } else {
        await setDoc(adminUserChatsRef, {
          chats: [
            {
              ...newChat,
              receiverId: currentUser.id,
            },
          ],
        });
      }

      // Check if the current user's chat document exists
      const currentUserDocSnap = await getDoc(currentUserChatsRef);
      if (currentUserDocSnap.exists()) {
        await updateDoc(currentUserChatsRef, {
          chats: arrayUnion(newChat),
        });
      } else {
        await setDoc(currentUserChatsRef, {
          chats: [newChat],
        });
      }

      setAdminAdded(true);

      const userDocRef = doc(db, "users", adminUser.id);
      const userDocSnap = await getDoc(userDocRef);
      const user = userDocSnap.data();

      setChats((prevChats) => [
        { ...newChat, user },
        ...prevChats.filter((chat) => chat.chatId !== newChat.chatId),
      ]);

      setShowChats(true); // Set to true to show the chats
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt=""
          className="add"
          onClick={() => {
            setAddMode((prev) => !prev);
          }}
        />
      </div>
      {showChats || filteredChats.length > 0 ? (
        filteredChats.map((chat) => (
          <div
            className="item"
            key={chat.chatId}
            onClick={() => handleSelect(chat)}
            style={{
              backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
            }}
          >
            <img
              src={
                chat.user.blocked.includes(currentUser.id)
                  ? "./avatar.png"
                  : chat.user.avatar || "./avatar.png"
              }
              alt=""
            />
            <div className="texts">
              <span>
                {chat.user.blocked.includes(currentUser.id)
                  ? "User"
                  : chat.user.username}
              </span>
              <p>{chat.lastMessage}</p>
            </div>
          </div>
        ))
      ) : adminUser && !adminAdded ? (
        <div className="user">
          <div className="detail">
            <img src={adminUser.avatar || "./avatar.png"} alt="" />
            <span>{adminUser.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
          <h5>
            Add the developer of InstaChat to check out the app's features!
          </h5>
        </div>
      ) : (
        <p>No chats found.</p>
      )}

      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
