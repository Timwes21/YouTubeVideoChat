export const authBase = "https://youtubevideochat-551677223820.us-east1.run.app";
const developing = true;
const aiBase = developing? "http://127.0.0.1:8000" : "" 
export const aiConvo = aiBase + "/talk-to-source";
export const aiUpdate = aiBase + "/update-source";
export const aiInfo = aiBase + "/get-info";