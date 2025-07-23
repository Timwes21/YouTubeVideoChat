import { createContext } from "react";


type RefreshContextType = [
    boolean, 
    React.Dispatch<React.SetStateAction<boolean>>
]

export const RefreshContext = createContext<RefreshContextType>([false, ()=>{}]);