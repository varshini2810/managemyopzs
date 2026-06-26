async function testEmail() {
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
    
    // 2. Send Test Email
    console.log("Sending test email...");
    const emailRes = await fetch("http://localhost:8080/api/email/send", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        to: "sanjayforantigravity@gmail.com", // testing by sending it to ourselves
        subject: "Test Email from Opz Billing Tool",
        body: "Hello! This is a test email sent from the Spring Boot API during Phase 2 Verification."
      })
    });
    
    const emailData = await emailRes.json();
    console.log("=== EMAIL API RESPONSE ===");
    console.log(JSON.stringify(emailData, null, 2));
    
  } catch (err) {
    console.error("Error:", err);
  }
}

testEmail();
