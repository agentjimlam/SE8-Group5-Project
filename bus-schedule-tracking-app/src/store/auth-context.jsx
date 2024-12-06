import { createContext, useState } from "react";

// Step 1: Create the context object
export const AuthContext = createContext();

// Step 2: Set up the Context Provider

export function AuthContextProvider({ children }){
    // Define states to manage in our context
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);
    const [ currentUsername, setCurrentUsername ] = useState("");

    const loginHandler = (currentUsername) => {
        setIsLoggedIn(true);
        setCurrentUsername(currentUsername); // Save current logged in username
    };

    const logoutHandler = () => {
        setIsLoggedIn(false);
        setCurrentUsername(""); // Clear the current logged in username on logout
    }

    // Context object to be passed to the provider
    const context = {
        isLoggedIn: isLoggedIn,
        currentUsername: currentUsername,
        loginHandler: loginHandler,
        logoutHandler: logoutHandler
    }

    return (
        <AuthContext.Provider value={context}> {children} </AuthContext.Provider>
    );
}

// Step 3: Add Context Provider to top-level component, aka wrap <App/> in main.jsx
// Step 4: Apply the useContext Hook to access context, see in LoginPage.jsx

