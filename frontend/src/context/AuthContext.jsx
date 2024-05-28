import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(sessionStorage.getItem("token") || null);
  const [email, setEmailState] = useState(sessionStorage.getItem("email") || null);
  const [filteredTag, setFilteredTag] = useState();
  const [sessionTimer, setSessionTimer] = useState(null);

  const login = (newToken, username, password, userEmail) => {
    setToken(newToken);
    sessionStorage.setItem("token", newToken);
    sessionStorage.setItem("email", userEmail);
    // sessionStorage.setItem("password", password); // Comentamos el almacenamiento de la contraseña

    const usernameWithoutDomain = userEmail.split("@")[0];
    sessionStorage.setItem("username", usernameWithoutDomain);

    setEmailState(userEmail);

    // Iniciar temporizador para cerrar sesión después de una hora de inactividad
    const timer = setTimeout(logout, 3600000); // 3600000 ms = 1 hora
    setSessionTimer(timer);
  };

  const logout = () => {
    setToken(null);
    sessionStorage.clear(); // Limpiar todo el sessionStorage al cerrar sesión
    clearTimeout(sessionTimer); // Limpiar el temporizador
  };

  useEffect(() => {
    const handleUnload = () => {
      // Limpiar sessionStorage solo cuando se cierra la ventana
      sessionStorage.clear();
      clearTimeout(sessionTimer); // Limpiar el temporizador
    };

    window.addEventListener("unload", handleUnload);

    // Iniciar temporizador para cerrar sesión después de una hora de inactividad
    const timer = setTimeout(logout, 3600000); // 3600000 ms = 1 hora
    setSessionTimer(timer);

    return () => {
      window.removeEventListener("unload", handleUnload);
      clearTimeout(sessionTimer); // Limpiar el temporizador
    };
  }, []);

  const resetSessionTimer = () => {
    // Reiniciar el temporizador para cerrar sesión después de una hora de inactividad
    clearTimeout(sessionTimer);
    const timer = setTimeout(logout, 3600000); // 3600000 ms = 1 hora
    setSessionTimer(timer);
  };

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
        resetSessionTimer,
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
