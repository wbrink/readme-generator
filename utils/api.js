const axios  = require("axios");

const api = {
  getData: function(username) {
    return axios({
      method: "get",
      url: `https://api.github.com/users/${username}`,
      headers: {"Accept": "application/vnd.github.v3+json"},
    });
  }
}


module.exports = api;