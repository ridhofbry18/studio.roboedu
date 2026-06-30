const http = require('http');

async function testLogin() {
  // First, get CSRF token
  const csrfRes = await fetch('http://localhost:3000/api/auth/csrf');
  const csrfData = await csrfRes.json();
  const csrfToken = csrfData.csrfToken;
  
  const cookies = csrfRes.headers.get('set-cookie');
  
  // Login
  const loginRes = await fetch('http://localhost:3000/api/auth/callback/credentials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': cookies
    },
    body: new URLSearchParams({
      csrfToken: csrfToken,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      json: 'true'
    })
  });
  
  const loginData = await loginRes.json();
  console.log('Login Result:', loginData);
  
  const loginCookies = loginRes.headers.get('set-cookie');
  console.log('Login Cookies:', loginCookies);
  
  // Fetch session
  const sessionRes = await fetch('http://localhost:3000/api/auth/session', {
    headers: {
      'Cookie': loginCookies
    }
  });
  const sessionData = await sessionRes.json();
  console.log('Session Data:', sessionData);
}

testLogin().catch(console.error);
