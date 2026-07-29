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

    const withdraw = await withdraws.findOne({
      _id: new ObjectId(id)
    });

    if (!withdraw) {
      return res.status(404).json({
        success: false,
        message: "Withdraw request not found"
      });
    }

    await withdraws.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "Rejected",
          rejectedAt: new Date()
        }
      }
    );

    return res.json({
      success: true,
      message: "Withdraw rejected successfully"
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
