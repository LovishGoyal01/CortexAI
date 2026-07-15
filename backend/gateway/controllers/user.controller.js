export const getCurrentUser = (req, res) => {
  try {
    return res.status(200).json(req.user); 
  } catch (error) {
    console.error("Error fetching current user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}    