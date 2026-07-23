const axios = require('axios');

async function run() {
  try {
    const loginRes = await axios.post('http://localhost:8080/api/auth/login', {
      email: 'admin@billingos.com',
      password: 'password'
    });
    const token = loginRes.data.data.token;
    
    // create customer
    const custRes = await axios.post('http://localhost:8080/api/customers', {
      firstName: 'Test', lastName: 'User', companyName: 'Test Inc'
    }, { headers: { 'Authorization': 'Bearer ' + token, 'X-Tenant-ID': 'ten-7910686c-40da-48b4-a719-eb33c87fa7d4' } });
    
    const custId = custRes.data.data.id;
    
    // create invoice
    const invRes = await axios.post('http://localhost:8080/api/invoices', {
      customerId: custId,
      status: 'DRAFT',
      currency: 'USD',
      subtotal: 100,
      taxTotal: 10,
      total: 110,
      lineItems: [
        { description: 'Test Item', quantity: 1, unitAmount: 100, itemType: 'PRODUCT' }
      ]
    }, { headers: { 'Authorization': 'Bearer ' + token, 'X-Tenant-ID': 'ten-7910686c-40da-48b4-a719-eb33c87fa7d4' } });
    
    const invId = invRes.data.data.id;
    console.log('Created invoice:', invId);
    
    // try to download
    try {
      await axios.get(http://localhost:8080/api/invoices//download, {
        headers: { 'Authorization': 'Bearer ' + token, 'X-Tenant-ID': 'ten-7910686c-40da-48b4-a719-eb33c87fa7d4' },
        responseType: 'arraybuffer'
      });
      console.log('PDF download SUCCESS!');
    } catch(e) {
      console.log('PDF download FAILED:', e.response ? e.response.status : e.message);
      if (e.response && e.response.data) {
        console.log(e.response.data.toString());
      }
    }
  } catch(e) {
    console.log('Error:', e.response ? e.response.data : e.message);
  }
}
run();
