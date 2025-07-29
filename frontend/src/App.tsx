import "./styles/askNewVid.css";
import './styles/App.css';
import './styles/askSource.css';
import './styles/Login.css'
import { RefreshContext } from "./contexts/RefreshContext";
import { KnowledgeSourceContext } from "./contexts/knowledgeSource";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Routes/Home.tsx";
import Login from "./Routes/Login.tsx";
import CreateAccount from "./Routes/CreateAccount.tsx";


function App() {
  const [ refresh, setRefesh ] = useState<boolean>(false);  
  const [ knowledgeSource, setKnowledgeSource ] = useState<string[]>(["", "", ""]);
  
  
  

  return (
    <>
      <BrowserRouter>
        <RefreshContext.Provider value={[refresh, setRefesh]}>
        <KnowledgeSourceContext.Provider value={[knowledgeSource, setKnowledgeSource]}>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/create-account" element={<CreateAccount/>}/>
            </Routes>
        </KnowledgeSourceContext.Provider>
        </RefreshContext.Provider>
      </BrowserRouter>
    </>
  )
}

export default App
