const sendResponse = (res, statusCode, status, message, data = null) => {
  const response = { status, message, data };
  if (!data) delete response.data;
  res.status(statusCode).json(response);
};

module.exports = { sendResponse };
