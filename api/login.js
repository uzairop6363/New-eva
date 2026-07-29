const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed"
    });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db("eva_earning");
    const users = db.collection("users");

    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and password required"
      });
    }

    const user = await users.findOne({
      phone,
      password
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone or password"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user
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
