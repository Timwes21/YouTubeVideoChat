import { useState, useContext, useEffect } from "react"
import { RefreshContext } from "../contexts/RefreshContext";
import useWebsocket from "../hooks/useWebsocket";
import { getToken } from "../token";
import { getSessionId } from "../sessionId";
import { aiUpdate } from "../routes";

export default function AskNewVideo(){
    const [ video, setVideo ] = useState<string>("");
    const [ videoSaved, setVideoSaved ] = useState<boolean>(false);
    const [ title, setTitle ] = useState<string>("");
    const [ author, setAuthor ] = useState<string>("");
    const [ beforeMessage, setBeforeMessage ] = useState<string>("");
    const [ message, setMessage ] = useState<string>("");
    const [ refresh, setRefesh ] = useContext(RefreshContext);
    const { sendQuery, query, setQuery, handleWs, previousMessage } = useWebsocket("newUrl");
    
    useEffect(()=> {
        title && handleWs();
    }, [refresh]);

    


    const sendUrl = () => {
        console.log(video);
        if (video.length === 0){
            return;
        }
        setBeforeMessage("Watching Video at Super Speed Give me a moment");
        const id = getToken()? getToken(): getSessionId();
        fetch(aiUpdate + "/get-video-rq", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({url: video, username: id})
        })
        .then(response=>response.json())
        .then(data=>{
            console.log(data);
            
            if (data.saved === "yes"){
                setTitle(data.title);
                setAuthor(data.author);
                setVideoSaved(true);
                setRefesh(!refresh)
            }
            else{
                console.log("video not saved");
                setMessage("Something went Wrong")
                
            }
        })
    }

    const saveUrl = ()=>{
        if (video.length === 0){
            return 
        }
        setBeforeMessage("...loading");
        fetch(aiUpdate + "/save-url", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({url : video, username: getToken()})
        })
        .then(resopnse=>resopnse.json())
        .then(data=>{
            if (data.added === "yes"){
                setRefesh(!refresh);

            }
            else{
                setBeforeMessage("Something went wrong");
            }
        })
    }


    const videoUrlInput = (
        <>
            <label htmlFor="">YouTube Url: </label>
            <input value={video} onChange={e=>setVideo(e.target.value)} type="text"/>
            <button onClick={sendUrl}>Ask</button>
            {beforeMessage}
        </>
    )

    const askVideo = (
        <>
            <h4>{title} by  {author}</h4>
            <textarea value={query} onChange={e=>setQuery(e.target.value)} name="" id=""></textarea>
            <div className="buttons">
                {getToken()?<button onClick={saveUrl}>Save Video</button>: <>Log in to save Video</>}
                <button onClick={sendQuery}>Send</button>
                <button onClick={()=>window.location.reload()}>Ask New Video</button>
                <span>{message}</span>
            </div>
            <span dangerouslySetInnerHTML={{__html: previousMessage}}></span>
        </>

    )

    return (
        <div className="convo">
            {!videoSaved ? videoUrlInput: askVideo}
        </div>
    )
    
}