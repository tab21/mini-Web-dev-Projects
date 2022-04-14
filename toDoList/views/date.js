exports.getDay = function () {
  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  // @ts-ignore
  return today.toLocaleDateString("en-US", options);
};
