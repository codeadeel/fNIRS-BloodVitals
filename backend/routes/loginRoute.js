// Importing Libraries
const {Router} = require('express');
const jwt = require('jsonwebtoken');
var shajs = require('sha.js');

// Random String Generator
function stringGen(lenner){
    const charstr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+=-[]{}|;:,.<>?";
    let res = "";
    for(let i=0; i<lenner; i++){
        res += charstr.charAt(Math.floor(Math.random() * charstr.length));
    }
    return res;
}

// Initializing Environment Variables
const loginHandler = Router();
var allowedUser = process.env.ALLOWED_USER;
var allowedPassword = process.env.ALLOWED_PASSWORD;
var allowedAge = process.env.ALLOWED_AGE;
const jwtKey = stringGen(32);

// Handling Environment Variables
if(allowedUser==undefined){
    console.log('[ ENV: ALLOWED_USER ] : ALLOWED_USER not set, ( Default : admin )')
    allowedUser = 'admin';
} else {
    console.log(`[ ENV: ALLOWED_USER ] : ${allowedUser}`)
}

if(allowedPassword==undefined){
    console.log('[ ENV: ALLOWED_PASSWORD ] : ALLOWED_PASSWORD not set, ( Default : admin )')
    allowedPassword = 'admin';
} else {
    console.log(`[ ENV: ALLOWED_PASSWORD ] : ${allowedPassword}`)
}

if(allowedAge==undefined){
    console.log('[ ENV: ALLOWED_AGE (ms) ] : ALLOWED_AGE not set, ( Default : 86400000 )')
    allowedAge = 86400000;
    // allowedAge = 5000;
} else {
    console.log(`[ ENV: ALLOWED_AGE (ms) ] : ${allowedAge}`)
}

allowedUser = shajs('sha256').update(allowedUser).digest('hex');
allowedPassword = shajs('sha256').update(allowedPassword).digest('hex');

// Handling Login Request
loginHandler.post('/login', (req, res)=>{
    const reqUname = req.body.uname;
    const reqPassd = req.body.passd;

    if((reqUname==allowedUser) && (reqPassd==allowedPassword)){
        if(req.cookies['fNIRS-Cookie']==undefined){
            const tok = jwt.sign({ uname: req.body.uname }, jwtKey, { algorithm: 'HS256' });
            res.cookie("fNIRS-Cookie", tok, {maxAge: allowedAge});
            console.log(`[ JWT: INITIALIZED ] : ${tok}`);
        } else {
            try{
                if(jwt.verify(req.cookies['fNIRS-Cookie'], jwtKey)){
                    console.log(`[ JWT: AVAILABLE ] : ${req.cookies['fNIRS-Cookie']}`);
                }
            } catch{
                console.log(`[ JWT: PREVIOUS ] : ${req.cookies['fNIRS-Cookie']}`);
                const tok = jwt.sign({ uname: req.body.uname }, jwtKey, { algorithm: 'HS256' });
                res.cookie("fNIRS-Cookie", tok, {maxAge: allowedAge});
                console.log(`[ JWT: RENEWED ] : ${tok}`);
            }
        }
        console.log('[ Authentication ] : Access Granted')
        res.status(200).send('Access Granted');
    } else {
        console.log('[ Authentication ] : Access Denied')
        res.status(403).send('Access Denied');
    };
});

module.exports = {loginHandler, jwtKey};
