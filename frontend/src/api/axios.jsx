import axios from "axios";
// import {baseUrl} from './url';/

const instance = axios.create({
    baseURL:  "https://palaxi.onrender.com",
  });

  export default instance;