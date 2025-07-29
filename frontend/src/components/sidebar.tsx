import { useEffect, useState } from "react";
import { RefreshContext } from "../contexts/RefreshContext";
import { useContext } from "react";
import { KnowledgeSourceContext } from "../contexts/knowledgeSource";
import { forgetToken, getToken } from "../token";
import { Link } from "react-router-dom";
import { aiInfo, aiUpdate } from "../routes";

export default function SideBar(){
    const [ refresh, setRefesh ] = useContext(RefreshContext);
    const [ ,setKnowledgeSource ] = useContext(KnowledgeSourceContext);
    

    const [ showVideos, setShowVidoes] = useState<boolean>(false);
    const [ addVideo, setAddVideo ] = useState<boolean>(false);
    const [ newUrl, setNewUrl ] = useState<string>("");
    const [ vidoes, setVideos ] = useState<string[]>([]);

    const [ loggedIn, setLoggedIn ] = useState<boolean | undefined>();
    
    useEffect(()=>{
        const token: string = getToken();
        if (token === ""){
            setLoggedIn(false);
        }
        else {
            setLoggedIn(true);
        }
    })
    


    useEffect(()=>{
        fetch(aiInfo+"/get-knowledge-lists", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: getToken()})
        })
        .then(response=>response.json())
        .then(data=>{
            const { videos } = data;
            console.log(data);
            console.log(videos);
            
            setVideos(videos[0]);
            console.log(vidoes);
            
        })
    }, [refresh])

    

    
    const saveUrl = (url: string) => ()=>{
        if (url.length === 0){
            return 
        }
        const info = {url, username: getToken()}
        console.log(info);
        
        fetch(aiUpdate + "/save-url", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(info)
        })
        .then(resopnse=>resopnse.json())
        .then(data=>{
            if (data.added === "yes"){
                setAddVideo(false);
                setNewUrl("");
                setRefesh(!refresh);

            }
        })
    }

    const videoUrl = (
        <div className="base-contents">
            <input value={newUrl} onChange={e=>setNewUrl(e.target.value)} placeholder="Video Url" type="text" />
            <div>
                <button onClick={saveUrl(newUrl)}>Save</button>
                <button onClick={()=>{
                    setAddVideo(false);
                    setNewUrl("");
                }}>Cancel</button>
            </div>
        </div>
    )

    const chooseVideo = (video: string, type: string) => () => {
        console.log("this shiuld be one vidoe", video);
        
        fetch(aiInfo+"/get-knowledge-source", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name: video, type: type, username: getToken()})
        })
        setKnowledgeSource([ video, type, "known" ])
        console.log(video);
    }

    const loginChoice =(
        <>
            <p>Login to get Full Features <Link to="/login">Login</Link></p>
        </>
    )

    const logout = () => () => {
        forgetToken();
        window.location.reload();
    }

    console.log(vidoes);

    

    return (
        <div className="sidebar">
          <div className="tabs">
            {loggedIn?
            <ul>
                <li onClick={()=>setKnowledgeSource(["", "", "unknown"])} className="tabs-header">Ask New Video</li>
                
                <li className="tabs-header" onClick={()=>setShowVidoes(!showVideos)}>Saved Vidoes</li>
                {showVideos && 
                    <ul className="contents">
                        {addVideo? videoUrl: <span id="save-content" onClick={()=>setAddVideo(true)}>Save a Video</span>}

                        {vidoes.map(value=>(
                            <p onClick={chooseVideo(value, "videos")} className="item" key={value}>{value}</p>
                        
                        ))}
                    </ul>
                    }
                {vidoes.length > 0 &&<li onClick={chooseVideo("hive", "hive")} className="tabs-header">Hive</li>}
                </ul>: loginChoice}
          </div>
          {getToken()&&<div className="account">
            <span>{getToken()}</span>
            <button onClick={logout()}>Logout</button>
            </div>}
        </div>
    )
}