import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [email, setEmailState] = useState(localStorage.getItem("email") || null);
  const [filteredTag, setFilteredTag] = useState();
  const login = (newToken, username, password, userEmail) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    localStorage.setItem("email", userEmail);
    localStorage.setItem("username", username);
    localStorage.setItem('password', password);
  };

  const logout = () => {
    setToken(null);
    localStorage.setItem("email", '');
    localStorage.setItem("username", '');
    localStorage.setItem("password", '');
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
     
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
  
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  

  return (
    <AuthContext.Provider
      value={{
        token,
        email,
        setEmail: setEmailState,
        setFilteredTag,
        filteredTag,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};