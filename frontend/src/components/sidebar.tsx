import { useEffect, useState } from "react";
import { RefreshContext } from "../contexts/RefreshContext";
import { useContext } from "react";
import { KnowledgeSourceContext } from "../contexts/knowledgeSource";
import { getToken } from "../token";
import { useNavigate, Link } from "react-router-dom";
import { aiInfo, aiUpdate } from "../routes";

export default function SideBar(){
    const [ refresh, setRefesh ] = useContext(RefreshContext);
    const [ knowledgeSource, setKnowledgeSource ] = useContext(KnowledgeSourceContext);
    

    const [ showBases, setShowBases ] = useState<boolean>(false);
    const [ showVideos, setShowVidoes] = useState<boolean>(false);
    const [ createBase, setCreateBase ] = useState<boolean>(false);
    const [ addVideo, setAddVideo ] = useState<boolean>(false);
    const [ newUrl, setNewUrl ] = useState<string>("");
    const [ newBase, setNewBase ] = useState<string>("");
    const [ bases, setBases ] = useState<string[]>([]);
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
        fetch(aiUpdate+"/get-knowledge-lists")
        .then(response=>response.json())
        .then(data=>{
            const { bases, videos } = data;
            console.log(data);
            
            console.log(videos);
            
            setVideos(videos)
            setBases(bases)
        })
    }, [refresh])

    const saveBase = (base: string) => () => {
        if (base.length === 0){
            return 
        }
        fetch(aiUpdate + "/create-base", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name : base})
        })
        .then(resopnse=>resopnse.json())
        .then(data=>{
            if (data.added === "yes"){
                setCreateBase(false);
                setNewBase("");
                setRefesh(!refresh)

            }
        })
    }

    const baseInput = (
        <div className="base-contents">
            <input value={newBase} onChange={e=>setNewBase(e.target.value)} placeholder="New Base" type="text" />
            <div>
                <button onClick={saveBase(newBase)}>Save</button>
                <button onClick={()=>setCreateBase(false)}>Cancel</button>
            </div>
        </div>
    )
    const saveUrl = (url: string) => ()=>{
        if (url.length === 0){
            return 
        }
        fetch("http://127.0.0.1:8000/save-url", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({url})
        })
        .then(resopnse=>resopnse.json())
        .then(data=>{
            if (data.added === "yes"){
                setAddVideo(false);
                setNewUrl("")
                setRefesh(!refresh)

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
        fetch(aiInfo+"/get-knowledge-source", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name: video, type: type})
        })
        setKnowledgeSource([ video, type, "known" ])
        console.log(video);
    }

    const loginChoice =(
        <>
            <p>Login to get Full Features <Link to="/login">Login</Link></p>
        </>
    )



    return (
        <div className="sidebar">
          <div className="tabs">
            {loggedIn?
            <ul>
              <li className="tabs-header" onClick={()=>setShowBases(!showBases)}>Knowledge Bases</li>
              {showBases && 
                <ul className="contents">
                    {createBase? baseInput: <span id="save-content" onClick={()=>setCreateBase(true)}>Create a Base</span>}

                    {bases.length > 0 && bases.map((value, _)=>(
                        <p key={value} onClick={chooseVideo(value, "base")} className="item">{value}</p>      
                    ))}
                </ul>
                }
              <li className="tabs-header" onClick={()=>setShowVidoes(!showVideos)}>Saved Vidoes</li>
              {showVideos && 
                <ul className="contents">
                    {addVideo? videoUrl: <span id="save-content" onClick={()=>setAddVideo(true)}>Save a Video</span>}

                    {vidoes.map((value, _)=>(
                        <p onClick={chooseVideo(value, "videos")} className="item" key={value}>{value}</p>
                    
                    ))}
                </ul>
                }
              {vidoes.length > 0 &&<li onClick={chooseVideo("hive", "hive")} className="tabs-header">Hive</li>}
            </ul>: loginChoice}
          </div>
        </div>
    )
}