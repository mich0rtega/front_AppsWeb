import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token'); // Aquí también cambia 'Token' por 'token' si vas a guardar así
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const login = (tokenLogin: string) => {
        localStorage.setItem('token', tokenLogin);
        setToken(tokenLogin);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
