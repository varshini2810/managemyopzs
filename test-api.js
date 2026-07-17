async function testApi() {
  try {
    // 1. Login
    console.log("Logging in...");
    const loginRes = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@billingplatform.com", password: "TempPass123!" })
    });
    
    if (!loginRes.ok) {
      console.log("Login failed!", loginRes.status, await loginRes.text());
      return;
    }
    
    const loginData = await loginRes.json();
    const token = loginData.data.accessToken;
    console.log("Got token:", token.substring(0, 10) + "...");
    
    // 2. Create Client
    console.log("Creating client...");
    const clientRes = await fetch("http://localhost:8080/api/admin/clients", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        companyName: "Acme Corp 2",
        subdomain: "acmecorp-" + Date.now(),
        businessEmail: "hello@acme.com",
        businessPhone: "555-1234",
        gstNumber: "GST999",
        addressLine1: "123 Main St",
        addressLine2: "",
        city: "SF",
        state: "CA",
        pincode: "94105",
        country: "US",
        industry: "SaaS",
        status: "Active",
        adminFullName: "John Doe",
        adminEmail: "john_" + Date.now() + "@acme.com",
        grantedModules: ["billing:home", "cpq:quotes"]
      })
    });
    
    const clientData = await clientRes.json();
    console.log("=== CLIENT CREATION RESPONSE ===");
    console.log(JSON.stringify(clientData, null, 2));
    
  } catch (err) {
    console.error("Error:", err);
  }
}

testApi();
