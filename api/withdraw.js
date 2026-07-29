const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;


export default async function handler(req, res) {


  if(req.method !== "POST"){

    return res.status(405).json({
      message:"Method not allowed"
    });

  }


  try{


    const client = new MongoClient(uri);

    await client.connect();


    const db = client.db("eva_earning");

    const users = db.collection("users");
    const withdraws = db.collection("withdraws");


    const {
      phone,
      method,
      name,
      number,
      amount
    } = req.body;



    if(!phone || !method || !name || !number || !amount){

      return res.status(400).json({
        message:"All details required"
      });

    }



    const user = await users.findOne({
      phone:phone
    });



    if(!user){

      return res.status(404).json({
        message:"User not found"
      });

    }



    const withdrawAmount = Number(amount);



    // Free plan daily limit

    if(user.plan === "FREE PLAN" && withdrawAmount > 50){

      return res.status(400).json({

        message:"Free Plan daily withdrawal limit is PKR 50"

      });

    }



    // Check wallet

    if(user.wallet < withdrawAmount){

      return res.status(400).json({

        message:"Insufficient balance"

      });

    }



    // Save withdraw request

    await withdraws.insertOne({

      userPhone:phone,

      name:name,

      method:method,

      accountNumber:number,

      amount:withdrawAmount,

      status:"Pending",

      createdAt:new Date()

    });



    // Deduct wallet

    await users.updateOne(

      {
        phone:phone
      },

      {

        $inc:{
          wallet:-withdrawAmount
        }

      }

    );



    await client.close();



    res.json({

      success:true,

      message:"Withdraw request submitted"

    });



  }catch(error){


    res.status(500).json({

      success:false,

      message:error.message

    });


  }


}
