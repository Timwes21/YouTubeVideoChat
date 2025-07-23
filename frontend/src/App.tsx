import "./styles/askNewVid.css";
import SideBar from './components/sidebar';
import AskNewVideo from './components/askNewVideo';
import './styles/App.css';
import './styles/askSource.css';
import { RefreshContext } from "./contexts/RefreshContext";
import { KnowledgeSourceContext } from "./contexts/knowledgeSource";
import { useState } from "react";
import AskSource from "./components/askSource";

function App() {
  const [ refresh, setRefesh ] = useState<boolean>(false);  
  const [ knowledgeSource, setKnowledgeSource ] = useState<string[]>(["", "", ""]);
  
  console.log(knowledgeSource);
  
  

  return (
    <>
      <RefreshContext.Provider value={[refresh, setRefesh]}>
        <KnowledgeSourceContext.Provider value={[knowledgeSource, setKnowledgeSource]}>
        <div className='home'>
          <SideBar/>
          {knowledgeSource[2] === "known" ? <AskSource titleContents={knowledgeSource[0]} type={knowledgeSource[1]}/>:<AskNewVideo/>}
        </div>
        </KnowledgeSourceContext.Provider>
      </RefreshContext.Provider>
    </>
  )
}

export default App
