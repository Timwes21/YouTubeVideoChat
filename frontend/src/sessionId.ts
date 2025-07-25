const sessionIdName = "YTSUMSessionId";

export function getSessionId(): string{
    const sessionId = localStorage.getItem(sessionIdName);
    console.log("Should be the same as last: ", sessionId);
    
    return sessionId || "";
}


export function setSessionId(){
    localStorage.setItem(sessionIdName, crypto.randomUUID());
}

export function fogetSessionId(){
    localStorage.removeItem(sessionIdName);
}