import SideBar from "../components/sidebar";
import AskNewVideo from '../components/askNewVideo';
import AskSource from "../components/askSource";
import { useContext } from "react";
import { KnowledgeSourceContext } from "../contexts/knowledgeSource";


export default function Home(){
    const [ knowledgeSource, ] = useContext(KnowledgeSourceContext);
    
    return   (
        <div className='home'>
            <SideBar/>
            {knowledgeSource[2] === "known" ? <AskSource titleContents={knowledgeSource[0]} type={knowledgeSource[1]}/>:<AskNewVideo/>}
        </div>

    )
}