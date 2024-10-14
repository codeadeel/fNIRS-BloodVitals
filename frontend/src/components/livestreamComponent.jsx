import { useState, useEffect, useContext } from "react";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import { io } from 'socket.io-client';
import FnirsContext from "../tools/contextStore";
import ChartsComponent from "./chartsComponent";

// This component is responsible for the livestreaming of edge data over websockets

export default function LiveStream(){
    // Import states from the context store
    const {setDeviceID, setLiveStreamPageActive, setInfoPageActive, deltaAChart, diffDeltaAChart, deltaCChart, highpassChart, tsiChart} = useContext(FnirsContext);

    // Initializes labels & values to the cards
    const [deltaAAvg0Label, setDeltaAAvg0Label] = useState('Avg Label');
    const [diffDeltaAAvg0Label, setDiffDeltaAAvg0Label] = useState('Avg Label');
    const [deltaCAvg0Label, setDeltaCAvg0Label] = useState('Avg Label');
    const [highpassAvg0Label, setHighpassAvg0Label] = useState('Avg Label');
    const [tsiAvg0Label, setTsiAvg0Label] = useState('Avg Label');

    const [deltaAAvg1Label, setDeltaAAvg1Label] = useState('Avg Label');
    const [diffDeltaAAvg1Label, setDiffDeltaAAvg1Label] = useState('Avg Label');
    const [deltaCAvg1Label, setDeltaCAvg1Label] = useState('Avg Label');
    const [highpassAvg1Label, setHighpassAvg1Label] = useState('Avg Label');
    const [tsiAvg1Label, setTsiAvg1Label] = useState(0);

    const [deltaAAvg0, setDeltaAAvg0] = useState(0);
    const [diffDeltaAAvg0, setDiffDeltaAAvg0] = useState(0);
    const [deltaCAvg0, setDeltaCAvg0] = useState(0);
    const [highpassAvg0, setHighpassAvg0] = useState(0);
    const [tsiAvg0, setTsiAvg0] = useState(0);

    const [deltaAAvg1, setDeltaAAvg1] = useState(0);
    const [diffDeltaAAvg1, setDiffDeltaAAvg1] = useState(0);
    const [deltaCAvg1, setDeltaCAvg1] = useState(0);
    const [highpassAvg1, setHighpassAvg1] = useState(0);
    const [tsiAvg1, setTsiAvg1] = useState(0);

    const [deltaACurrent0Label, setDeltaACurrent0Label] = useState('Label');
    const [diffDeltaACurrent0Label, setDiffDeltaACurrent0Label] = useState('Label');
    const [deltaCCurrent0Label, setDeltaCCurrent0Label] = useState('Label');
    const [highpassCurrent0Label, setHighpassCurrent0Label] = useState('Label');
    const [tsiCurrent0Label, setTsiCurrent0Label] = useState('Label');

    const [deltaACurrent1Label, setDeltaACurrent1Label] = useState('Label');
    const [diffDeltaACurrent1Label, setDiffDeltaACurrent1Label] = useState('Label');
    const [deltaCCurrent1Label, setDeltaCCurrent1Label] = useState('Label');
    const [highpassCurrent1Label, setHighpassCurrent1Label] = useState('Label');
    const [tsiCurrent1Label, setTsiCurrent1Label] = useState('Label');
    
    const [deltaACurrent0, setDeltaACurrent0] = useState(0)
    const [diffDeltaACurrent0, setDiffDeltaACurrent0] = useState(0)
    const [deltaCCurrent0, setDeltaCCurrent0] = useState(0)
    const [highpassCurrent0, setHighpassCurrent0] = useState(0)
    const [tsiCurrent0, setTsiCurrent0] = useState(0)

    const [deltaACurrent1, setDeltaACurrent1] = useState(0)
    const [diffDeltaACurrent1, setDiffDeltaACurrent1] = useState(0)
    const [deltaCCurrent1, setDeltaCCurrent1] = useState(0)
    const [highpassCurrent1, setHighpassCurrent1] = useState(0)
    const [tsiCurrent1, setTsiCurrent1] = useState(0)

    // Initialize sockets, update data of charts & cards upon event occurence
    useEffect(() => {
        const fnirsSocket = io(window.location.origin, {transports: ['websocket']});
        fnirsSocket.connect();

        setLiveStreamPageActive('text-blue-600 font-sans');
        setInfoPageActive('text-current font-sans');
        
        setDeltaAAvg0Label(deltaAChart.current.data.datasets[0].label.split(" ")[0]);
        setDeltaAAvg1Label(deltaAChart.current.data.datasets[1].label.split(" ")[0]);
        setDeltaACurrent0Label(deltaAChart.current.data.datasets[0].label.split(" ")[0]);
        setDeltaACurrent1Label(deltaAChart.current.data.datasets[1].label.split(" ")[0]);

        setDiffDeltaAAvg0Label(diffDeltaAChart.current.data.datasets[0].label.split(" ")[0]);
        setDiffDeltaAAvg1Label(diffDeltaAChart.current.data.datasets[1].label.split(" ")[0]);
        setDiffDeltaACurrent0Label(diffDeltaAChart.current.data.datasets[0].label.split(" ")[0]);
        setDiffDeltaACurrent1Label(diffDeltaAChart.current.data.datasets[1].label.split(" ")[0]);

        setDeltaCAvg0Label(deltaCChart.current.data.datasets[0].label.split(" ")[0]);
        setDeltaCAvg1Label(deltaCChart.current.data.datasets[1].label.split(" ")[0]);
        setDeltaCCurrent0Label(deltaCChart.current.data.datasets[0].label.split(" ")[0]);
        setDeltaCCurrent1Label(deltaCChart.current.data.datasets[1].label.split(" ")[0]);

        setHighpassAvg0Label(highpassChart.current.data.datasets[0].label.split(" ")[0]);
        setHighpassAvg1Label(highpassChart.current.data.datasets[1].label.split(" ")[0]);
        setHighpassCurrent0Label(highpassChart.current.data.datasets[0].label.split(" ")[0]);
        setHighpassCurrent1Label(highpassChart.current.data.datasets[1].label.split(" ")[0]);

        setTsiAvg0Label(tsiChart.current.data.datasets[0].label.split(" ")[0]);
        setTsiAvg1Label(tsiChart.current.data.datasets[1].label.split(" ")[0]);
        setTsiCurrent0Label(tsiChart.current.data.datasets[0].label.split(" ")[0]);
        setTsiCurrent1Label(tsiChart.current.data.datasets[1].label.split(" ")[0]);

        const avgFinder = (lister) => {
            var adder = 0;
            for(let i=0; i<lister.length; i++){
                adder += lister[i];
            }
            return (adder/lister.length).toFixed(5);
        }

        // Update Raw Sensor Data
        const updateDeltaA = (data) => {
            deltaAChart.current.data.datasets[0].data.push(data['870nm']);
            deltaAChart.current.data.datasets[1].data.push(data['940nm']);
            deltaAChart.current.data.datasets[2].data.push(data['1200nm']);
            deltaAChart.current.data.datasets[3].data.push(data['1550nm']);
            if(deltaAChart.current.data.datasets[0].data.length > deltaAChart.current.data.labels.length){
                deltaAChart.current.data.datasets[0].data.shift();
            }
            if(deltaAChart.current.data.datasets[1].data.length > deltaAChart.current.data.labels.length){
                deltaAChart.current.data.datasets[1].data.shift();
            }
            if(deltaAChart.current.data.datasets[2].data.length > deltaAChart.current.data.labels.length){
                deltaAChart.current.data.datasets[2].data.shift();
            }
            if(deltaAChart.current.data.datasets[3].data.length > deltaAChart.current.data.labels.length){
                deltaAChart.current.data.datasets[3].data.shift();
            }
            deltaAChart.current.update('none');
            setDeltaAAvg0(()=>{
                return avgFinder(deltaAChart.current.data.datasets[0].data);
            });
            setDeltaAAvg1(()=>{
                return avgFinder(deltaAChart.current.data.datasets[1].data);
            });
            setDeltaACurrent0(()=>{
                return deltaAChart.current.data.datasets[0].data[deltaAChart.current.data.datasets[0].data.length-1].toFixed(3);
            });
            setDeltaACurrent1(()=>{
                return deltaAChart.current.data.datasets[1].data[deltaAChart.current.data.datasets[1].data.length-1].toFixed(3);
            });
        };

        // Update Diff Delta A Data
        const updateDiffDeltaA = (data) => {
            diffDeltaAChart.current.data.datasets[0].data.push(data['870nm']);
            diffDeltaAChart.current.data.datasets[1].data.push(data['940nm']);
            diffDeltaAChart.current.data.datasets[0].data.push(data['1200nm']);
            diffDeltaAChart.current.data.datasets[1].data.push(data['1550nm']);
            if(diffDeltaAChart.current.data.datasets[0].data.length > diffDeltaAChart.current.data.labels.length){
                diffDeltaAChart.current.data.datasets[0].data.shift();
            }
            if(diffDeltaAChart.current.data.datasets[1].data.length > diffDeltaAChart.current.data.labels.length){
                diffDeltaAChart.current.data.datasets[1].data.shift();
            }
            if(diffDeltaAChart.current.data.datasets[2].data.length > diffDeltaAChart.current.data.labels.length){
                diffDeltaAChart.current.data.datasets[2].data.shift();
            }
            if(diffDeltaAChart.current.data.datasets[3].data.length > diffDeltaAChart.current.data.labels.length){
                diffDeltaAChart.current.data.datasets[3].data.shift();
            }
            diffDeltaAChart.current.update('none');
            setDiffDeltaAAvg0(()=>{
                return avgFinder(diffDeltaAChart.current.data.datasets[0].data);
            });
            setDiffDeltaAAvg1(()=>{
                return avgFinder(diffDeltaAChart.current.data.datasets[1].data);
            });
            setDiffDeltaACurrent0(()=>{
                return diffDeltaAChart.current.data.datasets[0].data[diffDeltaAChart.current.data.datasets[0].data.length-1].toFixed(3);
            });
            setDiffDeltaACurrent1(()=>{
                return diffDeltaAChart.current.data.datasets[1].data[diffDeltaAChart.current.data.datasets[1].data.length-1].toFixed(3);
            });
        };

        // Update Concentration Data
        const updateDeltaC = (data) => {
            deltaCChart.current.data.datasets[0].data.push(data['870nm']);
            deltaCChart.current.data.datasets[1].data.push(data['940nm']);
            if(deltaCChart.current.data.datasets[0].data.length > deltaCChart.current.data.labels.length){
                deltaCChart.current.data.datasets[0].data.shift();
            }
            if(deltaCChart.current.data.datasets[1].data.length > deltaCChart.current.data.labels.length){
                deltaCChart.current.data.datasets[1].data.shift();
            }
            deltaCChart.current.update('none');
            setDeltaCAvg0(()=>{
                return avgFinder(deltaCChart.current.data.datasets[0].data);
            });
            setDeltaCAvg1(()=>{
                return avgFinder(deltaCChart.current.data.datasets[1].data);
            });
            setDeltaCCurrent0(()=>{
                return deltaCChart.current.data.datasets[0].data[deltaCChart.current.data.datasets[0].data.length-1].toFixed(3);
            });
            setDeltaCCurrent1(()=>{
                return deltaCChart.current.data.datasets[1].data[deltaCChart.current.data.datasets[1].data.length-1].toFixed(3);
            });
        };

        // Update Concentration @ Highpass Data
        const updateHighpass = (data) => {
            highpassChart.current.data.datasets[0].data.push(data['870nm']);
            highpassChart.current.data.datasets[1].data.push(data['940nm']);
            if(highpassChart.current.data.datasets[0].data.length > highpassChart.current.data.labels.length){
                highpassChart.current.data.datasets[0].data.shift();
            }
            if(highpassChart.current.data.datasets[1].data.length > highpassChart.current.data.labels.length){
                highpassChart.current.data.datasets[1].data.shift();
            }
            highpassChart.current.update('none');
            setHighpassAvg0(()=>{
                return avgFinder(highpassChart.current.data.datasets[0].data);
            });
            setHighpassAvg1(()=>{
                return avgFinder(highpassChart.current.data.datasets[1].data);
            });
            setHighpassCurrent0(()=>{
                return highpassChart.current.data.datasets[0].data[highpassChart.current.data.datasets[0].data.length-1].toFixed(3);
            });
            setHighpassCurrent1(()=>{
                return highpassChart.current.data.datasets[1].data[highpassChart.current.data.datasets[1].data.length-1].toFixed(3);
            });
        };

        // Update Tissue Saturation Index Data
        const updateTsi = (data) => {
            tsiChart.current.data.datasets[0].data.push(data['870nm']);
            tsiChart.current.data.datasets[1].data.push(data['940nm']);
            if(tsiChart.current.data.datasets[0].data.length > tsiChart.current.data.labels.length){
                tsiChart.current.data.datasets[0].data.shift();
            }
            if(tsiChart.current.data.datasets[1].data.length > tsiChart.current.data.labels.length){
                tsiChart.current.data.datasets[1].data.shift();
            }
            tsiChart.current.update('none');
            setTsiAvg0(()=>{
                return (avgFinder(tsiChart.current.data.datasets[0].data) * 100).toFixed(5);
            });
            setTsiAvg1(()=>{
                return (avgFinder(tsiChart.current.data.datasets[1].data) * 100).toFixed(5);
            });
            setTsiCurrent0(()=>{
                return (tsiChart.current.data.datasets[0].data[tsiChart.current.data.datasets[0].data.length-1] * 100).toFixed(2);
            });
            setTsiCurrent1(()=>{
                return (tsiChart.current.data.datasets[1].data[tsiChart.current.data.datasets[1].data.length-1] * 100).toFixed(2);
            });
        };

        // Setting Device ID
        const idSetter = (data) => {
            setDeviceID(data);
        };

        // Attach update function to socket event triggers
        fnirsSocket.on('upMSGA', updateDeltaA);
        fnirsSocket.on('upMSGdeltaA', updateDiffDeltaA);
        fnirsSocket.on('upMSGC', updateDeltaC);
        fnirsSocket.on('upMSGCHP', updateHighpass);
        fnirsSocket.on('upMSGTSI', updateTsi);
        fnirsSocket.on('devID', idSetter);

        // Detach the socket of component unmount
        return ()=> {
            if(fnirsSocket.connected){
                fnirsSocket.off('upMSGA', updateDeltaA);
                fnirsSocket.off('upMSGdeltaA', updateDiffDeltaA);
                fnirsSocket.off('upMSGC', updateDeltaC);
                fnirsSocket.off('upMSGCHP', updateHighpass);
                fnirsSocket.off('upMSGTSI', updateTsi);
                fnirsSocket.off('devID', idSetter);
                fnirsSocket.disconnect();
            }
        };
    }, []);

    // Main component definition
    return (
        <div className="flex flex-col sm:flex-row flex-wrap m-3">
            <div className="w-2/3"><ChartsComponent /></div>
            <div className="flex flex-col mt-3 sm:flex-row  sm:m-0 w-1/3 flex-wrap gap-3">
                <Card className="max-h-40 w-72">
                    <CardHeader className="font-sans font-medium italic">Sensor Raw Values (A)</CardHeader>
                    <CardBody className="flex flex-row place-content-evenly">
                        <div className="flex flex-col justify-end">
                            <div>{deltaAAvg0Label}</div>
                            <div className="text-green-500 text-xl font-bold">{deltaAAvg0}</div>
                        </div>
                        <div className="flex flex-col justify-end">
                            <div>{deltaAAvg1Label}</div>
                            <div className="text-green-500 text-xl font-bold">{deltaAAvg1}</div>
                        </div>
                    </CardBody>
                    <CardFooter className="flex flex-row place-content-evenly">
                        <div className="flex flex-row text-sm justify-start"><div className="font-semibold">Current {deltaACurrent0Label}:</div> {deltaACurrent0}</div>
                        <div className="flex flex-row text-sm justify-start"><div className="font-semibold">Current {deltaACurrent1Label}:</div> {deltaACurrent1}</div>
                    </CardFooter>
                </Card>

                <Card className="max-h-40 w-72">
                    <CardHeader className="font-sans font-medium italic">Delta A</CardHeader>
                    <CardBody className="flex flex-row place-content-evenly">
                        <div className="flex flex-col justify-end">
                            <div>{diffDeltaAAvg0Label}</div>
                            <div className="text-green-500 text-xl font-bold">{diffDeltaAAvg0}</div>
                        </div>
                        <div className="flex flex-col justify-end">
                            <div>{diffDeltaAAvg1Label}</div>
                            <div className="text-green-500 text-xl font-bold">{diffDeltaAAvg1}</div>
                        </div>
                    </CardBody>
                    <CardFooter className="flex flex-row place-content-evenly">
                        <div className="flex flex-row text-sm justify-start"><div className="font-semibold">Current {diffDeltaACurrent0Label}:</div> {diffDeltaACurrent0}</div>
                        <div className="flex flex-row text-sm justify-start"><div className="font-semibold">Current {diffDeltaACurrent1Label}:</div> {diffDeltaACurrent1}</div>
                    </CardFooter>
                </Card>

                <Card className="max-h-40 w-72">
                    <CardHeader className="font-sans font-medium italic">Concentration ( 𝚫C )</CardHeader>
                    <CardBody className="flex flex-row place-content-evenly">
                        <div className="flex flex-col justify-end">
                            <div>{deltaCAvg0Label}</div>
                            <div className="text-green-500 text-xl font-bold">{deltaCAvg0}</div>
                        </div>
                        <div className="flex flex-col justify-end">
                            <div>{deltaCAvg1Label}</div>
                            <div className="text-green-500 text-xl font-bold">{deltaCAvg1}</div>
                        </div>
                    </CardBody>
                    <CardFooter className="flex flex-row place-content-evenly">
                        <div className="flex flex-row text-sm justify-start"><div className="font-semibold">Current {deltaCCurrent0Label}:</div> {deltaCCurrent0}</div>
                        <div className="flex flex-row text-sm justify-start"><div className="font-semibold">Current {deltaCCurrent1Label}:</div> {deltaCCurrent1}</div>
                    </CardFooter>
                </Card>

                <Card className="max-h-40 w-72">
                    <CardHeader className="font-sans font-medium italic">𝚫C @ Highpass Filter</CardHeader>
                    <CardBody className="flex flex-row place-content-evenly">
                        <div className="flex flex-col justify-end">
                            <div>{highpassAvg0Label}</div>
                            <div className="text-green-500 text-xl font-bold">{highpassAvg0}</div>
                        </div>
                        <div className="flex flex-col justify-end">
                            <div>{highpassAvg1Label}</div>
                            <div className="text-green-500 text-xl font-bold">{highpassAvg1}</div>
                        </div>
                    </CardBody>
                    <CardFooter className="flex flex-row place-content-evenly">
                        <div className="flex flex-row text-sm justify-start"><div className="font-semibold">Current {highpassCurrent0Label}:</div> {highpassCurrent0}</div>
                        <div className="flex flex-row text-sm justify-start"><div className="font-semibold">Current {highpassCurrent1Label}:</div> {highpassCurrent1}</div>
                    </CardFooter>
                </Card>

                <Card className="max-h-40 w-72">
                    <CardHeader className="font-sans font-medium italic">Tissue Saturation Index</CardHeader>
                    <CardBody className="flex flex-row place-content-evenly">
                        <div className="flex flex-col justify-end">
                            <div>{tsiAvg0Label}</div>
                            <div className="text-green-500 text-xl font-bold">{tsiAvg0}</div>
                        </div>
                        <div className="flex flex-col justify-end">
                            <div>{tsiAvg1Label}</div>
                            <div className="text-green-500 text-xl font-bold">{tsiAvg1}</div>
                        </div>
                    </CardBody>
                    <CardFooter className="flex flex-row place-content-evenly">
                        <div className="flex flex-row text-sm justify-start"><div className="font-semibold">Current {tsiCurrent0Label}:</div> {tsiCurrent0}</div>
                        <div className="flex flex-row text-sm justify-start"><div className="font-semibold">Current {tsiCurrent1Label}:</div> {tsiCurrent1}</div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
