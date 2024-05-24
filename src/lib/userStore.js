import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {
    // If the user doesn't exist then we set the currentUser to false this will cause the Login screen to load
    if (!uid) return set({ currentUser: null, isLoading: false });

    try {
      // Query Firebase for user Data
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      // if Data is found then we set currentUser and this will Login the user in
      if (docSnap.exists()) {
        set({ currentUser: docSnap.data(), isLoading: false });
        // If the user doesn't exist then we set the currentUser to false this will cause the Login screen to load
      } else {
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      console.log(err);
      // If the user doesn't exist then we set the currentUser to false this will cause the Login screen to load
      return set({ currentUser: null, isLoading: false });
    }
  },
}));
