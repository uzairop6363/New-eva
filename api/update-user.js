const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;

module.exports = async function handler(req, res) {

  if (req.method !== "POST") {
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

    const {
      phone,
      wallet,
      reward,
      ads,
      watchedAds,
      plan
    } = req.body;

    await users.updateOne(
      { phone },
      {
        $set: {
          wallet,
          reward,
          ads,
          watchedAds,
          plan
        }
      }
    );

    res.json({
      success: true
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
