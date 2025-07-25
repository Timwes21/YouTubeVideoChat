import { useState, useContext } from "react"
import { RefreshContext } from "../contexts/RefreshContext";
import useWebsocket from "../hooks/useWebsocket";
import { getToken } from "../token";
import { getSessionId } from "../sessionId";

export default function AskNewVideo(){
    const [ video, setVideo ] = useState<string>("");
    const [ videoSaved, setVideoSaved ] = useState<boolean>(false);
    const [ title, setTitle ] = useState<string>("");
    const [ author, setAuthor ] = useState<string>("");
    const [ message, setMessage ] = useState<string>("");
    const [ refresh, setRefesh ] = useContext(RefreshContext);
    const { sendQuery, query, setQuery} = useWebsocket("newUrl");
    
    





    const sendUrl = () => {
        console.log(video);
        if (video.length === 0){
            return
        }
        const id = getToken()? getToken(): getSessionId();
        fetch("http://127.0.0.1:8000/get-video-rq", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({url: video, id: id})
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
        })
    }

    const saveUrl = ()=>{
        if (video.length === 0){
            return 
        }
        setMessage("...loading")
        fetch(`http://127.0.0.1:8000/save-url`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({url : video, username: getToken()})
        })
        .then(resopnse=>resopnse.json())
        .then(data=>{
            if (data.added === "yes"){
                setMessage("Video saved");
                setRefesh(!refresh)

            }
        })
    }

    const videoUrlInput = (
        <>
            <label htmlFor="">YouTube Url: </label>
            <input value={video} onChange={e=>setVideo(e.target.value)} type="text"/>
            <button onClick={sendUrl}>Ask</button>
        </>
    )

    const askVideo = (
        <>
            <h4>{title} by  {author}</h4>
            <textarea value={query} onChange={e=>setQuery(e.target.value)} name="" id=""></textarea>
            <div className="buttons">
                <button onClick={saveUrl} >Save Video</button>
                <button onClick={sendQuery}>Send</button>
                <span>{message}</span>
            </div>
        </>

    )

    return (
        <div className="convo">
            {!videoSaved ? videoUrlInput: askVideo}
        </div>
    )
    
}