import { createContext, useState } from "react";

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState({ username: "AlexIchenskiy" });

  return (
    <UserContext.Provider value={[userData, setUserData]}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
