module.exports.successResponse = (data, res) => {
  res.status(200).send({
    data: data,
    status: true,
  });
};

module.exports.failResponse = (data, res) => {
  res.status(422).send({
    data: data,
    status: false,
  });
};
