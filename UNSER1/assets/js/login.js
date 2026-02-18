document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const loginBtn = document.getElementById("loginBtn");
    loginBtn.textContent = 'Signing in...';
    loginBtn.disabled = true;

    const response = await EnhancedAPI.login(email, password);
    
    if (response.token) {
      // Save auth data
      Auth.saveAuthData(response.token, response.user);
      
      // Update UI
      alert('Login successful!');
      window.location.href = "/";
    } else {
      alert(response.message || 'Login failed');
    }
  } catch (error) {
    alert('Login failed: ' + error.message);
  } finally {
    const loginBtn = document.getElementById("loginBtn");
    loginBtn.textContent = 'Sign In';
    loginBtn.disabled = false;
  }
});
