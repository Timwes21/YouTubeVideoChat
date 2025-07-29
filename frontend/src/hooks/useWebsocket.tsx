import { useRef, useState } from "react";
import { getToken } from "../token";
import { aiConvo, aiInfo } from "../routes";
import { getSessionId } from "../sessionId";

type MessagesType = {
    role: string,
    message: string
}

export default function useWebsocket(context: string){
    const ws = useRef<null | WebSocket>(null);
    const [ messages, setMessages ] = useState<MessagesType[]>([]);
    const [ query, setQuery ] = useState<string>("");
    const [ previousMessage, setPreviousMessage ] = useState<string>("");

    
    
    function openWs(){
        const id = getToken()? getToken(): getSessionId();
        ws.current =  new WebSocket(`${aiConvo}/talk-to-video/${id}`);
        ws.current.onopen  = () =>{
            console.log("ready to talk");
        }
        ws.current.onerror = (err) => {
            console.log(err);
        }
        ws.current.onmessage = (event) =>{
            console.log(event.data);
            if (context === "newUrl"){
                setPreviousMessage(event.data);
                return;
            }
            setMessages(prev=>[
                ...prev,
                {role: "ai", message: event.data}
            ])
            
        }
        ws.current.onclose = () => {
            console.log("connection closed");
            
        }
        
    }

    function getMessages(){
        fetch(aiInfo+"/messages", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({context: context, username: getToken()})
        })
        .then(response=>response.json())
        .then(data=>{
            console.log("this shouls be messages", data);
            setMessages(data);
            
        })
    }
    
    function closeWs(){
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.close();
        }
    }

    const sendQuery = () => {
        ws.current?.send(JSON.stringify({message: query, context: context}));
        setMessages(prev=>[
            ...prev,
            {
                role: "user",
                message: query,
            }
        ])
        setQuery("");

        
    }

    function handleWs(){
        openWs()
        context !== "newUrl" && getMessages();
    
        return () => {
            closeWs();
        };

    }

    


    const messagesDiv = (    
        <div className="messages">
            {messages?.map((value, index)=>(
                <span className={`${value.role}-message`} key={`${value.message}/${index}`} dangerouslySetInnerHTML={{__html: value.message}}></span>
            ))}
        </div>
    )
    return { sendQuery, query, setQuery, messagesDiv, handleWs, previousMessage }
}