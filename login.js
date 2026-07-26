var form = document.getElementById("loginForm");
var userInput = document.getElementById("username");
var passInput = document.getElementById("password");
var errorMsg = document.getElementById("loginError");
var toggleBtn = document.getElementById("togglePass");

toggleBtn.addEventListener("click", function () {
  if (passInput.type === "password") {
    passInput.type = "text";
    toggleBtn.innerText = "Hide";
  } else {
    passInput.type = "password";
    toggleBtn.innerText = "Show";
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  var u = userInput.value.trim();
  var p = passInput.value.trim();
  errorMsg.innerText = "";

  if (u === "" || p === "") {
    errorMsg.innerText = "Please enter username and password";
    return;
  }

  if (u === "admin" && p === "admin123") {
    localStorage.setItem("loggedIn", "true");
    window.location.href = "dashboard.html";
  } else {
    errorMsg.innerText = "Invalid username or password";
  }
});

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}
