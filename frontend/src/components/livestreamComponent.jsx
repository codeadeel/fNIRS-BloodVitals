import { useState, useEffect, useContext } from "react";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import FnirsContext from "../tools/contextStore";
import ChartsComponent from "./chartsComponent";

// This component is responsible for the livestreaming of edge data over websockets

export default function LiveStream(){
    // Import states from the context store
    const {fnirsSocket, setDeviceID, setLiveStreamPageActive, setAcquisitionPageActive, setInfoPageActive, deltaAChart, diffDeltaAChart, deltaCChart, highpassChart, tsiChart} = useContext(FnirsContext);

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
    const [tsiAvg1Label, setTsiAvg1Label] = useState('Avg Label');

    const [deltaAAvg2Label, setDeltaAAvg2Label] = useState('Avg Label');
    const [diffDeltaAAvg2Label, setDiffDeltaAAvg2Label] = useState('Avg Label');
    const [deltaCAvg2Label, setDeltaCAvg2Label] = useState('Avg Label');
    const [highpassAvg2Label, setHighpassAvg2Label] = useState('Avg Label');
    const [tsiAvg2Label, setTsiAvg2Label] = useState('Avg Label');

    const [deltaAAvg3Label, setDeltaAAvg3Label] = useState('Avg Label');
    const [diffDeltaAAvg3Label, setDiffDeltaAAvg3Label] = useState('Avg Label');
    const [deltaCAvg3Label, setDeltaCAvg3Label] = useState('Avg Label');
    const [highpassAvg3Label, setHighpassAvg3Label] = useState('Avg Label');
    const [tsiAvg3Label, setTsiAvg3Label] = useState('Avg Label');

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

    const [deltaAAvg2, setDeltaAAvg2] = useState(0);
    const [diffDeltaAAvg2, setDiffDeltaAAvg2] = useState(0);
    const [deltaCAvg2, setDeltaCAvg2] = useState(0);
    const [highpassAvg2, setHighpassAvg2] = useState(0);
    const [tsiAvg2, setTsiAvg2] = useState(0);

    const [deltaAAvg3, setDeltaAAvg3] = useState(0);
    const [diffDeltaAAvg3, setDiffDeltaAAvg3] = useState(0);
    const [deltaCAvg3, setDeltaCAvg3] = useState(0);
    const [highpassAvg3, setHighpassAvg3] = useState(0);
    const [tsiAvg3, setTsiAvg3] = useState(0);

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

    const [deltaACurrent2Label, setDeltaACurrent2Label] = useState('Label');
    const [diffDeltaACurrent2Label, setDiffDeltaACurrent2Label] = useState('Label');
    const [deltaCCurrent2Label, setDeltaCCurrent2Label] = useState('Label');
    const [highpassCurrent2Label, setHighpassCurrent2Label] = useState('Label');
    const [tsiCurrent2Label, setTsiCurrent2Label] = useState('Label');

    const [deltaACurrent3Label, setDeltaACurrent3Label] = useState('Label');
    const [diffDeltaACurrent3Label, setDiffDeltaACurrent3Label] = useState('Label');
    const [deltaCCurrent3Label, setDeltaCCurrent3Label] = useState('Label');
    const [highpassCurrent3Label, setHighpassCurrent3Label] = useState('Label');
    const [tsiCurrent3Label, setTsiCurrent3Label] = useState('Label');
    
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

    const [deltaACurrent2, setDeltaACurrent2] = useState(0)
    const [diffDeltaACurrent2, setDiffDeltaACurrent2] = useState(0)
    const [deltaCCurrent2, setDeltaCCurrent2] = useState(0)
    const [highpassCurrent2, setHighpassCurrent2] = useState(0)
    const [tsiCurrent2, setTsiCurrent2] = useState(0)

    const [deltaACurrent3, setDeltaACurrent3] = useState(0)
    const [diffDeltaACurrent3, setDiffDeltaACurrent3] = useState(0)
    const [deltaCCurrent3, setDeltaCCurrent3] = useState(0)
    const [highpassCurrent3, setHighpassCurrent3] = useState(0)
    const [tsiCurrent3, setTsiCurrent3] = useState(0)

    // Initialize sockets, update data of charts & cards upon event occurence
    useEffect(() => {
        setLiveStreamPageActive('text-blue-600 font-sans');
        setAcquisitionPageActive('text-current font-sans');
        setInfoPageActive('text-current font-sans');
        
        setDeltaAAvg0Label(deltaAChart.current.data.datasets[0].label.split(" ")[0]);
        setDeltaAAvg1Label(deltaAChart.current.data.datasets[4].label.split(" ")[0]);
        setDeltaAAvg2Label(deltaAChart.current.data.datasets[8].label.split(" ")[0])
        setDeltaAAvg3Label(deltaAChart.current.data.datasets[12].label.split(" ")[0])
        setDeltaACurrent0Label(deltaAChart.current.data.datasets[0].label.split(" ")[0]);
        setDeltaACurrent1Label(deltaAChart.current.data.datasets[4].label.split(" ")[0]);
        setDeltaACurrent2Label(deltaAChart.current.data.datasets[8].label.split(" ")[0]);
        setDeltaACurrent3Label(deltaAChart.current.data.datasets[12].label.split(" ")[0]);

        setDiffDeltaAAvg0Label(diffDeltaAChart.current.data.datasets[0].label.split(" ")[0]);
        setDiffDeltaAAvg1Label(diffDeltaAChart.current.data.datasets[4].label.split(" ")[0]);
        setDiffDeltaAAvg2Label(diffDeltaAChart.current.data.datasets[8].label.split(" ")[0]);
        setDiffDeltaAAvg3Label(diffDeltaAChart.current.data.datasets[12].label.split(" ")[0]);
        setDiffDeltaACurrent0Label(diffDeltaAChart.current.data.datasets[0].label.split(" ")[0]);
        setDiffDeltaACurrent1Label(diffDeltaAChart.current.data.datasets[4].label.split(" ")[0]);
        setDiffDeltaACurrent2Label(diffDeltaAChart.current.data.datasets[8].label.split(" ")[0]);
        setDiffDeltaACurrent3Label(diffDeltaAChart.current.data.datasets[12].label.split(" ")[0]);

        setDeltaCAvg0Label(deltaCChart.current.data.datasets[0].label.split(" ")[0]);
        setDeltaCAvg1Label(deltaCChart.current.data.datasets[4].label.split(" ")[0]);
        setDeltaCAvg2Label(deltaCChart.current.data.datasets[8].label.split(" ")[0]);
        setDeltaCAvg3Label(deltaCChart.current.data.datasets[12].label.split(" ")[0]);
        setDeltaCCurrent0Label(deltaCChart.current.data.datasets[0].label.split(" ")[0]);
        setDeltaCCurrent1Label(deltaCChart.current.data.datasets[4].label.split(" ")[0]);
        setDeltaCCurrent2Label(deltaCChart.current.data.datasets[8].label.split(" ")[0]);
        setDeltaCCurrent3Label(deltaCChart.current.data.datasets[12].label.split(" ")[0]);

        setHighpassAvg0Label(highpassChart.current.data.datasets[0].label.split(" ")[0]);
        setHighpassAvg1Label(highpassChart.current.data.datasets[1].label.split(" ")[0]);
        setHighpassAvg2Label(highpassChart.current.data.datasets[2].label.split(" ")[0]);
        setHighpassAvg3Label(highpassChart.current.data.datasets[3].label.split(" ")[0]);
        setHighpassCurrent0Label(highpassChart.current.data.datasets[0].label.split(" ")[0]);
        setHighpassCurrent1Label(highpassChart.current.data.datasets[1].label.split(" ")[0]);
        setHighpassCurrent2Label(highpassChart.current.data.datasets[2].label.split(" ")[0]);
        setHighpassCurrent3Label(highpassChart.current.data.datasets[3].label.split(" ")[0]);

        setTsiAvg0Label(tsiChart.current.data.datasets[0].label.split(" ")[0]);
        setTsiAvg1Label(tsiChart.current.data.datasets[1].label.split(" ")[0]);
        setTsiAvg2Label(tsiChart.current.data.datasets[2].label.split(" ")[0]);
        setTsiAvg3Label(tsiChart.current.data.datasets[3].label.split(" ")[0]);
        setTsiCurrent0Label(tsiChart.current.data.datasets[0].label.split(" ")[0]);
        setTsiCurrent1Label(tsiChart.current.data.datasets[1].label.split(" ")[0]);
        setTsiCurrent2Label(tsiChart.current.data.datasets[2].label.split(" ")[0]);
        setTsiCurrent3Label(tsiChart.current.data.datasets[3].label.split(" ")[0]);

        const avgFinder = (lister) => {
            var adder = 0;
            for(let i=0; i<lister.length; i++){
                adder += lister[i];
            }
            return (adder/lister.length).toFixed(3);
        }

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

            for(let dCount=0; dCount < deltaAChart.current.data.datasets.length; dCount++){
                if(deltaAChart.current.data.datasets[dCount].data.length > deltaAChart.current.data.labels.length){
                    deltaAChart.current.data.datasets[dCount].data.shift();
                }
            }
            deltaAChart.current.update('none');
            setDeltaAAvg0(()=>{
                let avgAdder = (parseFloat(avgFinder(deltaAChart.current.data.datasets[0].data)) + parseFloat(avgFinder(deltaAChart.current.data.datasets[1].data)) + parseFloat(avgFinder(deltaAChart.current.data.datasets[2].data)) + parseFloat(avgFinder(deltaAChart.current.data.datasets[3].data))) / 4;
                return avgAdder.toFixed(3);
            });
            setDeltaAAvg1(()=>{
                let avgAdder = (parseFloat(avgFinder(deltaAChart.current.data.datasets[4].data)) + parseFloat(avgFinder(deltaAChart.current.data.datasets[5].data)) + parseFloat(avgFinder(deltaAChart.current.data.datasets[6].data)) + parseFloat(avgFinder(deltaAChart.current.data.datasets[7].data))) / 4;
                return avgAdder.toFixed(3);
            });
            setDeltaAAvg2(()=>{
                let avgAdder = (parseFloat(avgFinder(deltaAChart.current.data.datasets[8].data)) + parseFloat(avgFinder(deltaAChart.current.data.datasets[9].data)) + parseFloat(avgFinder(deltaAChart.current.data.datasets[10].data)) + parseFloat(avgFinder(deltaAChart.current.data.datasets[11].data))) / 4;
                return avgAdder.toFixed(3);
            });
            setDeltaAAvg3(()=>{
                let avgAdder = (parseFloat(avgFinder(deltaAChart.current.data.datasets[12].data)) + parseFloat(avgFinder(deltaAChart.current.data.datasets[13].data)) + parseFloat(avgFinder(deltaAChart.current.data.datasets[14].data)) + parseFloat(avgFinder(deltaAChart.current.data.datasets[15].data))) / 4;
                return avgAdder.toFixed(3);
            });
            setDeltaACurrent0(()=>{
                let avgAdder = (deltaAChart.current.data.datasets[0].data[deltaAChart.current.data.datasets[0].data.length-1] + deltaAChart.current.data.datasets[1].data[deltaAChart.current.data.datasets[1].data.length-1] + deltaAChart.current.data.datasets[2].data[deltaAChart.current.data.datasets[2].data.length-1] + deltaAChart.current.data.datasets[3].data[deltaAChart.current.data.datasets[3].data.length-1]) / 4;
                return avgAdder.toFixed(3);
            });
            setDeltaACurrent1(()=>{
                let avgAdder = (deltaAChart.current.data.datasets[4].data[deltaAChart.current.data.datasets[4].data.length-1] + deltaAChart.current.data.datasets[5].data[deltaAChart.current.data.datasets[5].data.length-1] + deltaAChart.current.data.datasets[6].data[deltaAChart.current.data.datasets[6].data.length-1] + deltaAChart.current.data.datasets[7].data[deltaAChart.current.data.datasets[7].data.length-1]) / 4;
                return avgAdder.toFixed(3);
            });
            setDeltaACurrent2(()=>{
                let avgAdder = (deltaAChart.current.data.datasets[8].data[deltaAChart.current.data.datasets[8].data.length-1] + deltaAChart.current.data.datasets[9].data[deltaAChart.current.data.datasets[9].data.length-1] + deltaAChart.current.data.datasets[10].data[deltaAChart.current.data.datasets[10].data.length-1] + deltaAChart.current.data.datasets[11].data[deltaAChart.current.data.datasets[11].data.length-1]) / 4;
                return avgAdder.toFixed(3);
            });
            setDeltaACurrent3(()=>{
                let avgAdder = (deltaAChart.current.data.datasets[12].data[deltaAChart.current.data.datasets[12].data.length-1] + deltaAChart.current.data.datasets[13].data[deltaAChart.current.data.datasets[13].data.length-1] + deltaAChart.current.data.datasets[14].data[deltaAChart.current.data.datasets[14].data.length-1] + deltaAChart.current.data.datasets[15].data[deltaAChart.current.data.datasets[15].data.length-1]) / 4;
                return avgAdder.toFixed(3);
            });
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

            for(let dCount=0; dCount < diffDeltaAChart.current.data.datasets.length; dCount++){
                if(diffDeltaAChart.current.data.datasets[dCount].data.length > diffDeltaAChart.current.data.labels.length){
                    diffDeltaAChart.current.data.datasets[dCount].data.shift();
                }
            }
            diffDeltaAChart.current.update('none');
            setDiffDeltaAAvg0(()=>{
                let avgAdder = (parseFloat(avgFinder(diffDeltaAChart.current.data.datasets[0].data)) + parseFloat(avgFinder(diffDeltaAChart.current.data.datasets[1].data)) + parseFloat(avgFinder(diffDeltaAChart.current.data.datasets[2].data)) + parseFloat(avgFinder(diffDeltaAChart.current.data.datasets[3].data))) / 4;
                return avgAdder.toFixed(3);
            });
            setDiffDeltaAAvg1(()=>{
                let avgAdder = (parseFloat(avgFinder(diffDeltaAChart.current.data.datasets[4].data)) + parseFloat(avgFinder(diffDeltaAChart.current.data.datasets[5].data)) + parseFloat(avgFinder(diffDeltaAChart.current.data.datasets[6].data)) + parseFloat(avgFinder(diffDeltaAChart.current.data.datasets[7].data))) / 4;
                return avgAdder.toFixed(3);
            });
            setDiffDeltaAAvg2(()=>{
                let avgAdder = (parseFloat(avgFinder(diffDeltaAChart.current.data.datasets[8].data)) + parseFloat(avgFinder(diffDeltaAChart.current.data.datasets[9].data)) + parseFloat(avgFinder(diffDeltaAChart.current.data.datasets[10].data)) + parseFloat(avgFinder(diffDeltaAChart.current.data.datasets[11].data))) / 4;
                return avgAdder.toFixed(3);
            });
            setDiffDeltaAAvg3(()=>{
                let avgAdder = (parseFloat(avgFinder(diffDeltaAChart.current.data.datasets[12].data)) + parseFloat(avgFinder(diffDeltaAChart.current.data.datasets[13].data)) + parseFloat(avgFinder(diffDeltaAChart.current.data.datasets[14].data)) + parseFloat(avgFinder(diffDeltaAChart.current.data.datasets[15].data))) / 4;
                return avgAdder.toFixed(3);
            });
            setDiffDeltaACurrent0(()=>{
                let avgAdder = (diffDeltaAChart.current.data.datasets[0].data[diffDeltaAChart.current.data.datasets[0].data.length-1] + diffDeltaAChart.current.data.datasets[1].data[diffDeltaAChart.current.data.datasets[1].data.length-1] + diffDeltaAChart.current.data.datasets[2].data[diffDeltaAChart.current.data.datasets[2].data.length-1] + diffDeltaAChart.current.data.datasets[3].data[diffDeltaAChart.current.data.datasets[3].data.length-1]) / 4;
                return avgAdder.toFixed(3);
            });
            setDiffDeltaACurrent1(()=>{
                let avgAdder = (diffDeltaAChart.current.data.datasets[4].data[diffDeltaAChart.current.data.datasets[4].data.length-1] + diffDeltaAChart.current.data.datasets[5].data[diffDeltaAChart.current.data.datasets[5].data.length-1] + diffDeltaAChart.current.data.datasets[6].data[diffDeltaAChart.current.data.datasets[6].data.length-1] + diffDeltaAChart.current.data.datasets[7].data[diffDeltaAChart.current.data.datasets[7].data.length-1]) / 4;
                return avgAdder.toFixed(3);
            });
            setDiffDeltaACurrent2(()=>{
                let avgAdder = (diffDeltaAChart.current.data.datasets[8].data[diffDeltaAChart.current.data.datasets[8].data.length-1] + diffDeltaAChart.current.data.datasets[9].data[diffDeltaAChart.current.data.datasets[9].data.length-1] + diffDeltaAChart.current.data.datasets[10].data[diffDeltaAChart.current.data.datasets[10].data.length-1] + diffDeltaAChart.current.data.datasets[11].data[diffDeltaAChart.current.data.datasets[11].data.length-1]) / 4;
                return avgAdder.toFixed(3);
            });
            setDiffDeltaACurrent3(()=>{
                let avgAdder = (diffDeltaAChart.current.data.datasets[12].data[diffDeltaAChart.current.data.datasets[12].data.length-1] + diffDeltaAChart.current.data.datasets[13].data[diffDeltaAChart.current.data.datasets[13].data.length-1] + diffDeltaAChart.current.data.datasets[14].data[diffDeltaAChart.current.data.datasets[14].data.length-1] + diffDeltaAChart.current.data.datasets[15].data[diffDeltaAChart.current.data.datasets[15].data.length-1]) / 4;
                return avgAdder.toFixed(3);
            });
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

            for(let dCount=0; dCount < deltaCChart.current.data.datasets.length; dCount++){
                if(deltaCChart.current.data.datasets[dCount].data.length > deltaCChart.current.data.labels.length){
                    deltaCChart.current.data.datasets[dCount].data.shift();
                }
            }
            deltaCChart.current.update('none');
            setDeltaCAvg0(()=>{
                let avgAdder = (parseFloat(avgFinder(deltaCChart.current.data.datasets[0].data)) + parseFloat(avgFinder(deltaCChart.current.data.datasets[1].data)) + parseFloat(avgFinder(deltaCChart.current.data.datasets[2].data)) + parseFloat(avgFinder(deltaCChart.current.data.datasets[3].data))) / 4;
                return avgAdder.toFixed(3);
            });
            setDeltaCAvg1(()=>{
                let avgAdder = (parseFloat(avgFinder(deltaCChart.current.data.datasets[4].data)) + parseFloat(avgFinder(deltaCChart.current.data.datasets[5].data)) + parseFloat(avgFinder(deltaCChart.current.data.datasets[6].data)) + parseFloat(avgFinder(deltaCChart.current.data.datasets[7].data))) / 4;
                return avgAdder.toFixed(3);
            });
            setDeltaCAvg2(()=>{
                let avgAdder = (parseFloat(avgFinder(deltaCChart.current.data.datasets[8].data)) + parseFloat(avgFinder(deltaCChart.current.data.datasets[9].data)) + parseFloat(avgFinder(deltaCChart.current.data.datasets[10].data)) + parseFloat(avgFinder(deltaCChart.current.data.datasets[11].data))) / 4;
                return avgAdder.toFixed(3);
            });
            setDeltaCAvg3(()=>{
                let avgAdder = (parseFloat(avgFinder(deltaCChart.current.data.datasets[12].data)) + parseFloat(avgFinder(deltaCChart.current.data.datasets[13].data)) + parseFloat(avgFinder(deltaCChart.current.data.datasets[14].data)) + parseFloat(avgFinder(deltaCChart.current.data.datasets[15].data))) / 4;
                return avgAdder.toFixed(3);
            });
            setDeltaCCurrent0(()=>{
                let avgAdder = (deltaCChart.current.data.datasets[0].data[deltaCChart.current.data.datasets[0].data.length-1] + deltaCChart.current.data.datasets[1].data[deltaCChart.current.data.datasets[1].data.length-1] + deltaCChart.current.data.datasets[2].data[deltaCChart.current.data.datasets[2].data.length-1] + deltaCChart.current.data.datasets[3].data[deltaCChart.current.data.datasets[3].data.length-1]) / 4;
                return avgAdder.toFixed(3);
            });
            setDeltaCCurrent1(()=>{
                let avgAdder = (deltaCChart.current.data.datasets[4].data[deltaCChart.current.data.datasets[4].data.length-1] + deltaCChart.current.data.datasets[5].data[deltaCChart.current.data.datasets[5].data.length-1] + deltaCChart.current.data.datasets[6].data[deltaCChart.current.data.datasets[6].data.length-1] + deltaCChart.current.data.datasets[7].data[deltaCChart.current.data.datasets[7].data.length-1]) / 4;
                return avgAdder.toFixed(3);
            });
            setDeltaCCurrent2(()=>{
                let avgAdder = (deltaCChart.current.data.datasets[8].data[deltaCChart.current.data.datasets[8].data.length-1] + deltaCChart.current.data.datasets[9].data[deltaCChart.current.data.datasets[9].data.length-1] + deltaCChart.current.data.datasets[10].data[deltaCChart.current.data.datasets[10].data.length-1] + deltaCChart.current.data.datasets[11].data[deltaCChart.current.data.datasets[11].data.length-1]) / 4;
                return avgAdder.toFixed(3);
            });
            setDeltaCCurrent3(()=>{
                let avgAdder = (deltaCChart.current.data.datasets[12].data[deltaCChart.current.data.datasets[12].data.length-1] + deltaCChart.current.data.datasets[13].data[deltaCChart.current.data.datasets[13].data.length-1] + deltaCChart.current.data.datasets[14].data[deltaCChart.current.data.datasets[14].data.length-1] + deltaCChart.current.data.datasets[15].data[deltaCChart.current.data.datasets[15].data.length-1]) / 4;
                return avgAdder.toFixed(3);
            });
        };

        // Update Concentration @ Highpass Data
        const updateHighpass = (data) => {
            highpassChart.current.data.datasets[0].data.push(data['870nm']);
            highpassChart.current.data.datasets[1].data.push(data['660nm']);
            highpassChart.current.data.datasets[2].data.push(data['1200nm']);
            highpassChart.current.data.datasets[3].data.push(data['1550nm']);

            for(let dCount=0; dCount < highpassChart.current.data.datasets.length; dCount++){
                if(highpassChart.current.data.datasets[dCount].data.length > highpassChart.current.data.labels.length){
                    highpassChart.current.data.datasets[dCount].data.shift();
                }
            }
            highpassChart.current.update('none');
            setHighpassAvg0(()=>{
                return avgFinder(highpassChart.current.data.datasets[0].data);
            });
            setHighpassAvg1(()=>{
                return avgFinder(highpassChart.current.data.datasets[1].data);
            });
            setHighpassAvg2(()=>{
                return avgFinder(highpassChart.current.data.datasets[2].data);
            });
            setHighpassAvg3(()=>{
                return avgFinder(highpassChart.current.data.datasets[3].data);
            });
            setHighpassCurrent0(()=>{
                return highpassChart.current.data.datasets[0].data[highpassChart.current.data.datasets[0].data.length-1].toFixed(3);
            });
            setHighpassCurrent1(()=>{
                return highpassChart.current.data.datasets[1].data[highpassChart.current.data.datasets[1].data.length-1].toFixed(3);
            });
            setHighpassCurrent2(()=>{
                return highpassChart.current.data.datasets[2].data[highpassChart.current.data.datasets[2].data.length-1].toFixed(3);
            })
            setHighpassCurrent3(()=>{
                return highpassChart.current.data.datasets[3].data[highpassChart.current.data.datasets[3].data.length-1].toFixed(3);
            })
        };

        // Update Tissue Saturation Index Data
        const updateTsi = (data) => {
            tsiChart.current.data.datasets[0].data.push(data['870nm']);
            tsiChart.current.data.datasets[1].data.push(data['660nm']);
            tsiChart.current.data.datasets[2].data.push(data['1200nm']);
            tsiChart.current.data.datasets[3].data.push(data['1550nm']);

            for(let dCount=0; dCount < tsiChart.current.data.datasets.length; dCount++){
                if(tsiChart.current.data.datasets[dCount].data.length > tsiChart.current.data.labels.length){
                    tsiChart.current.data.datasets[dCount].data.shift();
                }
            }
            tsiChart.current.update('none');
            setTsiAvg0(()=>{
                return avgFinder(tsiChart.current.data.datasets[0].data);
            });
            setTsiAvg1(()=>{
                return avgFinder(tsiChart.current.data.datasets[1].data);
            });
            setTsiAvg2(()=>{
                return avgFinder(tsiChart.current.data.datasets[2].data);
            });
            setTsiAvg3(()=>{
                return avgFinder(tsiChart.current.data.datasets[3].data);
            });
            setTsiCurrent0(()=>{
                return tsiChart.current.data.datasets[0].data[tsiChart.current.data.datasets[0].data.length-1].toFixed(2);
            });
            setTsiCurrent1(()=>{
                return tsiChart.current.data.datasets[1].data[tsiChart.current.data.datasets[1].data.length-1].toFixed(2);
            });
            setTsiCurrent2(()=>{
                return tsiChart.current.data.datasets[2].data[tsiChart.current.data.datasets[2].data.length-1].toFixed(2);
            });
            setTsiCurrent3(()=>{
                return tsiChart.current.data.datasets[3].data[tsiChart.current.data.datasets[3].data.length-1].toFixed(2);
            });
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
        <div className="flex flex-col sm:flex-row flex-wrap m-3">
            <div className="w-2/3"><ChartsComponent /></div>
            <div className="flex flex-col mt-3 sm:flex-row  sm:m-0 w-1/3 flex-wrap gap-3">
                <Card className="max-h-56 w-72">
                    <CardHeader className="font-sans font-medium italic">Sensor Raw Values (A)</CardHeader>
                    <CardBody className="flex flex-row place-content-evenly">
                        <div className="flex flex-col justify-end">
                            <div>x̄ {deltaAAvg0Label}</div>
                            <div className="text-green-500 text-xl font-bold">{deltaAAvg0}</div>
                            <div>x̄ {deltaAAvg2Label}</div>
                            <div className="text-green-500 text-xl font-bold">{deltaAAvg2}</div>
                        </div>
                        <div className="flex flex-col justify-end">
                            <div>x̄ {deltaAAvg1Label}</div>
                            <div className="text-green-500 text-xl font-bold">{deltaAAvg1}</div>
                            <div>x̄ {deltaAAvg3Label}</div>
                            <div className="text-green-500 text-xl font-bold">{deltaAAvg3}</div>
                        </div>
                    </CardBody>
                    <CardFooter className="flex flex-row place-content-evenly">
                        <div className="flex flex-col justify-start">
                            <div className="flex flex-row text-sm"><div className="font-semibold">{deltaACurrent0Label} → </div> {deltaACurrent0}</div>
                            <div className="flex flex-row text-sm"><div className="font-semibold">{deltaACurrent2Label} → </div> {deltaACurrent2}</div>
                        </div>
                        <div className="flex flex-col justify-start">
                            <div className="flex flex-row text-sm"><div className="font-semibold">{deltaACurrent1Label} → </div> {deltaACurrent1}</div>
                            <div className="flex flex-row text-sm"><div className="font-semibold">{deltaACurrent3Label} → </div> {deltaACurrent3}</div>
                        </div>
                    </CardFooter>
                </Card>

                <Card className="max-h-56 w-72">
                    <CardHeader className="font-sans font-medium italic">Delta A</CardHeader>
                    <CardBody className="flex flex-row place-content-evenly">
                        <div className="flex flex-col justify-end">
                            <div>x̄ {diffDeltaAAvg0Label}</div>
                            <div className="text-green-500 text-xl font-bold">{diffDeltaAAvg0}</div>
                            <div>x̄ {diffDeltaAAvg2Label}</div>
                            <div className="text-green-500 text-xl font-bold">{diffDeltaAAvg2}</div>
                        </div>
                        <div className="flex flex-col justify-end">
                            <div>x̄ {diffDeltaAAvg1Label}</div>
                            <div className="text-green-500 text-xl font-bold">{diffDeltaAAvg1}</div>
                            <div>x̄ {diffDeltaAAvg3Label}</div>
                            <div className="text-green-500 text-xl font-bold">{diffDeltaAAvg3}</div>
                        </div>
                    </CardBody>
                    <CardFooter className="flex flex-row place-content-evenly">
                        <div className="flex flex-col justify-start">
                            <div className="flex flex-row text-sm"><div className="font-semibold">{diffDeltaACurrent0Label} → </div> {diffDeltaACurrent0}</div>
                            <div className="flex flex-row text-sm"><div className="font-semibold">{diffDeltaACurrent2Label} → </div> {diffDeltaACurrent2}</div>
                        </div>
                        <div className="flex flex-col justify-start">
                            <div className="flex flex-row text-sm"><div className="font-semibold">{diffDeltaACurrent1Label} → </div> {diffDeltaACurrent1}</div>
                            <div className="flex flex-row text-sm"><div className="font-semibold">{diffDeltaACurrent3Label} → </div> {diffDeltaACurrent3}</div>
                        </div>
                    </CardFooter>
                </Card>

                <Card className="max-h-56 w-72">
                    <CardHeader className="font-sans font-medium italic">Concentration ( 𝚫C )</CardHeader>
                    <CardBody className="flex flex-row place-content-evenly">
                        <div className="flex flex-col justify-end">
                            <div>x̄ {deltaCAvg0Label}</div>
                            <div className="text-green-500 text-xl font-bold">{deltaCAvg0}</div>
                            <div>x̄ {deltaCAvg2Label}</div>
                            <div className="text-green-500 text-xl font-bold">{deltaCAvg2}</div>
                        </div>
                        <div className="flex flex-col justify-end">
                            <div>x̄ {deltaCAvg1Label}</div>
                            <div className="text-green-500 text-xl font-bold">{deltaCAvg1}</div>
                            <div>x̄ {deltaCAvg3Label}</div>
                            <div className="text-green-500 text-xl font-bold">{deltaCAvg3}</div>
                        </div>
                    </CardBody>
                    <CardFooter className="flex flex-row place-content-evenly">
                        <div className="flex flex-col justify-end">
                            <div className="flex flex-row text-sm"><div className="font-semibold">{deltaCCurrent0Label} → </div> {deltaCCurrent0}</div>
                            <div className="flex flex-row text-sm"><div className="font-semibold">{deltaCCurrent2Label} → </div> {deltaCCurrent2}</div>
                        </div>
                        <div className="flex flex-col justify-end">
                            <div className="flex flex-row text-sm"><div className="font-semibold">{deltaCCurrent1Label} → </div> {deltaCCurrent1}</div>
                            <div className="flex flex-row text-sm"><div className="font-semibold">{deltaCCurrent3Label} → </div> {deltaCCurrent3}</div>
                        </div>
                    </CardFooter>
                </Card>

                <Card className="max-h-56 w-72">
                    <CardHeader className="font-sans font-medium italic">𝚫C @ Highpass Filter</CardHeader>
                    <CardBody className="flex flex-row place-content-evenly">
                        <div className="flex flex-col justify-end">
                            <div>x̄ {highpassAvg0Label}</div>
                            <div className="text-green-500 text-xl font-bold">{highpassAvg0}</div>
                            <div>x̄ {highpassAvg2Label}</div>
                            <div className="text-green-500 text-xl font-bold">{highpassAvg2}</div>
                        </div>
                        <div className="flex flex-col justify-end">
                            <div>x̄ {highpassAvg1Label}</div>
                            <div className="text-green-500 text-xl font-bold">{highpassAvg1}</div>
                            <div>x̄ {highpassAvg3Label}</div>
                            <div className="text-green-500 text-xl font-bold">{highpassAvg3}</div>
                        </div>
                    </CardBody>
                    <CardFooter className="flex flex-row place-content-evenly">
                        <div className="flex flex-col justify-end">
                            <div className="flex flex-row text-sm"><div className="font-semibold">{highpassCurrent0Label} → </div> {highpassCurrent0}</div>
                            <div className="flex flex-row text-sm"><div className="font-semibold">{highpassCurrent2Label} → </div> {highpassCurrent2}</div>
                        </div>
                        <div className="flex flex-col justify-end">
                            <div className="flex flex-row text-sm"><div className="font-semibold">{highpassCurrent1Label} → </div> {highpassCurrent1}</div>
                            <div className="flex flex-row text-sm"><div className="font-semibold">{highpassCurrent3Label} → </div> {highpassCurrent3}</div>
                        </div>
                    </CardFooter>
                </Card>

                <Card className="max-h-56 w-72">
                    <CardHeader className="font-sans font-medium italic">Tissue Saturation Index</CardHeader>
                    <CardBody className="flex flex-row place-content-evenly">
                        <div className="flex flex-col justify-end">
                            <div>x̄ {tsiAvg0Label}</div>
                            <div className="text-green-500 text-xl font-bold">{tsiAvg0}</div>
                            <div>x̄ {tsiAvg2Label}</div>
                            <div className="text-green-500 text-xl font-bold">{tsiAvg2}</div>
                        </div>
                        <div className="flex flex-col justify-end">
                            <div>x̄ {tsiAvg1Label}</div>
                            <div className="text-green-500 text-xl font-bold">{tsiAvg1}</div>
                            <div>x̄ {tsiAvg3Label}</div>
                            <div className="text-green-500 text-xl font-bold">{tsiAvg3}</div>
                        </div>
                    </CardBody>
                    <CardFooter className="flex flex-row place-content-evenly">
                        <div className="flex flex-col justify-end">
                            <div className="flex flex-row text-sm"><div className="font-semibold">{tsiCurrent0Label} → </div> {tsiCurrent0}</div>
                            <div className="flex flex-row text-sm"><div className="font-semibold">{tsiCurrent2Label} → </div> {tsiCurrent2}</div>
                        </div>
                        <div className="flex flex-col justify-end">
                            <div className="flex flex-row text-sm"><div className="font-semibold">{tsiCurrent1Label} → </div> {tsiCurrent1}</div>
                            <div className="flex flex-row text-sm"><div className="font-semibold">{tsiCurrent3Label} → </div> {tsiCurrent3}</div>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
