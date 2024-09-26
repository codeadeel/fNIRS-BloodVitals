import { useState, useEffect, useRef } from 'react';
import axios from "axios";
import FnirsContext from './tools/contextStore.js'
import LoginPage from './components/loginComponent.jsx';
import Dashboard from './components/dashboardComponent.jsx';
import LiveStream from './components/livestreamComponent.jsx';
import InfoComponent from './components/infoComponent.jsx';
import PsauImage from './assets/psauLogo.png';

import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {useCookies} from 'react-cookie';

// This is the main file to start the App

export default function App(){
  // Initialization of global states
  const [userName, setUserName] = useState('');
  const [passwd, setPasswd] = useState('');
  const [loginButton, setLoginButton] = useState('primary');
  const [sideMenu, setSideMenu] = useState(false);
  const [liveStreamPageActive, setLiveStreamPageActive] = useState('text-current font-sans');
  const [infoPageActive, setInfoPageActive] = useState('text-current font-sans');
  const [currentImage, setCurrentImage] = useState(PsauImage);
  const [creditStatement, setCreditStatement] = useState('Made with ❤️ in Saudi Arabia');
  // Cookies checker for the React App
  const [fnirsCookie, setfnirsCookie, removefnirsCookie] = useCookies('', {doNotParse: true, doNotUpdate: true});
  
  // Initialization of charts data references
  const deltaAChart = useRef(null);
  const diffDeltaAChart = useRef(null);
  const deltaCChart = useRef(null);
  const highpassChart = useRef(null);
  const tsiChart = useRef(null);

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
    <FnirsContext.Provider value={{
      userName, setUserName,
      passwd, setPasswd,
      loginButton, setLoginButton,
      sideMenu, setSideMenu,
      liveStreamPageActive, setLiveStreamPageActive,
      infoPageActive, setInfoPageActive,
      fnirsCookie, removefnirsCookie,
      deltaAChart, diffDeltaAChart, deltaCChart, highpassChart, tsiChart, currentImage, creditStatement
    }}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={fnirsCookie['fNIRS-Cookie']==undefined ? <LoginPage /> : <Navigate to='/dashboard/livestream' />} />
          <Route path='/dashboard' element={fnirsCookie['fNIRS-Cookie']!=undefined ? <Dashboard /> : <Navigate to='/' />}>
            <Route path='/dashboard/livestream' element={fnirsCookie['fNIRS-Cookie']!=undefined ? <LiveStream /> : <Navigate to='/' />} />
            <Route path='/dashboard/info' element={fnirsCookie['fNIRS-Cookie']!=undefined ? <InfoComponent /> : <Navigate to='/' />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FnirsContext.Provider>
  );
}
