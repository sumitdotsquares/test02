import axios from "axios";

export default axios.create({
  baseURL: window.drupalSettings.origin,
  headers: {
    "Content-Type": "application/json"
  }
});
