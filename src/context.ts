import React from 'react'

const AuthContext = React.createContext({
  isAuth: false,
  onLogin: () => {},
  onLogout: () => {}
});

export { AuthContext };