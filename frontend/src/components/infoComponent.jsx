import { useEffect, useContext } from "react";
import {Divider} from "@nextui-org/divider";
import FnirsContext from "../tools/contextStore";

// This component provides the information to the current session

export default function InfoComponent(){
    // Import states from the context store
    const {setLiveStreamPageActive, setAcquisitionPageActive, setInfoPageActive, deviceID, fnirsCookie, creditStatement} = useContext(FnirsContext);
    let currDate = new Date();
    currDate = currDate.toLocaleString();

    // Highlight the current page
    useEffect(() => {
        setLiveStreamPageActive('text-current font-sans');
        setAcquisitionPageActive('text-current font-sans');
        setInfoPageActive('text-blue-600 font-sans');
    }, []);

    // Main component definition
    return (
        <div className="m-3">
            <div className="flex flex-row justify-center font-sans font-medium">Functional Near-Infrared Spectroscopy  <div className="hidden sm:flex italic"> ( fNIRS ) </div> Dashboard for Human Blood Vitals Check</div>
            <Divider className="my-3 " />
            <div className="flex flex-row gap-3 mt-3 justify-between flex-wrap sm:flex-nowrap">
                <div className="flex flex-col sm:w-1/2">
                    <div className="flex flex-row justify-start sm:justify-center font-sans font-medium italic">
                        Session Information
                    </div>
                    <div className="flex flex-row justify-start gap-x-3 my-3">
                        <div className="font-sans font-medium">Session Token: </div>
                        <div className="w-1/2 truncate overflow-hidden">{fnirsCookie['fNIRS-Cookie'].split(".")[1]}</div>
                    </div>
                    <div className="flex flex-row justify-start gap-x-3 my-3">
                        <div className="font-sans font-medium">Session Date: </div>
                        <div className="w-1/2 truncate overflow-hidden">{currDate.split(",")[0]}</div>
                    </div>
                    <div className="flex flex-row justify-start gap-x-3 my-3">
                        <div className="font-sans font-medium">Session Time: </div>
                        <div className="w-1/2 truncate overflow-hidden">{currDate.split(", ")[1]}</div>
                    </div>
                    <div className="flex flex-row justify-start gap-x-3 my-3">
                        <div className="font-sans font-medium">Device ID: </div>
                        <div className="w-1/2 truncate overflow-hidden">{deviceID}</div>
                    </div>
                </div>
                <Divider className="sm:hidden" />
                <div className="flex flex-col sm:w-1/2">
                    <div className="flex flex-row justify-start sm:justify-center font-sans font-medium italic">
                        Plotting Information
                    </div>
                    <div className="justify-start m-3">
                        <div className="font-sans font-medium">Current Plots: </div>
                        <ol className="list-decimal m-3">
                            <li>Raw Values from Sensor ( A )</li>
                            <li>Delta A</li>
                            <li>Concentration ( 𝚫C )</li>
                            <li>Concentration ( 𝚫C ) @ HighPass Filter</li>
                            <li>Tissue Saturation Index ( TSI )</li>
                        </ol>
                    </div>
                </div>
            </div>
            <Divider className="my-3 " />
            <div className="flex flex-row justify-center font-sans font-medium">{creditStatement}</div>
        </div>
    );
}
