import { useRef, useState, useEffect } from "react";
import { getToken } from "../token";
import { aiConvo } from "../routes";
import { getSessionId } from "../sessionId";

type MessagesType = {
    role: string,
    message: string
}

export default function useWebsocket(context: string){
    const ws = useRef<null | WebSocket>(null);
    const [ messages, setMessages ] = useState<MessagesType[]>([]);
    const [ query, setQuery ] = useState<string>("");

    
    
    function openWs(){
        const id = getToken()? getToken(): getSessionId()
        ws.current = new WebSocket(`${aiConvo}/talk-to-video/${id}`);
        ws.current.onopen  = () =>{
            console.log("ready to talk");
        }
        ws.current.onerror = (err) => {
            console.log(err);
        }
        ws.current.onmessage = (event) =>{
            console.log(event.data);
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
        if (context !== "newUrl"){
            fetch("http://127.0.0.1:8000/messages", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({context: context})
            })
            .then(response=>response.json())
            .then(data=>{
                console.log("this shouls be messages",data);
                setMessages(data)
                
            })
        }
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

    useEffect(()=> {
        openWs()
        getMessages()

        return () => {
            closeWs()
        };


    }, [context])


    const messagesDiv = (    
        <div className="messages">
                {messages?.map((value, index)=>(
                    <span className={`${value.role}-message`} key={`${value.message}/${index}`} dangerouslySetInnerHTML={{__html: value.message}}></span>
                ))}
        </div>
    )
    return { sendQuery, query, setQuery, messagesDiv}
}