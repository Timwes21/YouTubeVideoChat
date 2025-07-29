import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import './styles/sidebar.css';
import App from './App.tsx';
import { getToken } from './token.ts';
import { fogetSessionId, getSessionId, setSessionId } from './sessionId.ts';
import { aiUpdate } from './routes.ts';

if (getToken() === "" && getSessionId() === ""){
  setSessionId();
}



window.onbeforeunload = () => {
  if (getSessionId() !== ""){

    fetch(aiUpdate+"/forget-user", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({token: getSessionId()})
    })
    fogetSessionId();
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
