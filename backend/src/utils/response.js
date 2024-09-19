function sendErrorResponse(res, message) {
  return res.status(400).json({
    message
  }) ;
}
function sendSuccessResponse(res, message, data) {
  return res.status(200).json({
    message,
    data
  });
}
export { sendErrorResponse, sendSuccessResponse };
