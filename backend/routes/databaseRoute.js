// Importing Libraries
const {Router} = require('express');
const { createClient } = require('redis');

// Initializing Environment Variables
const databaseHandler = Router();
var databaseUser = process.env.DATABASE_USER;
var databasePassword = process.env.DATABASE_PASSWORD;
var databasePort = process.env.DATABASE_PORT;
var databaseHost = process.env.DATABASE_HOST;
var databaseSelect = process.env.DATABASE_SELECT;

// Handling Environment Variables
if(databaseUser==undefined){
    console.log('[ ENV: DATABASE_USER ] : DATABASR_USER not set, ( Default : \"\" )')
    databaseUser = "";
} else {
    console.log(`[ ENV: DATABASE_USER ] : ${databaseUser}`)
}

if(databasePassword==undefined){
    console.log('[ ENV: DATABASE_PASSWORD ] : DATABASR_PASSWORD not set, ( Default : \"\" )')
    databasePassword = "";
} else {
    console.log(`[ ENV: DATABASE_PASSWORD ] : ${databasePassword}`)
}

if(databasePort==undefined){
    console.log('[ ENV: DATABASE_PORT ] : DATABASR_PORT  not set, ( Default : 6379 )')
    databasePort = 6379;
} else {
    console.log(`[ ENV: DATABASE_PORT ] : ${databasePort}`)
}

if(databaseHost==undefined){
    console.log('[ ENV: DATABASE_HOST ] : DATABASR_HOST not set, ( Default : localhost )')
    databaseHost = "localhost";
} else {
    console.log(`[ ENV: DATABASE_HOST ] : ${databaseHost}`)
}

if(databaseSelect==undefined){
    console.log('[ ENV: DATABASE_SELECT ] : DATABASR_SELECT not set, ( Default : 0 )')
    databaseSelect = 0;
} else {
    console.log(`[ ENV: DATABASE_SELECT ] : ${databaseSelect}`)
}

const client = createClient({
    url: `redis://${databaseUser}:${databasePassword}@${databaseHost}:${databasePort}/${databaseSelect}`
});

client.on('error', error => {
    console.error(`[ REDIS : ERROR ] : `, error);
});

client.connect();

// Handling POST Request for new Data Commit
databaseHandler.post('/commit', async (req, res)=>{
    await client.set("userCount", 0, {NX: true});
    const incrID = await client.incr("userCount");
    await client.hSet(`patient:${incrID}`, 'name', req.body.patientName);
    await client.hSet(`patient:${incrID}`, 'dob', req.body.patientDOB);
    await client.hSet(`patient:${incrID}`, 'email', req.body.patientEmail);
    await client.hSet(`patient:${incrID}`, 'phone', req.body.patientPhone);
    await client.hSet(`patient:${incrID}`, 'address', req.body.patientAddress);
    await client.hSet(`patient:${incrID}`, 'city', req.body.patientCity);
    await client.hSet(`patient:${incrID}`, 'country', req.body.patientCountry);
    await client.hSet(`patient:${incrID}`, 'gender', req.body.patientGender);
    await client.hSet(`patient:${incrID}`, 'glucose', req.body.patientGlucose);
    await client.hSet(`patient:${incrID}`, 'description', req.body.patientDescription);
    await client.hSet(`patient:${incrID}`, 'currentTime', req.body.currentTime);
    await client.hSet(`patient:${incrID}`, 'deviceID', req.body.deviceID);
    await client.hSet(`patient:${incrID}`, 'wmaAgreement', req.body.wmaAgreement.toString());
    await client.hSet(`patient:${incrID}`, 'recordedData', req.body.recordedData);
    res.status(200).send({
        status: 200,
        patientID: `patient:${incrID}`
    });
});

// Handling GET Request Against Patient ID
databaseHandler.get('/get/:patientID', async (req, res)=>{
    const ret = await client.hGetAll(req.params.patientID);
    res.status(200).send({
        status: 200,
        data: ret
    });
});

// Handling DELETE Request Against Patient ID
databaseHandler.delete('/delete/:patientID', async (req, res)=>{
    const ret = await client.del(req.params.patientID);
    if(ret==1){
        res.status(200).send({
            status: 200,
            description: `${req.params.patientID} Deleted Successfully`
        });
    } else {
        res.status(404).send({
            status: 404,
            description: `${req.params.patientID} Not Found`
        });
    }
});

// Handling GET Request for Getting all Patient IDs
databaseHandler.get('/keys', async (req, res)=>{
    const ret = await client.keys("patient:*");
    res.status(200).send({
        status: 200,
        keys: ret
    });
});

// Handling GET Request for Getting all Patients Data
databaseHandler.get('/getall', async (req, res)=>{
    const lister = await client.keys("patient*");
    var dataParsed = {};
    for(let i=0; i<lister.length; i++){
        dataParsed[lister[i]] = await client.hGetAll(lister[i]);
        dataParsed[lister[i]]['recordedData'] = JSON.parse(dataParsed[lister[i]]['recordedData']);
    }
    res.status(200).send({
        status: 200,
        data: dataParsed
    });
});

module.exports = {databaseHandler};
