import { useState, useEffect } from 'react';
import axios from "axios";
import FnirsEdgeContext from './tools/contextStore.js';
import SSIDPage from './components/ssidPage.jsx';
import PsauImage from './assets/psauLogo.png';;

// This is the main file to start the App

export default function App(){
  // Initialization of global states
  const [wifissid, setssid] = useState('');
  const [passwd, setPasswd] = useState('');
  const [serverAddr, setServerAddr] = useState('fnirs.codeadeel.com');
  const [submitButton, setSubmitButton] = useState('primary');
  const [currentImage, setCurrentImage] = useState(PsauImage);
  const [creditStatement, setCreditStatement] = useState('Made with ❤️ in Saudi Arabia');

  // Check for the following online images, if not available use local ones
  useEffect(()=>{
    axios.get("https://raw.githubusercontent.com/codeadeel/codeadeel/refs/heads/webassets/Statements/fNIRStatement").then((resp)=>{
      setCreditStatement(resp.data);
    }).catch(()=>{
      null;
    });
    
    axios.get("https://raw.githubusercontent.com/codeadeel/codeadeel/refs/heads/webassets/Logos/fNIRSLogo.png").then(()=>{
      setCurrentImage("https://raw.githubusercontent.com/codeadeel/codeadeel/refs/heads/webassets/Logos/fNIRSLogo.png");
    }).catch(()=>{
      null;
    });
  }, []);

  // Component definition
  return (
    <FnirsEdgeContext.Provider value={{
      wifissid, setssid,
      passwd, setPasswd,
      serverAddr, setServerAddr,
      submitButton, setSubmitButton,
      currentImage, creditStatement
    }}>
      <SSIDPage />
    </FnirsEdgeContext.Provider>
  );
}
