const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;

module.exports = async function handler(req, res) {

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  const client = new MongoClient(uri);

  try {

    await client.connect();

    const db = client.db("eva_earning");

    const users = db.collection("users");

    const withdraws = db.collection("withdraws");

    const allUsers = await users.find({}).toArray();

    const result = [];

    for (const user of allUsers) {

      const approved = await withdraws.countDocuments({
        userPhone: user.phone,
        status: "Approved"
      });

      const rejected = await withdraws.countDocuments({
        userPhone: user.phone,
        status: "Rejected"
      });

      const pending = await withdraws.countDocuments({
        userPhone: user.phone,
        status: "Pending"
      });

      const approvedAmount = await withdraws.aggregate([
        {
          $match: {
            userPhone: user.phone,
            status: "Approved"
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount"
            }
          }
        }
      ]).toArray();

      result.push({

        name: user.name,
        phone: user.phone,

        wallet: user.wallet || 0,
        reward: user.reward || 0,
        ads: user.ads || 0,
        watchedAds: user.watchedAds || 0,
        plan: user.plan || "FREE PLAN",

        approvedWithdraws: approved,
        rejectedWithdraws: rejected,
        pendingWithdraws: pending,

        totalApprovedAmount:
          approvedAmount.length > 0
            ? approvedAmount[0].total
            : 0

      });

    }

    res.json({

      success: true,

      users: result

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,

      message: err.message

    });

  } finally {

    await client.close();

  }

};
