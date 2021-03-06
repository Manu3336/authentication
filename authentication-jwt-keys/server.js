const fs   = require('fs');
const jwt  = require('jsonwebtoken');
const privateKEY  = fs.readFileSync('./private.key', 'utf8');
const publicKEY  = fs.readFileSync('./public.key', 'utf8');
async function createToken ( request, reply, next) {
    var payload = {
        data1: "Data 1",
        data2: "Data 2",
        data3: "Data 3",
        data4: "Data 4",
       };
       // PRIVATE and PUBLIC key

       var i  = 'Mysoft corp';          // Issuer 
       var s  = 'some@user.com';        // Subject 
       var a  = 'http://mysoftcorp.in'; // Audience
       // SIGNING OPTIONS
       var signOptions = {
        issuer:  i,
        subject:  s,
        audience:  a,
        expiresIn:  "12h",
        algorithm:  "RS256"
       };
    
    
    var token = jwt.sign(payload, privateKEY, signOptions);
    console.log("Token - " + token)
    
    
    var verifyOptions = {
        issuer:  i,
        subject:  s,
        audience:  a,
        expiresIn:  "12h",
        algorithm:  ["RS256"]
       };
       var legit = jwt.verify(token, publicKEY, verifyOptions);
       console.log("\nJWT verification result: " + JSON.stringify(legit));
}


   

   createToken();