const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { getMe };
