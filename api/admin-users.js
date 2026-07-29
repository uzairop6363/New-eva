import { MongoClient } from "mongodb";


const uri = process.env.MONGO_URI;



export default async function handler(req,res){


if(req.method !== "GET"){


return res.status(405).json({

success:false,

message:"Method not allowed"

});


}



try{


const client = new MongoClient(uri);


await client.connect();



const db =
client.db("eva_earning");



const users =
db.collection("users");



const allUsers =
await users.find({}).toArray();



await client.close();



res.json({

success:true,

users:allUsers


});



}catch(error){



console.log(error);



res.status(500).json({

success:false,

message:error.message

});


}


}
