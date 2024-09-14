import { getErrorResponse } from "../utils/response.js";

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).send(getErrorResponse("Admin privileges required"));
  }
};

export default isAdmin;
