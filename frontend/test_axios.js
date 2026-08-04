const axios = require('axios');

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.get('proveedores/')
  .then(res => {
    console.log("SUCCESS:", res.data);
  })
  .catch(err => {
    console.log("ERROR MESSAGE:", err.message);
    if (err.response) {
      console.log("ERROR STATUS:", err.response.status);
      console.log("ERROR DATA:", err.response.data);
    }
  });
