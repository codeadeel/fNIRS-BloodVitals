import { useContext, useEffect, useRef } from 'react';
import FnirsContext from '../tools/contextStore';
import Chart from 'chart.js/auto';

// This component initialize canvases first, then assign charts to the canvases
// 1- useEffect ensures that, first empty canvases are rendered
// 2- After canvases are rendered, useEffect assigns the charts to the rendered canvases

export default function ChartsComponent(){
    // Import states from the context store
    const {deltaAChart, diffDeltaAChart, deltaCChart, highpassChart, tsiChart} = useContext(FnirsContext);
    // Initialize the reference to empty canvases
    const chart1Placement = useRef(null);
    const chart2Placement = useRef(null);
    const chart3Placement = useRef(null);
    const chart4Placement = useRef(null);
    const chart5Placement = useRef(null);

    // Assign charts to empty canvas references
    useEffect(() => {
        let labelList = [];
        for(let i=0; i<100; i++){
            labelList.push(i);
        }

        deltaAChart.current = new Chart(
            chart1Placement.current,
            {
                type: 'line',
                data: {
                    labels: labelList,
                    datasets:[
                        {label: 'Hb ( 850nm Wavelength )', data: []},
                        {label: 'H2O ( 940nm Wavelength )', data: []}
                    ]
                },
                options: {
                    animation: false,
                    plugins: {
                        title: {display: true, text: 'Raw Values from Sensor ( A )'},
                        tooltip: {
                            callbacks: {
                                label: (ctx) => {return ctx.dataset.label.split(" ")[0] + ' - Value: ' + ctx.parsed.y;}
                            }
                        }
                    },
                    scales: {
                        x: {grid: {display: false}, title: {display: true, text: 'Time Steps'}},
                        y: {grid: {display: false}, title: {display: true, text: 'Value'}}
                    }
                }
            }
        );

        diffDeltaAChart.current = new Chart(
            chart2Placement.current,
            {
                type: 'line',
                data: {
                    labels: labelList,
                    datasets:[
                        {label: 'Hb ( 850nm Wavelength )', data: []},
                        {label: 'H2O ( 940nm Wavelength )', data: []}
                    ]
                },
                options: {
                    animation: false,
                    plugins: {
                        title: {display: true, text: 'Delta A'},
                        tooltip: {
                            callbacks: {
                                label: (ctx) => {return ctx.dataset.label.split(" ")[0] + ' - 𝚫A: ' + ctx.parsed.y;}
                            }
                        }
                    },
                    scales: {
                        x: {grid: {display: false}, title: {display: true, text: 'Time Steps'}},
                        y: {grid: {display: false}, title: {display: true, text: '𝚫A'}}
                    }
                }
            }
        );

        deltaCChart.current = new Chart(
            chart3Placement.current,
            {
                type: 'line',
                data: {
                    labels: labelList,
                    datasets:[
                        {label: 'Hb ( 850nm Wavelength )', data: []},
                        {label: 'H2O ( 940nm Wavelength )', data: []}
                    ]
                },
                options: {
                    animation: false,
                    plugins: {
                        title: {display: true, text: 'Concentration ( 𝚫C )'},
                        tooltip: {
                            callbacks: {
                                label: (ctx) => {return ctx.dataset.label.split(" ")[0] + ' - 𝚫C: ' + ctx.parsed.y;}
                            }
                        }
                    },
                    scales: {
                        x: {grid: {display: false}, title: {display: true, text: 'Time Steps'}},
                        y: {grid: {display: false}, title: {display: true, text: 'Concentration ( 𝚫C )'}}
                    }
                }
            }
        );

        highpassChart.current = new Chart(
            chart4Placement.current,
            {
                type: 'line',
                data: {
                    labels: labelList,
                    datasets:[
                        {label: 'Hb ( 850nm Wavelength )', data: []},
                        {label: 'H2O ( 940nm Wavelength )', data: []}
                    ]
                },
                options: {
                    animation: false,
                    plugins: {
                        title: {display: true, text: 'Concentration ( 𝚫C ) @ HighPass Filter'},
                        tooltip: {
                            callbacks: {
                                label: (ctx) => {return ctx.dataset.label.split(" ")[0] + ' - HighPass 𝚫C: ' + ctx.parsed.y;}
                            }
                        }
                    },
                    scales: {
                        x: {grid: {display: false}, title: {display: true, text: 'Time Steps'}},
                        y: {grid: {display: false}, title: {display: true, text: 'Concentration ( 𝚫C ) @ HighPass Filter'}}
                    }
                }
            }
        );

        tsiChart.current = new Chart(
            chart5Placement.current,
            {
                type: 'line',
                data: {
                    labels: labelList,
                    datasets:[
                        {label: 'Hb ( 850nm Wavelength )', data: []},
                        {label: 'H2O ( 940nm Wavelength )', data: []}
                    ]
                },
                options: {
                    animation: false,
                    plugins: {
                        title: {display: true, text: 'Tissue Saturation Index ( TSI )'},
                        tooltip: {
                            callbacks: {
                                label: (ctx) => {return ctx.dataset.label.split(" ")[0] + ' - TSI: ' + ctx.parsed.y;}
                            }
                        }
                    },
                    scales: {
                        x: {grid: {display: false}, title: {display: true, text: 'Time Steps'}},
                        y: {grid: {display: false}, title: {display: true, text: 'Tissue Saturation Index'}}
                    }
                }
            }
        );

        return ()=>{
            deltaAChart.current.destroy();
            diffDeltaAChart.current.destroy();
            deltaCChart.current.destroy();
            highpassChart.current.destroy();
            tsiChart.current.destroy();
        };
    }, []);

    // Main component definition
    return (
        <div className='flex flex-col sm:flex-row flex-wrap gap-5'>
            <div className='w-[25.937rem] sm:w-[31.25rem]'>
                <canvas ref={chart1Placement} />
            </div>
            <div className='w-[25.937rem] sm:w-[31.25rem]'>
                <canvas ref={chart2Placement} />
            </div>
            <div className='w-[25.937rem] sm:w-[31.25rem]'>
                <canvas ref={chart3Placement} />
            </div>
            <div className='w-[25.937rem] sm:w-[31.25rem]'>
                <canvas ref={chart4Placement} />
            </div>
            <div className='w-[25.937rem] sm:w-[31.25rem]'>
                <canvas ref={chart5Placement} />
            </div>
        </div>
    );
};
