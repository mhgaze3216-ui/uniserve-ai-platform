document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const response = await API.login(email, password);
    
    if (response.success) {
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
  }
});
