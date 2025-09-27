
import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  const fetchWithAuth = async (url, opts = {}) => {
    opts.headers = opts.headers || {};
    if (accessToken) opts.headers['Authorization'] = `Bearer ${accessToken}`;
    opts.credentials = 'include'; // include cookies for refresh
    let res = await fetch(url, opts);
    if (res.status === 401) {
      // try refresh
      const r = await fetch('http://localhost:3000/api/auth/refresh', { method: 'POST', credentials: 'include' });
      if (r.ok) {
        const d = await r.json();
        setAccessToken(d.accessToken);
        opts.headers['Authorization'] = `Bearer ${d.accessToken}`;
        res = await fetch(url, opts);
      }
    }
    return res;
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, user, setUser, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
