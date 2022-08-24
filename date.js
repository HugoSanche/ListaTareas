
// module.exports.getDate=getDate;
exports.getDate=function (){
  const today = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  return  today.toLocaleDateString("es-MX", options);
}

// module.exports.getDay=getDay;
exports.getDay=function (){
  const today = new Date();
  const options = {
    weekday: "long"
  };
  return  today.toLocaleDateString("es-MX", options);
}
