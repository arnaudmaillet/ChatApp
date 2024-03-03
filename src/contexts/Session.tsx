import React from "react";
import { IUser } from "../types/IUser";

import { FIREBASE_AUTH, FIREBASE_DB } from "../../config";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential, onAuthStateChanged } from "firebase/auth";
import { DocumentData, DocumentReference, doc, getDoc, setDoc } from "firebase/firestore";

export interface IDataAuth {
    email: string;
    password: string;
}

interface ISessionContext {
    session: IUser | null;
    isLoading: boolean;
    signUp: (data: IDataAuth) => Promise<void>;
    signIn: (data: IDataAuth) => Promise<void>;
    signOut: () => void;
}

interface ISessionProps {
    children: React.ReactNode;
};

export const SessionContext = React.createContext<ISessionContext | null>(null);

export const SessionProvider: React.FC<ISessionProps> = ({ children }: ISessionProps) => {

    const [session, setSession] = React.useState<IUser | null>(null)
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        onAuthStateChanged(FIREBASE_AUTH, (user) => {
            if (!user) {
                setSession(null);
                return;
            }
        });
    }, []);


    const signIn = async (data: IDataAuth): Promise<void> => {
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(FIREBASE_AUTH, data.email, data.password)
                .then(async (userCredential: UserCredential) => {
                    const data = await getDoc(doc(FIREBASE_DB, 'users', userCredential.user.uid) as DocumentReference<DocumentData, DocumentData>)
                    if (data.exists()) {
                        setSession({
                            id: userCredential.user.uid,
                            email: data.data().email,
                            isSearching: data.data().isSearching
                        } as IUser);
                    }
                })
        } catch (error: any) {
            console.log(error);
            alert("Sign in failed : " + error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const signUp = async (data: IDataAuth): Promise<void> => {
        setIsLoading(true);
        try {
            await createUserWithEmailAndPassword(FIREBASE_AUTH, data.email, data.password)
                .then((userCredential: UserCredential) => {
                    setDoc(doc(FIREBASE_DB, 'users', userCredential.user.uid) as DocumentReference<DocumentData, DocumentData>, {
                        email: userCredential.user.email,
                        uid: userCredential.user.uid,
                        isSearching: false
                    }).then(() => {
                        setSession({
                            id: userCredential.user.uid,
                            email: userCredential.user.email,
                            isSearching: false
                        } as IUser);
                    });
                });
            console.log("Sign up successful", session);
            alert("Sign up successful");
        } catch (error: any) {
            console.log(error);
            alert("Sign in failed : " + error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const signOut = (): void => {
        FIREBASE_AUTH.signOut();
    }

    if (!children) return null;
    return (
        <SessionContext.Provider value={{ session, isLoading, signUp, signIn, signOut }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = (): ISessionContext => {
    const context = React.useContext(SessionContext);
    if (!context) {
        throw new Error('useSession doit être utilisé à l\'intérieur d\'un SessionProvider');
    }
    return context;
};

