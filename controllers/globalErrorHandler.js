// temporary code until the handler is built
module.exports = (err, req, res, next) => {
  console.error("ERROR 💥", err);

  return res
    .status(500)
    .json({ status: "error", message: "Something went wrong!" });
};
