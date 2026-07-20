const http = require('http');

const data = JSON.stringify({
  email: 'aaa@gmail.com',
  password: 'password'
});

const req = http.request({
  hostname: 'localhost',
  port: 8080,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const json = JSON.parse(body);
    const token = json.data.accessToken;
    
    // Now post the expense
    const expData = JSON.stringify({
      id: "EXP-12345",
      category: "Professional Services",
      vendor: "Arun",
      employee: "Alice Johnson",
      department: "Engineering",
      amount: 333,
      tax: 2,
      currency: "USD",
      paymentMethod: "Credit Card",
      date: "2026-07-19",
      status: "Pending",
      description: "food",
      tags: ["food"]
    });
    
    const expReq = http.request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/expenses',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        'X-Tenant-ID': 'ten-7910686c-40da-48b4-a719-eb33c87fa7d4',
        'Content-Length': expData.length
      }
    }, (resExp) => {
      let expBody = '';
      resExp.on('data', d => expBody += d);
      resExp.on('end', () => {
        console.log("Expense response:", expBody);
      });
    });
    expReq.write(expData);
    expReq.end();
  });
});
req.write(data);
req.end();
