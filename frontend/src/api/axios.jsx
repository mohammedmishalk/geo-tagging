import axios from "axios";
// import {baseUrl} from './url';/

const instance = axios.create({
    baseURL:  "http://localhost:5000",
  });

  export default instance;