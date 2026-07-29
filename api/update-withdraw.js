import { MongoClient, ObjectId } from "mongodb";


const uri = process.env.MONGO_URI;



export default async function handler(req,res){


if(req.method !== "POST"){


return res.status(405).json({

success:false,

message:"Method not allowed"

});


}



try{


const {
id,
status
}=req.body;



if(!id || !status){


return res.status(400).json({

success:false,

message:"Missing data"

});


}





const client =
new MongoClient(uri);



await client.connect();



const db =
client.db("eva_earning");



const withdraws =
db.collection("withdraws");





await withdraws.updateOne(

{
_id:new ObjectId(id)
},

{

$set:{

status:status,

updatedAt:new Date()

}

}

);





await client.close();





res.json({

success:true,

message:"Withdraw Updated"

});





}catch(error){


console.log(error);



res.status(500).json({

success:false,

message:error.message

});


}



}
