import { createContext, useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase-config";
import {  setDoc, doc } from "firebase/firestore";

export const authContext = createContext();

export const useAuth = () => {
    const context = useContext(authContext);
    if (!context) throw new Error("There is not auth provider");
    return context;
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const signup = async (user) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password)
            
            console.log("todo ok", userCredential.user.uid);
            const clubId = userCredential.user.uid;

            const club = {
                id: clubId, 
                name: user.name,
                provincia: user.provincia,
                email: user.email,
                telefono: user.telefono,
                rol: "club"
            }

            await setDoc(doc(db, "clubes", clubId),{
                club
            });

            console.log("todo ok de verdat");

        } catch (error) {
            console.log("eeerror", error);
        }
        
    };

    const login = async (user) => {
        signInWithEmailAndPassword(auth, user.email, user.password)
    };

    const logout = () => signOut(auth)

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser)
            setLoading(false)
        });
        return () => unsubscribe()
    }, [])


    return (
        <authContext.Provider value={{ signup, login, user, logout, loading}}>
            {children}
        </authContext.Provider>
    );
}
