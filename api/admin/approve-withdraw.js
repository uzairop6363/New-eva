const { MongoClient, ObjectId } = require("mongodb");

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

    const withdraws = db.collection("withdraws");

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Withdraw ID required"
      });
    }

    const result = await withdraws.updateOne(
      {
        _id: new ObjectId(id)
      },
      {
        $set: {
          status: "Approved",
          approvedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Withdraw request not found"
      });
    }

    return res.json({
      success: true,
      message: "Withdraw approved successfully"
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
