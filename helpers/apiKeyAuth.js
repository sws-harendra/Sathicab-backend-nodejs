export const apiKeyAuth = (req, res, next) => {
  const clientKey = req.headers["x-api-key"];

  if (!clientKey || clientKey !== process.env.APP_API_KEY) {
    console.log(clientKey, process.env.APP_API_KEY);
    return res
      .status(403)
      .json({ success: false, message: "Forbidden: Invalid API key" });
  }

  next();
};
