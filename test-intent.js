const axios = require('axios');

async function test() {
  try {
    const loginResp = await axios.post('http://localhost:5066/api/v1/auth/login', {
      email: 'chunhau.py@gmail.com', // I need a valid email, but we might not know it.
      password: 'Password123!'
    });
    console.log("Logged in");
  } catch (e) {
    console.error("Login failed", e.response?.data);
  }
}
test();
