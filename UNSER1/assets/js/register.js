document.getElementById("registerBtn").addEventListener("click", async () => {

  const name = document.getElementById("registerName").value;

  const email = document.getElementById("registerEmail").value;

  const password = document.getElementById("registerPassword").value;



  if (!name || !email || !password) {

    alert("Please fill all fields");

    return;

  }



  try {

    const response = await API.register(name, email, password);

    

    if (response.success) {

      alert('Registration successful! Please login.');

      window.location.href = "/login";

    } else {

      alert(response.message || 'Registration failed');

    }

  } catch (error) {

    alert('Registration failed: ' + error.message);

  }

});

