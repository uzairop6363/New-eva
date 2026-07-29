const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGO_URI;

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "Eva@12345";


module.exports = async function handler(req, res) {

  const action = req.query.action;

  const client = new MongoClient(uri);


  try {

    await client.connect();

    const db = client.db("eva_earning");

    const users = db.collection("users");
    const withdraws = db.collection("withdraws");



    // ADMIN LOGIN
    if (action === "login") {

      if (req.method !== "POST") {
        return res.status(405).json({
          message:"Method not allowed"
        });
      }


      const {
        username,
        password
      } = req.body;


      if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
      ) {

        return res.json({
          success:true,
          message:"Admin Login Successful",
          admin:{
            username
          }
        });

      }


      return res.status(401).json({
        success:false,
        message:"Invalid Admin Login"
      });

    }




    // STATS
    if(action === "stats") {


      const totalUsers = await users.countDocuments();


      const pending = await withdraws.countDocuments({
        status:"Pending"
      });


      const approved = await withdraws.countDocuments({
        status:"Approved"
      });


      const rejected = await withdraws.countDocuments({
        status:"Rejected"
      });



      const amount = await withdraws.aggregate([

        {
          $match:{
            status:"Approved"
          }
        },

        {
          $group:{
            _id:null,
            total:{
              $sum:"$amount"
            }
          }
        }

      ]).toArray();



      return res.json({

        success:true,

        stats:{

          totalUsers,
          pending,
          approved,
          rejected,

          totalApprovedAmount:
          amount.length ? amount[0].total : 0

        }

      });


    }





    // USERS
    if(action === "users") {


      const allUsers = await users.find({}).toArray();


      return res.json({

        success:true,
        users:allUsers

      });


    }





    // WITHDRAWS
    if(action === "withdraws") {


      const data = await withdraws
      .find({})
      .sort({
        createdAt:-1
      })
      .toArray();



      return res.json({

        success:true,
        withdraws:data

      });


    }




    // APPROVE WITHDRAW
    if(action === "approve") {


      if(req.method !== "POST"){
        return res.status(405).json({
          message:"Method not allowed"
        });
      }


      const { id } = req.body;


      await withdraws.updateOne(

        {
          _id:new ObjectId(id)
        },

        {
          $set:{
            status:"Approved",
            approvedAt:new Date()
          }
        }

      );



      return res.json({

        success:true,
        message:"Withdraw approved"

      });


    }





    // REJECT WITHDRAW
    if(action === "reject") {


      if(req.method !== "POST"){
        return res.status(405).json({
          message:"Method not allowed"
        });
      }



      const { id } = req.body;



      await withdraws.updateOne(

        {
          _id:new ObjectId(id)
        },

        {
          $set:{
            status:"Rejected",
            rejectedAt:new Date()
          }
        }

      );



      return res.json({

        success:true,
        message:"Withdraw rejected"

      });


    }




    return res.status(400).json({

      success:false,
      message:"Invalid action"

    });



  } catch(error) {


    console.log(error);


    return res.status(500).json({

      success:false,
      message:error.message

    });


  } finally {


    await client.close();


  }


};
