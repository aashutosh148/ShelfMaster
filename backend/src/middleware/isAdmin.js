import { sendErrorResponse } from "../utils/response.js";

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return sendErrorResponse(res, "You aren't authorized, Admin privilege needed");
  }
};

export default isAdmin;
