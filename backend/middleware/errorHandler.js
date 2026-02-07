module.exports = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  const status = err.status || 500;

  const payload = {
    message: err.message || 'Internal Server Error'
  };

  // HTML response (browser)
  if (req.accepts('html')) {
    return res
      .status(status)
      .send(`<h1>Error</h1><pre>${payload.message}</pre>`);
  }

  // JSON response (API)
  return res.status(status).json(payload);
};
