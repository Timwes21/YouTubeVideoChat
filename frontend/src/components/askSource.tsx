import { useEffect, useState, type JSX } from "react";
import useWebsocket from "../hooks/useWebsocket";

type AskType = {
    titleContents: string,
    type: string
}


export default function AskSource({titleContents, type}: AskType){
    console.log(titleContents);
    
const { sendQuery, query, setQuery, messagesDiv } = useWebsocket(titleContents);

    


     



    return (
        <div className="convo-source">
            <div className="header-con">
                {type === "videos"? <h4>{titleContents.split(":")[1]} by  {titleContents.split(":")[0]}</h4>:<h4>{titleContents}</h4>}
            </div>
            {messagesDiv}
            <div className="input-con">
                <textarea value={query} onChange={e=>setQuery(e.target.value)} name="" id=""></textarea>
                <button onClick={sendQuery}>Send</button>
            </div>
        </div>

    )

}