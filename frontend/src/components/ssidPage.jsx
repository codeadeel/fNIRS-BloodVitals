import { useEffect, useContext } from "react";
import axios from "axios";
import { Image } from "@nextui-org/image";
import { Input } from "@nextui-org/input";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FnirsContext from "../tools/contextStore";

export default function SSIDPage(){
    // Get states from context store
    const {wifissid, setssid, passwd, setPasswd, submitButton, setSubmitButton, currentImage, creditStatement} = useContext(FnirsContext);

    const ssidSetter = (event) => {
        setssid(event.target.value);
    };
    const passwdSetter = (event) => {
        setPasswd(event.target.value);
    };
    const submitter = () => {
        axios.get(window.location.origin + ":5003/api/network/connect", {
            params: {
                ssid: wifissid,
                password: passwd
            }
        }).then(()=>{
            setSubmitButton("primary");
            setssid('');
            setPasswd('');
        }).catch(()=>{
            setSubmitButton('danger');
            toast.error('Check for Network Changes', {
                position: "top-right", autoClose: 5000, hideProgressBar: false,
                closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light"
            });
        });
        setssid('');
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
    },[wifissid, passwd]);

    return (
        <div className="flex flex-col h-dvh">
            <div className="flex flex-row flex-wrap justify-around items-center h-dvh">
                <Image width={350} alt="Main Logo" src={currentImage} radius="md" isBlurred/>
                <Card className="p-5 w-96">
                    <CardHeader className="text-start font-sans font-semibold">
                        fNIRS Edge Device Network Connection
                    </CardHeader>
                    <CardBody className="gap-3">
                        <Input type="text" label="SSID" value={wifissid} onChange={ssidSetter}/>
                        <Input type="password" label="Password" value={passwd} onChange={passwdSetter}/>
                    </CardBody>
                    <CardFooter className="flex flex-row justify-end">
                        <Button color={submitButton} variant="shadow" className="mb-2" onPress={submitter}>Connect</Button>
                    </CardFooter>
                    <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false}
                            closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
                </Card>
            </div>
            <div className="flex flex-row justify-center font-sans text-xs m-3 fixed bottom-0 w-full">{creditStatement}</div>
        </div>
    );
}
