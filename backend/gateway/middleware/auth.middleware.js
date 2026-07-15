import redis from "../../shared/redis/redis.js";

const protect = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.session;
    if (!sessionId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const session = await redis.get(`session-${sessionId}`);
    if (!session) {   // means the session has expired or is invalid
      return res.status(401).json({ message: "Session expired or invalid" });
    }

    req.user = JSON.parse(session);
    next();
  } catch (error) {
    console.error("Error in auth middleware:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default protect;