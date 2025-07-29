const developing = true;
export const authBase = false?"http://localhost:8080": "https://youtubevideochat-551677223820.us-east1.run.app";
const aiBase = developing? "http://0.0.0.0:8000" : "" 
export const aiConvo = aiBase + "/talk-to-source";
export const aiUpdate = aiBase + "/update-sources";
export const aiInfo = aiBase + "/get-info";