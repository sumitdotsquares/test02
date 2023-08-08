const UTILS = {
  getQueryStringFromObject: function(obj) {
    const queryString = Object.keys(obj)
      .map(key => key + "=" + obj[key])
      .join("&");
    return queryString;
  },
  queryStringParse: function(string) {
    let parsed = {};
    if (string != "") {
      string = string.substring(string.indexOf("?") + 1);
      let p1 = string.split("&");
      p1.map(function(value) {
        let params = value.split("=");
        parsed[params[0]] = params[1];
      });
    }
    return parsed;
  },
};

export default UTILS;
