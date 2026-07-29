const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db("eva_earning");
    const users = db.collection("users");

    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    const existing = await users.findOne({ phone });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Account already exists"
      });
    }

    await users.insertOne({
      name,
      phone,
      password,
      wallet: 0,
      reward: 0,
      ads: 5,
      watchedAds: 0,
      plan: "FREE PLAN",
      createdAt: new Date()
    });

    return res.status(200).json({
      success: true,
      message: "Account created successfully"
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message
    });

  } finally {
    await client.close();
  }
};
