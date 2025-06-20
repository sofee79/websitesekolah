const loginData = { username: "admin", password: "20522549" };
const form = document.getElementById("suratForm");
const tbody = document.querySelector("#suratTable tbody");
let dataSurat = JSON.parse(localStorage.getItem("suratKeluar")) || [];
let editIndex = -1;

function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  if (u === loginData.username && p === loginData.password) {
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("appContainer").style.display = "block";
    renderTable();
  } else {
    document.getElementById("loginError").style.display = "block";
  }
}

function renderTable() {
  tbody.innerHTML = "";
  dataSurat.forEach((s, i) => {
    const link = `https://drive.google.com/file/d/${s.linkId}/view`;
    tbody.innerHTML += `
      <tr>
        <td>${i+1}</td><td>${s.nomor}</td><td>${s.tanggal}</td><td>${s.tujuan}</td>
        <td>${s.perihal}</td><td>${s.status}</td>
        <td><a href="${link}" target="_blank">Link</a></td>
        <td>
          <button onclick="edit(${i})">Edit</button>
          <button onclick="hapus(${i})">Hapus</button>
        </td>
      </tr>`;
  });
}

function showForm() {
  document.getElementById("formDiv").style.display = "block";
}

form.onsubmit = function(e) {
  e.preventDefault();
  const fd = new FormData(form);
  const obj = Object.fromEntries(fd.entries());
  const match = obj.link.match(/\/d\/([\w-]+)/);
  obj.linkId = match ? match[1] : "";
  if (editIndex >= 0) {
    dataSurat[editIndex] = obj;
    editIndex = -1;
  } else {
    dataSurat.push(obj);
  }
  localStorage.setItem("suratKeluar", JSON.stringify(dataSurat));
  renderTable();
  form.reset();
  form.parentElement.style.display = "none";
};

function edit(i) {
  const d = dataSurat[i];
  Object.entries(d).forEach(([k,v]) => {
    if (form[k]) form[k].value = k === "link" ? `https://drive.google.com/file/d/${d.linkId}/view` : v;
  });
  editIndex = i;
  showForm();
}

function hapus(i) {
  if (confirm("Yakin hapus surat ini?")) {
    dataSurat.splice(i,1);
    localStorage.setItem("suratKeluar", JSON.stringify(dataSurat));
    renderTable();
  }
}

function backupData() {
  const blob = new Blob([JSON.stringify(dataSurat,null,2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "backup_surat.json"; a.click();
  URL.revokeObjectURL(url);
}