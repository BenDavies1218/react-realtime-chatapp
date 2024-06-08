import { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import upload from "../../lib/upload";

const Login = () => {
  const [login, setLogin] = useState(true);
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const [loading, setLoading] = useState(false);

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const { username, email, password } = Object.fromEntries(formData);

    // VALIDATE INPUTS
    if (!username || !email || !password)
      return toast.warn("Please enter inputs!");

    // VALIDATE UNIQUE USERNAME
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return toast.warn("Username taken please try again");
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const imgUrl = await upload(avatar.file || "./avatar.png");

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl || "./avatar.png",
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("Account created! You can login now!");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.reload();
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {login ? (
        <div className="login">
          <div className="item">
            <h2>Welcome to InstaChat</h2>
            <form onSubmit={handleLogin}>
              <input type="text" placeholder="Email" name="email" />
              <input type="password" placeholder="Password" name="password" />
              <button disabled={loading}>
                {loading ? "Loading" : "Sign In"}
              </button>
              <h6
                onClick={() => setLogin((prev) => !prev)}
                style={{ cursor: "pointer" }}
              >
                Sign Up
              </h6>
            </form>
          </div>
        </div>
      ) : (
        <div className="login">
          <div className="item">
            <h4>
              Please{" "}
              <strong style={{ textDecoration: "underline" }}>DO NOT!</strong>{" "}
              use real credentials, this isn't a production application. Use a
              fake email and password and don't upload a profile picture. All
              accounts are deleted after 24 hours for security reasons.
            </h4>
            <h2>Create an Account</h2>
            <form onSubmit={handleRegister}>
              <label htmlFor="file">
                <img src={avatar.url || "./avatar.png"} alt="" />
                Upload an image
              </label>
              <input
                type="file"
                id="file"
                style={{ display: "none" }}
                onChange={handleAvatar}
              />
              <input type="text" placeholder="Username" name="username" />
              <input type="text" placeholder="Email" name="email" />
              <input type="password" placeholder="Password" name="password" />
              <button disabled={loading}>
                {loading ? "Loading" : "Sign Up"}
              </button>
              <h6
                onClick={() => setLogin((prev) => !prev)}
                style={{ cursor: "pointer" }}
              >
                Sign In
              </h6>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
// <div className="separator"></div>
export default Login;
