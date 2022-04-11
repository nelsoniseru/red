const mongoClient = require("mongoose")

async function dataBaseConnect(){
    try{
       let db= await mongoClient.connect(process.env.DATABASE)
       if(db){
           console.log("database connected")    
         }
    }catch(e){
        console.log("database unable to connect")
    }
 
}

dataBaseConnect()