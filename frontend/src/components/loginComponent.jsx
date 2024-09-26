import { useEffect, useContext } from "react";
import shajs from "sha.js";
import axios from "axios";
import {Image} from "@nextui-org/image";
import {Input} from "@nextui-org/input";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import {Button} from "@nextui-org/button";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FnirsContext from "../tools/contextStore";

// This component is responsible for user login, this includes following:
// 1- Check for username & password, using SHA256 encryption
// 2- After successful user verification, continously check for JWT Cookie
// 3- If cookie available, access is granted, else logged out immediately

export default function LoginPage(){
    // Get states from context store
    const {userName, setUserName, passwd, setPasswd, loginButton, setLoginButton, currentImage, creditStatement} = useContext(FnirsContext)
    // Initialize the page navigation after successful login
    const navigate = useNavigate();

    const userSetter = (event) => {
        setUserName(event.target.value);
    };
    const passwdSetter = (event) => {
        setPasswd(event.target.value);
    };
    const submitter = () => {
        axios.post(window.location.origin + '/api/auth/login',{
            uname: shajs('sha256').update(userName).digest('hex'),
            passd: shajs('sha256').update(passwd).digest('hex')
        }).then(()=>{
            setLoginButton('primary');
            setUserName('');
            setPasswd('');
            navigate('/dashboard/livestream');
        }).catch(()=>{
            setLoginButton('danger');
            toast.error('Access Denied', {
                position: "top-right", autoClose: 5000, hideProgressBar: false,
                closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light"
            });
        });
        setUserName('');
        setPasswd('');
    };
    // Setup press enter to submit login
    useEffect(()=>{
        const enterPress = (event) =>{
            if(event.code=="Enter"){
                submitter();
            }
        };
        window.addEventListener('keypress', enterPress);

        return ()=>{
            window.removeEventListener('keypress', enterPress);
        };
    },[userName, passwd]);
    
    // Main login component
    return (
        <div className="flex flex-col h-dvh">
            <div className="flex flex-row flex-wrap justify-around items-center h-dvh">
                <Image width={350} alt="Main Logo" src={currentImage} radius="md" isBlurred/>
                <Card className="p-5 w-96">
                    <CardHeader className="text-start font-sans font-semibold">
                        fNIRS Dashboard Login
                    </CardHeader>
                    <CardBody className="gap-3">
                        <Input type="text" label="Username" value={userName} onChange={userSetter}/>
                        <Input type="password" label="Password" value={passwd} onChange={passwdSetter}/>
                    </CardBody>
                    <CardFooter className="flex flex-row justify-end">
                        <Button color={loginButton} variant="shadow" className="mb-2" onPress={submitter}>Login</Button>
                    </CardFooter>
                    <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false}
                            closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
                </Card>
            </div>
            <div className="flex flex-row justify-center font-sans text-xs m-3 fixed bottom-0 w-full">{creditStatement}</div>
        </div>
    );
}
