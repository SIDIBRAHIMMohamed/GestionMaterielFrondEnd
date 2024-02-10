import axios from 'axios';

const API_URL = 'http://localhost:9090';

export default {
  getRessource(url:any) {
    return axios.get(API_URL +url);
  },
  getRessource2(url: any, params: any) {
    return axios.get(API_URL + url, { params: params });
  },
  postRessource(url:any, data:any) {
    return axios.post(API_URL + url, data);
  },
    putRessource(url:any, data:any) {
        return axios.put(API_URL + url, data);
    },
    deleteRessource(url:any) {
        return axios.delete(API_URL + url);
    },


  
  
};
