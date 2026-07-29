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

    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone required"
      });
    }

    const history = await withdraws
      .find({ userPhone: phone })
      .sort({ createdAt: -1 })
      .toArray();

    return res.json({
      success: true,
      withdraws: history
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message
    });

  } finally {

    await client.close();

  }

};
