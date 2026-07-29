const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "Eva@12345";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed"
    });
  }

  try {

    const {
      username,
      password
    } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password required"
      });
    }

    if (
      username === ADMIN_USERNAME &&
      password === ADMIN_PASSWORD
    ) {

      return res.json({
        success: true,
        message: "Admin Login Successful",
        admin: {
          username: username
        }
      });

    }

    return res.status(401).json({
      success: false,
      message: "Invalid Admin Login"
    });


  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

}
