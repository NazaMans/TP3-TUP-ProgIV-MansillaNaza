import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () =>{
    return useContext(AuthContext);
}

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(null);
    const [email, setEmail] = useState(null);
    const [nombre, setNombre] = useState(null);
    const [apellido, setApellido] = useState(null) 
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        setError(null);
        try{
            const response = await fetch("http:localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email, password}),
            });

            const session = await response.json();

            if (!response.ok && response.status === 400){
                throw new Error(session.error);
            }

            setToken(session.token);
            setEmail(session.email);
            setNombre(session.nombre);
            setApellido(session.apellido);
            return {succes: true};
            

        } catch(err){
            setError(err.message);
            return {succes: false};
        }
    };


    const logout = () => {
        setToken(null);
        setEmail(null);
        setNombre(null);
        setApellido(null);
        setError(null);

    }

    const fetchAuth = async (url, options = {}) => {
        if (!token){
            throw new Error("No esta iniciada la sesion");
        }

        return fetch(url, {
            ...options,
            headers: {...options.headers, Authorization: `Bearer ${token}`},
        });
    };

    return (
        <AuthContext.Provider 
        value={{
            token,
            email,
            nombre,
            apellido,
            error,
            isAuthenticated: !!token,
            login,
            logout,
            fetchAuth
        }}
        >
            {children}
        </AuthContext.Provider>
    );

};

export const AuthPage ({children}) => {
    const {isAuthenticated} = useAuth();

    if (!isAuthenticated){
        return <h2>Debes ingresar para poder ver la pagina >:)</h2>
    }

    return children;
};
