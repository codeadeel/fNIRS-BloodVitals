import { useState, useRef, useEffect, useContext } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { DatePicker } from "@nextui-org/date-picker";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { RadioGroup, Radio } from "@nextui-org/radio";
import { Chip } from "@nextui-org/chip";
import { Textarea } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import FnirsContext from "../tools/contextStore";
import ChartsComponent from "./chartsComponent";

// This component is responsible for the livestreaming of edge data over websockets & Recording of Subject Data

export default function AcquisitionComponent(){
    // Import states from the context store
    const {recordingData, fnirsSocket, deviceID, setDeviceID, setLiveStreamPageActive, setAcquisitionPageActive, setInfoPageActive, deltaAChart, diffDeltaAChart, deltaCChart, highpassChart, tsiChart} = useContext(FnirsContext);
    const [agreementCheck, setAgreementCheck] = useState(false);
    const [chipStatus, setChipStatus] = useState("Declined");
    const [chipColor, setChipColor] = useState("danger");
    const [recordingButtonStatus, setRecordingButtonStatus] = useState("Start Recording");
    const [recordingButtonColor, setRecordingButtonColor] = useState("success");
    const [modalOpen, setModalOpen] = useState(true);
    const [patientName, setPatientName] = useState("");
    const [patientDOB, setPatientDOB] = useState("");
    const [patientEmail, setPatientEmail] = useState("");
    const [patientPhone, setPatientPhone] = useState("");
    const [patientAddress, setPatientAddress] = useState("");
    const [patientCity, setPatientCity] = useState("");
    const [patientCountry, setPatientCountry] = useState("");
    const [patientGender, setPatientGender] = useState("male");
    const [patientGlucose, setPatientGlucose] = useState("");
    const [patientDescription, setPatientDescription] = useState("");
    const isRecording = useRef(false);
    const navigate = useNavigate();

    const startStopRecording = () => {
        if(!isRecording.current){
            setRecordingButtonStatus("Stop Recording");
            setRecordingButtonColor("danger");
            isRecording.current = true;
            toast.success('Recording Started !', {position: "bottom-center", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light"});
        } else {
            setRecordingButtonStatus("Start Recording");
            setRecordingButtonColor("success");
            isRecording.current = false;
            toast.error('Recording Stopped !', {position: "bottom-center", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light"});
        }
    };

    const dataReset = () => {
        recordingData.current = {
            sensorValues: {"870nmch1": [], "870nmch2": [], "870nmch3": [], "870nmch4": [], "660nmch1": [], "660nmch2": [], "660nmch3": [], "660nmch4": [], "1200nmch1": [], "1200nmch2": [], "1200nmch3": [], "1200nmch4": [], "1550nmch1": [], "1550nmch2": [], "1550nmch3": [], "1550nmch4": []},
            deltaValues: {"870nmch1": [], "870nmch2": [], "870nmch3": [], "870nmch4": [], "660nmch1": [], "660nmch2": [], "660nmch3": [], "660nmch4": [], "1200nmch1": [], "1200nmch2": [], "1200nmch3": [], "1200nmch4": [], "1550nmch1": [], "1550nmch2": [], "1550nmch3": [], "1550nmch4": []},
            concentrationValues: {"870nmch1": [], "870nmch2": [], "870nmch3": [], "870nmch4": [], "660nmch1": [], "660nmch2": [], "660nmch3": [], "660nmch4": [], "1200nmch1": [], "1200nmch2": [], "1200nmch3": [], "1200nmch4": [], "1550nmch1": [], "1550nmch2": [], "1550nmch3": [], "1550nmch4": []},
            highpassFilterValues: {"870nm": [], "660nm": [], "1200nm": [], "1550nm": []},
            tsiValues: {"870nm": [], "660nm": [], "1200nm": [], "1550nm": []}
        };
        setPatientName("");
        setPatientDOB("");
        setPatientEmail("");
        setPatientPhone("");
        setPatientAddress("");
        setPatientCity("");
        setPatientCountry("");
        setPatientGender("male");
        setPatientGlucose("");
        setPatientDescription("");
    }

    const submitPresser = () => {
        let dataValid = true;
        if(deltaAChart.current.data.datasets[0].data.length <= 0){
            toast.error(`No Data from Edge Device # ${deviceID}!`, {position: "bottom-center", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light"});
            dataValid = false;
        }
        if(patientName==="" && dataValid){
            toast.error('Enter Patient Name !', {position: "bottom-center", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light"});
            dataValid = false;
        }
        if(patientDOB==="" && dataValid){
            toast.error('Enter Patient Date of Birth !', {position: "bottom-center", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light"});
            dataValid = false;
        }
        if(patientCity==="" && dataValid){
            toast.error('Enter City Name !', {position: "bottom-center", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light"});
            dataValid = false;
        }
        if(patientCountry==="" && dataValid){
            toast.error('Enter Country Name !', {position: "bottom-center", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light"});
            dataValid = false;
        }
        if(patientGlucose==="" && dataValid){
            toast.error('Enter Patient Current Glucose Levels !', {position: "bottom-center", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light"});
            dataValid = false;
        }
        if(dataValid){
            axios.post(window.location.origin + '/api/database/commit', {
                patientName: patientName,
                patientDOB: patientDOB,
                patientEmail: patientEmail,
                patientPhone: patientPhone,
                patientAddress: patientAddress,
                patientCity: patientCity,
                patientCountry: patientCountry,
                patientGender: patientGender,
                patientGlucose: patientGlucose,
                patientDescription: patientDescription,
                currentTime: (new Date()).toString(),
                deviceID: deviceID,
                wmaAgreement: agreementCheck,
                recordedData: JSON.stringify(recordingData.current)
            }).then((res)=>{
                toast.success(`${patientName} @ ${res.data.patientID} Thank You for your Cooperation !`, {position: "bottom-center", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light"});
                setAgreementCheck(false);
                setChipStatus("Declined");
                setChipColor("danger");
                setModalOpen(true);
                dataReset();
                setRecordingButtonStatus("Start Recording");
                setRecordingButtonColor("success");
                isRecording.current = false;
                
            }).catch(()=>{
                setAgreementCheck(false);
                setChipStatus("Declined");
                setChipColor("danger");
                setModalOpen(true);
                dataReset();
                setRecordingButtonStatus("Start Recording");
                setRecordingButtonColor("success");
                isRecording.current = false;
                toast.error('Yikes, Something Went Wrong !', {position: "bottom-center", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light"});
                toast.error('Redirecting You to Home Page !', {position: "bottom-center", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "light", onClose: ()=>{navigate('/')}});
            });
        }
    };

    useEffect(() => {
        recordingData.current = {
            sensorValues: {"870nmch1": [], "870nmch2": [], "870nmch3": [], "870nmch4": [], "660nmch1": [], "660nmch2": [], "660nmch3": [], "660nmch4": [], "1200nmch1": [], "1200nmch2": [], "1200nmch3": [], "1200nmch4": [], "1550nmch1": [], "1550nmch2": [], "1550nmch3": [], "1550nmch4": []},
            deltaValues: {"870nm": [], "660nm": [], "1200nm": [], "1550nm": []},
            concentrationValues: {"870nm": [], "660nm": [], "1200nm": [], "1550nm": []},
            highpassFilterValues: {"870nm": [], "660nm": [], "1200nm": [], "1550nm": []},
            tsiValues: {"870nm": [], "660nm": [], "1200nm": [], "1550nm": []}
        };

        setLiveStreamPageActive('text-current font-sans');
        setAcquisitionPageActive('text-blue-600 font-sans');
        setInfoPageActive('text-current font-sans');

        // Update Raw Sensor Data
        const updateDeltaA = (data) => {
            deltaAChart.current.data.datasets[0].data.push(data['870nmch1']);
            deltaAChart.current.data.datasets[1].data.push(data['870nmch2']);
            deltaAChart.current.data.datasets[2].data.push(data['870nmch3']);
            deltaAChart.current.data.datasets[3].data.push(data['870nmch4']);
            deltaAChart.current.data.datasets[4].data.push(data['660nmch1']);
            deltaAChart.current.data.datasets[5].data.push(data['660nmch2']);
            deltaAChart.current.data.datasets[6].data.push(data['660nmch3']);
            deltaAChart.current.data.datasets[7].data.push(data['660nmch4']);
            deltaAChart.current.data.datasets[8].data.push(data['1200nmch1']);
            deltaAChart.current.data.datasets[9].data.push(data['1200nmch2']);
            deltaAChart.current.data.datasets[10].data.push(data['1200nmch3']);
            deltaAChart.current.data.datasets[11].data.push(data['1200nmch4']);
            deltaAChart.current.data.datasets[12].data.push(data['1550nmch1']);
            deltaAChart.current.data.datasets[13].data.push(data['1550nmch2']);
            deltaAChart.current.data.datasets[14].data.push(data['1550nmch3']);
            deltaAChart.current.data.datasets[15].data.push(data['1550nmch4']);

            if(isRecording.current){
                recordingData.current['sensorValues']['870nmch1'].push(data['870nmch1']);
                recordingData.current['sensorValues']['870nmch2'].push(data['870nmch2']);
                recordingData.current['sensorValues']['870nmch3'].push(data['870nmch3']);
                recordingData.current['sensorValues']['870nmch4'].push(data['870nmch4']);
                recordingData.current['sensorValues']['660nmch1'].push(data['660nmch1']);
                recordingData.current['sensorValues']['660nmch2'].push(data['660nmch2']);
                recordingData.current['sensorValues']['660nmch3'].push(data['660nmch3']);
                recordingData.current['sensorValues']['660nmch4'].push(data['660nmch4']);
                recordingData.current['sensorValues']['1200nmch1'].push(data['1200nmch1']);
                recordingData.current['sensorValues']['1200nmch2'].push(data['1200nmch2']);
                recordingData.current['sensorValues']['1200nmch3'].push(data['1200nmch3']);
                recordingData.current['sensorValues']['1200nmch4'].push(data['1200nmch4']);
                recordingData.current['sensorValues']['1550nmch1'].push(data['1550nmch1']);
                recordingData.current['sensorValues']['1550nmch2'].push(data['1550nmch2']);
                recordingData.current['sensorValues']['1550nmch3'].push(data['1550nmch3']);
                recordingData.current['sensorValues']['1550nmch4'].push(data['1550nmch4']);
            }

            for(let dCount=0; dCount < deltaAChart.current.data.datasets.length; dCount++){
                if(deltaAChart.current.data.datasets[dCount].data.length > deltaAChart.current.data.labels.length){
                    deltaAChart.current.data.datasets[dCount].data.shift();
                }
            }
            deltaAChart.current.update('none');
        };

        // Update Diff Delta A Data
        const updateDiffDeltaA = (data) => {
            diffDeltaAChart.current.data.datasets[0].data.push(data['870nmch1']);
            diffDeltaAChart.current.data.datasets[1].data.push(data['870nmch2']);
            diffDeltaAChart.current.data.datasets[2].data.push(data['870nmch3']);
            diffDeltaAChart.current.data.datasets[3].data.push(data['870nmch4']);
            diffDeltaAChart.current.data.datasets[4].data.push(data['660nmch1']);
            diffDeltaAChart.current.data.datasets[5].data.push(data['660nmch2']);
            diffDeltaAChart.current.data.datasets[6].data.push(data['660nmch3']);
            diffDeltaAChart.current.data.datasets[7].data.push(data['660nmch4']);
            diffDeltaAChart.current.data.datasets[8].data.push(data['1200nmch1']);
            diffDeltaAChart.current.data.datasets[9].data.push(data['1200nmch2']);
            diffDeltaAChart.current.data.datasets[10].data.push(data['1200nmch3']);
            diffDeltaAChart.current.data.datasets[11].data.push(data['1200nmch4']);
            diffDeltaAChart.current.data.datasets[12].data.push(data['1550nmch1']);
            diffDeltaAChart.current.data.datasets[13].data.push(data['1550nmch2']);
            diffDeltaAChart.current.data.datasets[14].data.push(data['1550nmch3']);
            diffDeltaAChart.current.data.datasets[15].data.push(data['1550nmch4']);

            if(isRecording.current){
                recordingData.current['deltaValues']["870nmch1"].push(data['870nmch1']);
                recordingData.current['deltaValues']["870nmch2"].push(data['870nmch2']);
                recordingData.current['deltaValues']["870nmch3"].push(data['870nmch3']);
                recordingData.current['deltaValues']["870nmch4"].push(data['870nmch4']);
                recordingData.current['deltaValues']["660nmch1"].push(data['660nmch1']);
                recordingData.current['deltaValues']["660nmch2"].push(data['660nmch2']);
                recordingData.current['deltaValues']["660nmch3"].push(data['660nmch3']);
                recordingData.current['deltaValues']["660nmch4"].push(data['660nmch4']);
                recordingData.current['deltaValues']["1200nmch1"].push(data['1200nmch1']);
                recordingData.current['deltaValues']["1200nmch2"].push(data['1200nmch2']);
                recordingData.current['deltaValues']["1200nmch3"].push(data['1200nmch3']);
                recordingData.current['deltaValues']["1200nmch4"].push(data['1200nmch4']);
                recordingData.current['deltaValues']["1550nmch1"].push(data['1550nmch1']);
                recordingData.current['deltaValues']["1550nmch2"].push(data['1550nmch2']);
                recordingData.current['deltaValues']["1550nmch3"].push(data['1550nmch3']);
                recordingData.current['deltaValues']["1550nmch4"].push(data['1550nmch4']);
            }

            for(let dCount=0; dCount < diffDeltaAChart.current.data.datasets.length; dCount++){
                if(diffDeltaAChart.current.data.datasets[dCount].data.length > diffDeltaAChart.current.data.labels.length){
                    diffDeltaAChart.current.data.datasets[dCount].data.shift();
                }
            }
            diffDeltaAChart.current.update('none');
        };

        // Update Concentration Data
        const updateDeltaC = (data) => {
            deltaCChart.current.data.datasets[0].data.push(data['870nmch1']);
            deltaCChart.current.data.datasets[1].data.push(data['870nmch2']);
            deltaCChart.current.data.datasets[2].data.push(data['870nmch3']);
            deltaCChart.current.data.datasets[3].data.push(data['870nmch4']);
            deltaCChart.current.data.datasets[4].data.push(data['660nmch1']);
            deltaCChart.current.data.datasets[5].data.push(data['660nmch2']);
            deltaCChart.current.data.datasets[6].data.push(data['660nmch3']);
            deltaCChart.current.data.datasets[7].data.push(data['660nmch4']);
            deltaCChart.current.data.datasets[8].data.push(data['1200nmch1']);
            deltaCChart.current.data.datasets[9].data.push(data['1200nmch2']);
            deltaCChart.current.data.datasets[10].data.push(data['1200nmch3']);
            deltaCChart.current.data.datasets[11].data.push(data['1200nmch4']);
            deltaCChart.current.data.datasets[12].data.push(data['1550nmch1']);
            deltaCChart.current.data.datasets[13].data.push(data['1550nmch2']);
            deltaCChart.current.data.datasets[14].data.push(data['1550nmch3']);
            deltaCChart.current.data.datasets[15].data.push(data['1550nmch4']);

            if(isRecording.current){
                recordingData.current['concentrationValues']["870nmch1"].push(data['870nmch1']);
                recordingData.current['concentrationValues']["870nmch2"].push(data['870nmch2']);
                recordingData.current['concentrationValues']["870nmch3"].push(data['870nmch3']);
                recordingData.current['concentrationValues']["870nmch4"].push(data['870nmch4']);
                recordingData.current['concentrationValues']["660nmch1"].push(data['660nmch1']);
                recordingData.current['concentrationValues']["660nmch2"].push(data['660nmch2']);
                recordingData.current['concentrationValues']["660nmch3"].push(data['660nmch3']);
                recordingData.current['concentrationValues']["660nmch4"].push(data['660nmch4']);
                recordingData.current['concentrationValues']["1200nmch1"].push(data['1200nmch1']);
                recordingData.current['concentrationValues']["1200nmch2"].push(data['1200nmch2']);
                recordingData.current['concentrationValues']["1200nmch3"].push(data['1200nmch3']);
                recordingData.current['concentrationValues']["1200nmch4"].push(data['1200nmch4']);
                recordingData.current['concentrationValues']["1550nmch1"].push(data['1550nmch1']);
                recordingData.current['concentrationValues']["1550nmch2"].push(data['1550nmch2']);
                recordingData.current['concentrationValues']["1550nmch3"].push(data['1550nmch3']);
                recordingData.current['concentrationValues']["1550nmch4"].push(data['1550nmch4']);
            }

            for(let dCount=0; dCount < deltaCChart.current.data.datasets.length; dCount++){
                if(deltaCChart.current.data.datasets[dCount].data.length > deltaCChart.current.data.labels.length){
                    deltaCChart.current.data.datasets[dCount].data.shift();
                }
            }
            deltaCChart.current.update('none');
        };

        // Update Concentration @ Highpass Data
        const updateHighpass = (data) => {
            highpassChart.current.data.datasets[0].data.push(data['870nm']);
            highpassChart.current.data.datasets[1].data.push(data['660nm']);

            if(isRecording.current){
                recordingData.current['highpassFilterValues']["870nm"].push(data['870nm']);
                recordingData.current['highpassFilterValues']["660nm"].push(data['660nm']);
            }    

            for(let dCount=0; dCount < highpassChart.current.data.datasets.length; dCount++){
                if(highpassChart.current.data.datasets[dCount].data.length > highpassChart.current.data.labels.length){
                    highpassChart.current.data.datasets[dCount].data.shift();
                }
            }
            highpassChart.current.update('none');
        };

        // Update Tissue Saturation Index Data
        const updateTsi = (data) => {
            tsiChart.current.data.datasets[0].data.push(data['870nm']);
            tsiChart.current.data.datasets[1].data.push(data['660nm']);

            if(isRecording.current){
                recordingData.current['tsiValues']["870nm"].push(data['870nm']);
                recordingData.current['tsiValues']["660nm"].push(data['660nm']);
            }

            for(let dCount=0; dCount < tsiChart.current.data.datasets.length; dCount++){
                if(tsiChart.current.data.datasets[dCount].data.length > tsiChart.current.data.labels.length){
                    tsiChart.current.data.datasets[dCount].data.shift();
                }
            }
            tsiChart.current.update('none');
        };

        // Setting Device ID
        const idSetter = (data) => {
            setDeviceID(data);
        };

        // Attach update function to socket event triggers
        fnirsSocket.current.on('upMSGA', updateDeltaA);
        fnirsSocket.current.on('upMSGdeltaA', updateDiffDeltaA);
        fnirsSocket.current.on('upMSGC', updateDeltaC);
        fnirsSocket.current.on('upMSGCHP', updateHighpass);
        fnirsSocket.current.on('upMSGTSI', updateTsi);
        fnirsSocket.current.on('devID', idSetter);

        // Detach the socket of component unmount
        return ()=> {
            if(fnirsSocket.current.connected){
                fnirsSocket.current.off('upMSGA', updateDeltaA);
                fnirsSocket.current.off('upMSGdeltaA', updateDiffDeltaA);
                fnirsSocket.current.off('upMSGC', updateDeltaC);
                fnirsSocket.current.off('upMSGCHP', updateHighpass);
                fnirsSocket.current.off('upMSGTSI', updateTsi);
                fnirsSocket.current.off('devID', idSetter);
            }
        };
    }, []);

    // Main component definition
    return (
        <div>
            <Modal isOpen={modalOpen} isDismissable={false} hideCloseButton={true} scrollBehavior="inside" size="5xl" backdrop="blur">
                <ModalContent>
                    <ModalHeader className="justify-center">WMA DECLARATION OF HELSINKI</ModalHeader>
                    <ModalBody>
                        <div className="text-lg font-medium">Introduction</div>
                        <div className="text-sm">This agreement is designed to inform you, the patient, about how your medical data will be used exclusively for research purposes, following the ethical principles outlined in the Declaration of Helsinki. Our goal is to advance medical knowledge and improve public health outcomes while respecting your rights and privacy.</div>
                        <div className="text-lg font-medium">Key Points</div>
                        <ol className="text-sm list-decimal">
                            <li><div className="font-medium">Respect and Care: </div>Your dignity, rights, and well-being are our top priorities. We are committed to protecting your health and privacy throughout the research process.</li>
                            <li><div className="font-medium">Informed Consent: </div>Before using your data, we will explain the purpose of the research, how it will be conducted, and any potential benefits or risks. Your participation is entirely voluntary, and you must provide informed consent.</li>
                            <li><div className="font-medium">Privacy Protection: </div>We will take all necessary steps to protect your privacy and keep your personal information confidential. Your data will be anonymized whenever possible to prevent identification.</li>                        
                        </ol>
                        <div className="text-lg font-medium">Your Rights</div>
                        <ol className="text-sm list-decimal">
                            <li><div className="font-medium">Research Use Only: </div>Your medical data will only be used for research aimed at understanding diseases, improving diagnostic methods, and developing new treatments. It will not be used for commercial purposes or shared outside of approved research projects.</li>
                            <li><div className="font-medium">Right to Withdraw: </div>You have the right to withdraw your consent at any time without any negative consequences. This decision will not affect your relationship with healthcare providers or access to medical care.</li>
                            <li><div className="font-medium">Access to Results: </div>You can choose to be informed about the general outcomes and results of the research in which your data was used.</li>
                        </ol>
                        <div className="text-lg font-medium">Commitment to Ethical Standards</div>
                        <div className="text-sm">This agreement ensures that all research activities involving your data are conducted ethically and responsibly, in line with international guidelines. By agreeing to participate, you acknowledge that you understand these terms and consent to the use of your medical data for research purposes under these conditions.</div>
                        <Link isBlock showAnchorIcon href="https://www.wma.net/policies-post/wma-declaration-of-helsinki" color="danger" isExternal="true">WMA DECLARATION OF HELSINKI</Link>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="shadow" onPress={() => {
                            setAgreementCheck(false);
                            setChipStatus("Declined");
                            setChipColor("danger");
                            setModalOpen(true);
                            navigate('/');
                        }}>Decline</Button>
                        <Button color="primary" variant="shadow" onPress={() => {
                            setAgreementCheck(true);
                            setChipStatus("Accepted");
                            setChipColor("success");
                            setModalOpen(false)
                        }}>Accept</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <div className="flex flex-col sm:flex-row flex-wrap m-3">
                <div className="w-2/3"><ChartsComponent /></div>
                <Card className="sm:max-h-[735px] mt-2 w-full sm:w-1/3 sm:m-0">
                    <CardHeader className="font-sans font-medium italic justify-center">Enter Details for Data Acquisition</CardHeader>
                    <CardBody className="flex flex-col p-4">
                        <div className="flex flex-col lg:flex-row gap-2">
                            <Input isRequired type="text" label="Patient Name" value={patientName} onChange={(event) => {
                                setPatientName(event.target.value);
                            }}/>
                            <DatePicker isRequired label="Date of Birth" onChange={(eventVal) => {
                                setPatientDOB(`${eventVal.day}-${eventVal.month}-${eventVal.year}`);
                            }} />
                        </div>
                        <div className="flex flex-col lg:flex-row gap-2 mt-2">
                            <Input type="email" label="Email" value={patientEmail} onChange={(event) => {setPatientEmail(event.target.value)}} />
                            <Input type="text" label="Phone" value={patientPhone} onChange={(event) => {
                                setPatientPhone(event.target.value);
                            }} />
                        </div>
                        <Input className="gap-2 mt-2" type="text" label="Address" value={patientAddress} onChange={(event) => {setPatientAddress(event.target.value)}} />
                        <div className="flex flex-col lg:flex-row gap-2 mt-2">
                            <Input isRequired type="text" label="City" value={patientCity} onChange={(event) => {setPatientCity(event.target.value)}} />
                            <Input isRequired type="text" label="Country" value={patientCountry} onChange={(event) => {setPatientCountry(event.target.value)}} />
                        </div>
                        <div className="flex flex-col lg:flex-row justify-between gap-2 mt-2">
                            <RadioGroup isRequired label="Gender" orientation="horizontal" value={patientGender} onValueChange={setPatientGender}>
                                <Radio value="male">Male</Radio>
                                <Radio value="female">Female</Radio>
                            </RadioGroup>
                            <div className="content-center">Agreement Status: <Chip color={chipColor} variant="shadow">{chipStatus}</Chip></div>
                        </div>
                        <Input isRequired className="gap-2 mt-2" type="text" label="Current Glucose Levels" value={patientGlucose} onChange={(event) => {setPatientGlucose(event.target.value)}} />
                        <Textarea className="mt-2" label="Description" variant="bordered" value={patientDescription} onChange={(event) => {setPatientDescription(event.target.value)}} />
                        
                    </CardBody>
                    <CardFooter className="flex flex-row justify-end gap-2">
                        <Button color={recordingButtonColor} variant="shadow" onPress={startStopRecording}>{recordingButtonStatus}</Button>
                        <Button color="danger" variant="shadow" onPress={dataReset}>Reset Data</Button>
                        <Button color="primary" variant="shadow" onPress={submitPresser}>Submit</Button>
                    </CardFooter>
                    <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false}
                            closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
                </Card>
            </div>
        </div>
    );
}
