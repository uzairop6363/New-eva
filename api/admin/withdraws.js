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

    const withdraws = db.collection("withdraws");

    const data = await withdraws
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json({
      success: true,
      withdraws: data
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
