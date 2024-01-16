import React, { useEffect, useState } from "react";
import { db } from "../../../../firebase-config";
import { useAuth } from "../../../../context/authContext";
import { doc } from "firebase/firestore";

export const useChat = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const unsubscribe = doc(db,"messages").onSnapshot(
            (snapshot) => {
                setLoading(false);
                setMessages(
                    snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
                );
            },
            (err) => {
                setError(err);
            }
        );
        return () => unsubscribe();
    }, [setMessages]);
    return { error, loading, messages };
};
