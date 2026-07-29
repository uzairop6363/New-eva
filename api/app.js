const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGO_URI;

module.exports = async function handler(req, res) {

  const action = req.query.action;

  const client = new MongoClient(uri);

  try {

    await client.connect();

    const db = client.db("eva_earning");

    const users = db.collection("users");
    const withdraws = db.collection("withdraws");


    // LOGIN
    if (action === "login") {

      if (req.method !== "POST") {
        return res.status(405).json({
          message: "Method not allowed"
        });
      }

      const { phone, password } = req.body;

      if (!phone || !password) {
        return res.status(400).json({
          success:false,
          message:"Phone and password required"
        });
      }


      const user = await users.findOne({
        phone,
        password
      });


      if (!user) {
        return res.status(401).json({
          success:false,
          message:"Invalid phone or password"
        });
      }


      return res.json({
        success:true,
        message:"Login successful",
        user
      });

    }



    // REGISTER
    if (action === "register") {

      if (req.method !== "POST") {
        return res.status(405).json({
          message:"Method not allowed"
        });
      }


      const {
        name,
        phone,
        password
      } = req.body;


      if (!name || !phone || !password) {
        return res.status(400).json({
          success:false,
          message:"All fields required"
        });
      }


      const existing = await users.findOne({
        phone
      });


      if(existing){
        return res.status(400).json({
          success:false,
          message:"Account already exists"
        });
      }


      await users.insertOne({

        name,
        phone,
        password,
        wallet:0,
        reward:0,
        ads:5,
        watchedAds:0,
        plan:"FREE PLAN",
        createdAt:new Date()

      });


      return res.json({
        success:true,
        message:"Account created successfully"
      });

    }




    // WITHDRAW
    if(action === "withdraw"){

      if(req.method !== "POST"){
        return res.status(405).json({
          message:"Method not allowed"
        });
      }


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
        phone
      });


      if(!user){

        return res.status(404).json({
          message:"User not found"
        });

      }


      const withdrawAmount = Number(amount);



      if(user.plan === "FREE PLAN" && withdrawAmount > 50){

        return res.status(400).json({
          message:"Free Plan daily withdrawal limit is PKR 50"
        });

      }



      if(user.wallet < withdrawAmount){

        return res.status(400).json({
          message:"Insufficient balance"
        });

      }



      await withdraws.insertOne({

        userPhone:phone,
        name:name,
        method:method,
        accountNumber:number,
        amount:withdrawAmount,
        status:"Pending",
        createdAt:new Date()

      });



      await users.updateOne(
        {
          phone
        },
        {
          $inc:{
            wallet:-withdrawAmount
          }
        }
      );


      return res.json({
        success:true,
        message:"Withdraw request submitted"
      });


    }





    // WITHDRAW HISTORY
    if(action === "withdraw-history"){

      if(req.method !== "GET"){
        return res.status(405).json({
          message:"Method not allowed"
        });
      }


      const { phone } = req.query;


      if(!phone){

        return res.status(400).json({
          success:false,
          message:"Phone required"
        });

      }


      const history = await withdraws
      .find({
        userPhone:phone
      })
      .sort({
        createdAt:-1
      })
      .toArray();



      return res.json({

        success:true,
        withdraws:history

      });

    }





    // UPDATE USER
    if(action === "update-user"){

      if(req.method !== "POST"){
        return res.status(405).json({
          message:"Method not allowed"
        });
      }


      const {
        phone,
        wallet,
        reward,
        ads,
        watchedAds,
        plan
      } = req.body;



      await users.updateOne(

        {
          phone
        },

        {
          $set:{
            wallet,
            reward,
            ads,
            watchedAds,
            plan
          }
        }

      );


      return res.json({
        success:true
      });


    }





    // UPDATE WITHDRAW
    if(action === "update-withdraw"){

      if(req.method !== "POST"){
        return res.status(405).json({
          message:"Method not allowed"
        });
      }


      const {
        id,
        status
      } = req.body;



      if(!id || !status){

        return res.status(400).json({
          success:false,
          message:"Missing data"
        });

      }



      await withdraws.updateOne(

        {
          _id:new ObjectId(id)
        },

        {

          $set:{
            status,
            updatedAt:new Date()
          }

        }

      );



      return res.json({

        success:true,
        message:"Withdraw Updated"

      });


    }




    return res.status(400).json({

      success:false,
      message:"Invalid action"

    });



  } catch(error){


    console.log(error);


    return res.status(500).json({

      success:false,
      message:error.message

    });



  } finally {

    await client.close();

  }

};
