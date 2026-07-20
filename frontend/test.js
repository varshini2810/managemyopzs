const axios = require('axios');

async function run() {
  try {
    console.log('--- NETWORK CAPTURE ---');
    console.log('Logging in as aaa@gmail.com...');
    const loginRes = await axios.post('http://localhost:8080/api/auth/login', {
      email: 'aaa@gmail.com',
      password: 'User@123'
    });
    const token = loginRes.data.data.token;
    console.log('Logged in.');

    const url = 'http://localhost:8080/api/invoices/INV-10020/download';
    console.log(URL: );
    console.log(METHOD: GET);

    try {
      const pdfRes = await axios.get(url, {
        headers: {
          'Authorization': Bearer ,
          'X-Tenant-ID': 'tenant-aaa', // I should check what tenant id to send... wait, the frontend sends it via interceptor!
        },
        responseType: 'arraybuffer' // so we can inspect headers
      });
      console.log(STATUS: );
      console.log(HEADERS: );
      console.log(BODY (first 100 chars): );
    } catch (e) {
      if (e.response) {
        console.log(STATUS: );
        console.log(HEADERS: );
        console.log(BODY (first 100 chars): );
      } else {
        console.log(Error: );
      }
    }
  } catch (err) {
    console.error('Failed script:', err.message);
  }
}
run();
