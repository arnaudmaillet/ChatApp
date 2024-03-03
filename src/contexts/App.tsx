import React from "react";

interface IAppContext {
    generateUId: () => string;
}

interface IAppProps {
    children: React.ReactNode;
};

export const AppContext = React.createContext<IAppContext | null>(null);

export const AppProvider: React.FC<IAppProps> = ({ children }: IAppProps) => {

    const generateUId = (): string => {
        return new Date().getTime().toString() + Math.floor(Math.random() * 10000).toString() + Math.random().toString(36).substring(7)
    }

    return (
        <AppContext.Provider value={{ generateUId }}>
            {children}
        </AppContext.Provider>
    )
}

export const useApp = (): IAppContext => {
    const context = React.useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within a AppProvider');
    }
    return context;
}