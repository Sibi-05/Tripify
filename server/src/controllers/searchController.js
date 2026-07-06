import User from "../models/User.js";
import Trip from "../models/Trip.js";

export const executeGlobalSearch = async (req, res, next) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(200).json({ users: [], trips: [] });

    const searchRegex = new RegExp(query, "i");

    const [matchedUsers, matchedTrips] = await Promise.all([
      User.find({ 
        $or: [{ fullname: searchRegex }] 
      }).select("fullname profileImg").limit(10),
      
      Trip.find({
        $or: [
          { description: searchRegex },
          { title: searchRegex },
          { destination: searchRegex },
          { tags: searchRegex }
        ]
      }).limit(20)
    ]);

    res.status(200).json({
      success: true,
      users: matchedUsers,
      trips: matchedTrips 
    });

  } catch (error) {
    next(error);
  }
};