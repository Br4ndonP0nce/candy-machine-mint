import { useState } from "react";
import fakeAuth from "./auth";

const useAuthProvider = () => {
  const [user, setUser] = useState<null | string>(null);

  const signIn = (cb: () => void) => {
    fakeAuth.signIn(() => {
      setUser("John Doe");
    });
  };
  const signOut = (cb: () => void) => {
    fakeAuth.signOut(() => {
      setUser(null);
    });
  };
  return {
    user,
    signIn,
    signOut,
  };
};

export default useAuthProvider;
