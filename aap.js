if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "index.html";
}

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  document.getElementById("themeToggle").innerText = "Light Mode";
}

var sampleEmployees = [
  { id: "EMP001", name: "Rahul Sharma", dept: "IT", email: "rahul@company.com", phone: "9876543210", attendance: "Present", task: "Prepare Report", status: "In Progress" },
  { id: "EMP002", name: "Priya Verma", dept: "HR", email: "priya@company.com", phone: "9876543211", attendance: "Present", task: "Client Meeting", status: "Pending" },
  { id: "EMP003", name: "Amit Kumar", dept: "Sales", email: "amit@company.com", phone: "9876543212", attendance: "Absent", task: "Update Database", status: "Pending" },
  { id: "EMP004", name: "Sneha Gupta", dept: "Finance", email: "sneha@company.com", phone: "9876543213", attendance: "Present", task: "Testing", status: "Completed" },
  { id: "EMP005", name: "Vikram Singh", dept: "IT", email: "vikram@company.com", phone: "9876543214", attendance: "Present", task: "Documentation", status: "In Progress" },
  { id: "EMP006", name: "Neha Patel", dept: "Marketing", email: "neha@company.com", phone: "9876543215", attendance: "Absent", task: "Prepare Report", status: "Pending" },
  { id: "EMP007", name: "Rohit Yadav", dept: "IT", email: "rohit@company.com", phone: "9876543216", attendance: "Present", task: "Client Meeting", status: "Completed" },
  { id: "EMP008", name: "Anjali Mishra", dept: "HR", email: "anjali@company.com", phone: "9876543217", attendance: "Present", task: "Testing", status: "In Progress" },
  { id: "EMP009", name: "Suresh Reddy", dept: "Sales", email: "suresh@company.com", phone: "9876543218", attendance: "Present", task: "Update Database", status: "Completed" },
  { id: "EMP010", name: "Kavita Joshi", dept: "Finance", email: "kavita@company.com", phone: "9876543219", attendance: "Absent", task: "Documentation", status: "Pending" }
];

if (!localStorage.getItem("employees")) {
  localStorage.setItem("employees", JSON.stringify(sampleEmployees));
}

var employees = JSON.parse(localStorage.getItem("employees"));
var editingId = null;

var defaultTasks = ["Prepare Report", "Client Meeting", "Update Database", "Testing", "Documentation"];

if (!localStorage.getItem("tasks")) {
  localStorage.setItem("tasks", JSON.stringify(defaultTasks));
}
var taskOptions = JSON.parse(localStorage.getItem("tasks"));
var statusOptions = ["Pending", "In Progress", "Completed"];

function saveData() {
  localStorage.setItem("employees", JSON.stringify(employees));
}

// ADDED: save the task list to local storage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(taskOptions));
}


function showDate() {
  var d = new Date();
  var options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  document.getElementById("currentDate").innerText = d.toLocaleDateString("en-US", options);
}

function updateDashboard() {
  var total = employees.length;
  var present = 0;
  var pending = 0;
  var completed = 0;
  for (var i = 0; i < employees.length; i++) {
    if (employees[i].attendance === "Present") present++;
    if (employees[i].status === "Pending") pending++;
    if (employees[i].status === "Completed") completed++;
  }
  document.getElementById("totalEmployees").innerText = total;
  document.getElementById("presentToday").innerText = present;
  document.getElementById("pendingTasks").innerText = pending;
  document.getElementById("completedTasks").innerText = completed;
}

function badge(text, type) {
  return '<span class="badge badge-' + type + '">' + text + '</span>';
}

function attendanceBadge(a) {
  return badge(a, a === "Present" ? "present" : "absent");
}

function statusBadge(s) {
  var cls = "pending";
  if (s === "In Progress") cls = "progress";
  if (s === "Completed") cls = "completed";
  return badge(s, cls);
}

function renderEmployees() {
  var search = document.getElementById("searchInput").value.toLowerCase();
  var dept = document.getElementById("departmentFilter").value;
  var tbody = document.getElementById("employeeTable");
  var html = "";

  for (var i = 0; i < employees.length; i++) {
    var emp = employees[i];
    if (search && emp.name.toLowerCase().indexOf(search) === -1) continue;
    if (dept && emp.dept !== dept) continue;

    html += "<tr>";
    html += "<td>" + emp.id + "</td>";
    html += "<td>" + emp.name + "</td>";
    html += "<td>" + emp.dept + "</td>";
    html += "<td>" + emp.email + "</td>";
    html += "<td>" + emp.phone + "</td>";
    html += "<td>" + attendanceBadge(emp.attendance) + "</td>";
    html += "<td>" + emp.task + "</td>";
    html += "<td>" + statusBadge(emp.status) + "</td>";
    html += "<td>";
    html += '<button class="action-btn btn-view" onclick="viewEmployee(\'' + emp.id + '\')">View</button>';
    html += '<button class="action-btn btn-edit" onclick="editEmployee(\'' + emp.id + '\')">Edit</button>';
    html += '<button class="action-btn btn-delete" onclick="deleteEmployee(\'' + emp.id + '\')">Delete</button>';
    html += "</td>";
    html += "</tr>";
  }

  if (html === "") {
    html = '<tr><td colspan="9" style="text-align:center;padding:24px;color:var(--muted)">No employees found</td></tr>';
  }
  tbody.innerHTML = html;
}

function renderAttendance() {
  var tbody = document.getElementById("attendanceTable");
  var html = "";
  for (var i = 0; i < employees.length; i++) {
    var emp = employees[i];
    html += "<tr>";
    html += "<td>" + emp.id + "</td>";
    html += "<td>" + emp.name + "</td>";
    html += "<td>" + emp.dept + "</td>";
    html += "<td>" + attendanceBadge(emp.attendance) + "</td>";
    html += "<td>";
    html += '<button class="action-btn btn-view" onclick="markAttendance(\'' + emp.id + '\',\'Present\')">Present</button>';
    html += '<button class="action-btn btn-delete" onclick="markAttendance(\'' + emp.id + '\',\'Absent\')">Absent</button>';
    html += "</td>";
    html += "</tr>";
  }
  tbody.innerHTML = html;
}

function renderTasks() {
  var tbody = document.getElementById("tasksTable");
  var html = "";
  for (var i = 0; i < employees.length; i++) {
    var emp = employees[i];
    var taskSel = '<select class="select-inline" onchange="updateTask(\'' + emp.id + '\', this.value)">';
    for (var j = 0; j < taskOptions.length; j++) {
      var sel = taskOptions[j] === emp.task ? " selected" : "";
      taskSel += "<option" + sel + ">" + taskOptions[j] + "</option>";
    }
    taskSel += "</select>";

    var statusSel = '<select class="select-inline" onchange="updateStatus(\'' + emp.id + '\', this.value)">';
    for (var k = 0; k < statusOptions.length; k++) {
      var sels = statusOptions[k] === emp.status ? " selected" : "";
      statusSel += "<option" + sels + ">" + statusOptions[k] + "</option>";
    }
    statusSel += "</select>";

    html += "<tr>";
    html += "<td>" + emp.id + "</td>";
    html += "<td>" + emp.name + "</td>";
    html += "<td>" + taskSel + "</td>";
    html += "<td>" + statusSel + "</td>";
    html += "</tr>";
  }
  tbody.innerHTML = html;
}

function refreshAll() {
  updateDashboard();
  renderEmployees();
  renderAttendance();
  renderTasks();
}

function markAttendance(id, status) {
  for (var i = 0; i < employees.length; i++) {
    if (employees[i].id === id) {
      employees[i].attendance = status;
      break;
    }
  }
  saveData();
  refreshAll();
}

function updateTask(id, task) {
  for (var i = 0; i < employees.length; i++) {
    if (employees[i].id === id) {
      employees[i].task = task;
      break;
    }
  }
  saveData();
  refreshAll();
}

function updateStatus(id, status) {
  for (var i = 0; i < employees.length; i++) {
    if (employees[i].id === id) {
      employees[i].status = status;
      break;
    }
  }
  saveData();
  refreshAll();
}

function findEmployee(id) {
  for (var i = 0; i < employees.length; i++) {
    if (employees[i].id === id) return employees[i];
  }
  return null;
}

function viewEmployee(id) {
  var emp = findEmployee(id);
  if (!emp) return;
  var box = document.getElementById("viewContent");
  var html = "";
  html += "<div><span>Employee ID</span><span>" + emp.id + "</span></div>";
  html += "<div><span>Name</span><span>" + emp.name + "</span></div>";
  html += "<div><span>Department</span><span>" + emp.dept + "</span></div>";
  html += "<div><span>Email</span><span>" + emp.email + "</span></div>";
  html += "<div><span>Phone</span><span>" + emp.phone + "</span></div>";
  html += "<div><span>Attendance</span><span>" + emp.attendance + "</span></div>";
  html += "<div><span>Assigned Task</span><span>" + emp.task + "</span></div>";
  html += "<div><span>Task Status</span><span>" + emp.status + "</span></div>";
  box.innerHTML = html;
  document.getElementById("viewModal").classList.remove("hidden");
}

function deleteEmployee(id) {
  if (!confirm("Are you sure you want to delete this employee?")) return;
  var newList = [];
  for (var i = 0; i < employees.length; i++) {
    if (employees[i].id !== id) newList.push(employees[i]);
  }
  employees = newList;
  saveData();
  refreshAll();
}

function openForm() {
  editingId = null;
  document.getElementById("modalTitle").innerText = "Add Employee";
  document.getElementById("employeeForm").reset();
  document.getElementById("empId").disabled = false;
  document.getElementById("formError").innerText = "";
  document.getElementById("employeeModal").classList.remove("hidden");
}

function editEmployee(id) {
  var emp = findEmployee(id);
  if (!emp) return;
  editingId = id;
  document.getElementById("modalTitle").innerText = "Edit Employee";
  document.getElementById("empId").value = emp.id;
  document.getElementById("empId").disabled = true;
  document.getElementById("empName").value = emp.name;
  document.getElementById("empDept").value = emp.dept;
  document.getElementById("empEmail").value = emp.email;
  document.getElementById("empPhone").value = emp.phone;
  document.getElementById("formError").innerText = "";
  document.getElementById("employeeModal").classList.remove("hidden");
}

function isValidEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function isValidPhone(phone) {
  return /^\d{10}$/.test(phone);
}

document.getElementById("employeeForm").addEventListener("submit", function (e) {
  e.preventDefault();
  var id = document.getElementById("empId").value.trim();
  var name = document.getElementById("empName").value.trim();
  var dept = document.getElementById("empDept").value;
  var email = document.getElementById("empEmail").value.trim();
  var phone = document.getElementById("empPhone").value.trim();
  var err = document.getElementById("formError");
  err.innerText = "";

  if (!id || !name || !dept || !email || !phone) {
    err.innerText = "Please fill all fields";
    return;
  }
  if (!isValidEmail(email)) {
    err.innerText = "Please enter a valid email";
    return;
  }
  if (!isValidPhone(phone)) {
    err.innerText = "Phone must be exactly 10 digits";
    return;
  }

  if (editingId === null) {
    for (var i = 0; i < employees.length; i++) {
      if (employees[i].id === id) {
        err.innerText = "Employee ID already exists";
        return;
      }
    }
    employees.push({
      id: id, name: name, dept: dept, email: email, phone: phone,
      attendance: "Absent", task: "Prepare Report", status: "Pending"
    });
  } else {
    var emp = findEmployee(editingId);
    emp.name = name;
    emp.dept = dept;
    emp.email = email;
    emp.phone = phone;
  }

  saveData();
  refreshAll();
  closeModals();
});

function closeModals() {
  document.getElementById("employeeModal").classList.add("hidden");
  document.getElementById("viewModal").classList.add("hidden");
}

var closers = document.querySelectorAll("[data-close]");
for (var c = 0; c < closers.length; c++) {
  closers[c].addEventListener("click", closeModals);
}

document.getElementById("addEmployeeBtn").addEventListener("click", openForm);
document.getElementById("searchInput").addEventListener("input", renderEmployees);
document.getElementById("departmentFilter").addEventListener("change", renderEmployees);

// ADDED: handle adding a new task to the task list
document.getElementById("addTaskBtn").addEventListener("click", function () {
  var input = document.getElementById("newTaskInput");
  var value = input.value.trim();
  if (value === "") {
    alert("Please enter a task name");
    return;
  }
  for (var i = 0; i < taskOptions.length; i++) {
    if (taskOptions[i].toLowerCase() === value.toLowerCase()) {
      alert("This task already exists");
      return;
    }
  }
  taskOptions.push(value);
  saveTasks();
  input.value = "";
  renderTasks();
});


var navLinks = document.querySelectorAll(".nav-link");
var pages = { dashboard: "Dashboard", employees: "Employees", attendance: "Attendance", tasks: "Tasks" };

for (var n = 0; n < navLinks.length; n++) {
  navLinks[n].addEventListener("click", function (e) {
    e.preventDefault();
    var page = this.getAttribute("data-page");
    for (var k = 0; k < navLinks.length; k++) navLinks[k].classList.remove("active");
    this.classList.add("active");

    document.getElementById("dashboardPage").classList.add("hidden");
    document.getElementById("employeesPage").classList.add("hidden");
    document.getElementById("attendancePage").classList.add("hidden");
    document.getElementById("tasksPage").classList.add("hidden");
    document.getElementById(page + "Page").classList.remove("hidden");
    document.getElementById("pageTitle").innerText = pages[page];
  });
}

document.getElementById("themeToggle").addEventListener("click", function () {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    this.innerText = "Light Mode";
  } else {
    localStorage.setItem("theme", "light");
    this.innerText = "Dark Mode";
  }
});

document.getElementById("logoutBtn").addEventListener("click", function () {
  localStorage.removeItem("loggedIn");
  window.location.href = "index.html";
});

showDate();
refreshAll();
