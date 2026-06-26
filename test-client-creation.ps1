$ErrorActionPreference = "Stop"

# 1. Login as ULTRASUPERADMIN
$loginBody = @{
    email = "admin@billingplatform.com"
    password = "TempPass123!"
} | ConvertTo-Json

$loginResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$loginData = $loginResponse.Content | ConvertFrom-Json
$token = $loginData.data.token

Write-Host "Successfully obtained JWT Token."

# 2. Create a new Client via API
$clientBody = @{
    companyName = "Curl Test Corp"
    subdomain = "curltest"
    businessEmail = "contact@curltest.com"
    businessPhone = "1234567890"
    gstNumber = "GST123"
    addressLine1 = "123 Test St"
    addressLine2 = ""
    city = "Test City"
    state = "Test State"
    pincode = "12345"
    country = "US"
    industry = "SaaS"
    status = "Active"
    adminFullName = "Curl Admin"
    adminEmail = "admin@curltest.com"
    grantedModules = @("billing:home", "billing:customers")
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
}

Write-Host "`nSending POST /api/admin/clients..."
$createResponse = Invoke-WebRequest -Uri "http://localhost:8080/api/admin/clients" -Method Post -Headers $headers -Body $clientBody -ContentType "application/json"
$createData = $createResponse.Content | ConvertFrom-Json

Write-Host "`nAPI Response:"
$createData | ConvertTo-Json -Depth 5
