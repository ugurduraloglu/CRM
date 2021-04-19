
axios.get("http://localhost:8080/").then((res) => {
  console.log(res);
}).catch((err) => {
  if (err) {
    console.log(err);
  }
});

globalThis._token = "";
var username = document.querySelector("#username");
var userpassword = document.querySelector("#usersifre");

var btn = document.querySelector("#login_btn");
btn.onclick = async function () {
  try {
    var res = (await axios.post("http://localhost:8080/Auth", { username: username.value, userpassword: userpassword.value }));
    globalThis._token = res.data.token;
    if (res.data.responseCode == "CRM5") {
      alert(res.data.message);
    }
    if (res.data.responseCode == "CRM6") {
      alert(res.data.message);
    }
    if (globalThis._token) {
      document.querySelector(".login")
        .innerHTML = `<li><button id="btn_search" class="btn" onclick="search()">Kişi Arama</button></li>
                            <li><button id="btn_add" class="btn" onclick="add()">Kişi Ekleme</button></li>
                            <li><button id="btn_del" class="btn" onclick="del()">Kişi Silme</button></li>
                            <li><button id="btn_info" class="btn" onclick="update()">Kişi Bilgilerini Güncelleme</button></li><hr>`;
    }
  } catch (err) {
    console.log(err);
  }
  userpassword.value = "";
  username.value = "";
}
async function search() {
  try {
    document.querySelector(".crud_info").innerHTML = "";
    document.querySelector(".crud").innerHTML = `<input type="text" id="search_name" placeholder="Search Person Name" required><br><button id="search_button">Ara</button>`;
    var search_btn = document.querySelector("#search_button");
    search_btn.onclick = async function () {
      document.querySelector(".crud_info").innerHTML = "";
      var getName = document.querySelector("#search_name");
      await axios.get("http://localhost:8080/search",
        {
          headers: { Authorization: globalThis._token, Name: getName.value }
        })
        .then((res) => {
          if (res.data.responseCode == "CRM6") {
            alert(res.data.message);
          }
          else {
            var data = res.data;
            var info = document.querySelector(".crud_info");
            info.innerHTML = `<form action="">
            <fieldset>
              <legend>Kişi Bilgileri</legend>
              <input type="text" id="name" name="name" placeholder="Name" value="${data.name}">
              <input type="text" id="surname" name="surname" placeholder="Surname" value="${data.surname}">
              <input type="text" id="profession" name="profession" placeholder="Meslek" value="${data.meslek}"><br>
              <label for="date_of_birth">Doğum Tarihi:</label>
              <input type="date" id="date_of_birth" name="date_of_birth" placeholder="Doğum Tarihi" value="${data.date_of_birth}">
              <select id="gender" name="gender" placeholder="Choose a gender:" value="${data.cinsiyet}">
                  <option value="erkek">erkek</option>
                  <option value="kadın">kadın</option>
              </select>
            </fieldset><br>
            <fieldset>
                <legend>İletişim Bilgileri</legend>
                <input type="text" id="city" name="city" placeholder="Şehir" value="${data.city}">
                <input type="text" id="eposta" name="eposta" placeholder="E-posta" value="${data.eposta}">
                <input type="text" id="phone" name="phone" placeholder="Telefon" value="${data.telefon}"><br>
                <textarea name="adress" id="adress" cols="40" rows="8" placeholder="Adres bilgilerini giriniz..." value="">${data.adres}</textarea>
            </fieldset>
          </form>`;
          }
        });
    }
  } catch (err) {
    console.log(err);
  };
}
async function add() {
  try {
    document.querySelector(".crud").innerHTML = "";
    document.querySelector(".crud_info").innerHTML = `<form action="asd" id="form" name="add_form">
        <fieldset>
          <legend>Kişi Bilgileri</legend>
            <input type="text" id="name" name="name" placeholder="Name">
            <input type="text" id="surname" name="surname" placeholder="Surname">
            <input type="text" id="password" name="password" placeholder="Şifre">
            <input type="text" id="profession" name="meslek" placeholder="Meslek"><br>
            <label for="date_of_birth">Doğum Tarihi:</label>
            <input type="date" id="date_of_birth" name="date_of_birth" placeholder="Doğum Tarihi">
            <select id="gender" name="cinsiyet" placeholder="Choose a gender:">
                <option value="erkek">erkek</option>
                <option value="kadın">kadın</option>
            </select>
          </fieldset><br>
          <fieldset>
            <legend>İletişim Bilgileri</legend>
            <input type="text" id="city" name="city" placeholder="Şehir">
            <input type="text" id="eposta" name="eposta" placeholder="E-posta">
            <input type="text" id="phone" name="telefon" placeholder="Telefon"><br>
            <textarea name="adres" id="adress" cols="40" rows="8" placeholder="Adres bilgilerini giriniz..."></textarea>
          </fieldset>
      </form><button id="add_button">Kaydet</button>`;
    var add_button = document.getElementById("add_button");
    add_button.onclick = async function () {
      var form = document.getElementById("form");
      var data = new FormData(form);
      var tmp = Object.fromEntries(data.entries());
      var form_data = JSON.stringify(tmp);
      await axios.post("http://localhost:8080/add",
        {
          Data: JSON.parse(form_data)
        },
        {
          headers: { Authorization: globalThis._token }
        })
        .then((res) => {
          if (res.data[0].name && res.data[0].surname) {
            alert(res.data[0].name + " " + res.data[0].surname + " Eklendi."); // * OKEY
            document.querySelector(".crud_info").innerHTML = "";
          }
          else {
            alert("Enter name and surname information");
          }
        })
    }
  } catch (err) {
    console.log(err);
  }
}
async function del() {
  try {
    document.querySelector(".crud_info").innerHTML = "";
    document.querySelector(".crud").innerHTML = `<input type="text" id="search_name" placeholder="Search name to be deleted" required><br><button id="search_btn">Ara</button>`;
    var delete_search_btn = document.querySelector("#search_btn");
    delete_search_btn.onclick = async function () {
      var getName = document.querySelector("#search_name");
      await axios.get("http://localhost:8080/search",
        {
          headers: { Authorization: globalThis._token, Name: getName.value }
        })
        .then((res) => {
          if (res.data.responseCode == "CRM6") {
            alert(res.data.message);
            document.querySelector(".crud_info").innerHTML = "";
            getName.value = "";
          }
          else if (res.data.responseCode == "CRM7") {
            alert(res.data.message);
            document.querySelector(".crud_info").innerHTML = "";
            getName.value = "";
          }
          else {
            var data = res.data;
            var info = document.querySelector(".crud_info");
            info.innerHTML = `<form action="">
            <fieldset>
                <legend>Kişi Bilgileri</legend>
                <input type="text" id="name" name="name" placeholder="Name" value="${data.name}">
                <input type="text" id="surname" name="surname" placeholder="Surname" value="${data.surname}">
                <input type="text" id="meslek" name="profession" placeholder="Meslek" value="${data.meslek}"><br>
                <label for="date_of_birth">Doğum Tarihi:</label>
                <input type="date" id="date_of_birth" name="date_of_birth" placeholder="Doğum Tarihi" value="${data.date_of_birth}">
                <select id="gender" name="cinsiyet" placeholder="Choose a gender:" value="${data.cinsiyet}">
                  <option value="erkek">erkek</option>
                  <option value="kadın">kadın</option>
                </select>
            </fieldset><br>
            <fieldset>
                <legend>İletişim Bilgileri</legend>
                <input type="text" id="city" name="city" placeholder="Şehir" value="${data.city}">
                <input type="text" id="eposta" name="eposta" placeholder="E-posta" value="${data.eposta}">
                <input type="text" id="telefon" name="phone" placeholder="Telefon" value="${data.telefon}"><br>
                <textarea name="adres" id="adress" cols="40" rows="8" placeholder="Adres bilgilerini giriniz..." value="">${data.adres}</textarea>
            </fieldset>
            </form><button id="delete_btn">Sil</button>`;
            delete_btn.onclick = async function () {
              await axios.delete("http://localhost:8080/delete/" + getName.value.toString(),
                {
                  headers: { Authorization: globalThis._token }
                })
                .then((res) => {
                  alert(res.data);
                  document.querySelector(".crud_info").innerHTML = "";
                  getName.value = "";
                });
            }
          }
        });
    }
  } catch (err) {
    console.log(err);
  };
}
async function update() {
  try {
    document.querySelector(".crud_info").innerHTML = "";
    document.querySelector(".crud").innerHTML = `<input type="text" id="update_name" placeholder="Update Person Name" required><br><button id="update_search_button">Getir</button>`;
    var update_search_btn = document.querySelector("#update_search_button");
    update_search_btn.onclick = async function () {
      var getName = document.querySelector("#update_name");
      await axios.get("http://localhost:8080/search",
        {
          headers: { Authorization: globalThis._token, Name: getName.value }
        })
        .then((res) => {
          if (res.data.responseCode == "CRM6") {
            alert(res.data.message);
            document.querySelector(".crud_info").innerHTML = "";
            getName.value = "";
          }
          else if (res.data.responseCode == "CRM7") {
            alert(res.data.message);
            document.querySelector(".crud_info").innerHTML = "";
            getName.value = "";
          }
          else {
            var data = res.data;
            var info = document.querySelector(".crud_info");
            info.innerHTML = `<form action="" id="form">
            <fieldset>
              <legend>Kişi Bilgileri</legend>
              <input type="text" id="name" name="name" placeholder="Name" value="${data.name}">
              <input type="text" id="surname" name="surname" placeholder="Surname" value="${data.surname}">
              <input type="text" id="profession" name="meslek" placeholder="Meslek" value="${data.meslek}"><br>
              <label for="date_of_birth">Doğum Tarihi:</label>
              <input type="date" id="date_of_birth" name="date_of_birth" placeholder="Doğum Tarihi" value="${data.date_of_birth}">
              <select id="gender" name="cinsiyet" placeholder="Choose a gender:" value="${data.cinsiyet}">
                  <option value="erkek">erkek</option>
                  <option value="kadın">kadın</option>
              </select>
            </fieldset><br>
            <fieldset>
              <legend>İletişim Bilgileri</legend>
              <input type="text" id="city" name="city" placeholder="Şehir" value="${data.city}">
              <input type="text" id="eposta" name="eposta" placeholder="E-posta" value="${data.eposta}">
              <input type="text" id="phone" name="telefon" placeholder="Telefon" value="${data.telefon}"><br>
              <textarea name="adres" id="adress" cols="40" rows="8" placeholder="Adres bilgilerini giriniz..." value="">${data.adres}</textarea>
            </fieldset>
          </form><button id="update_btn">Güncelle</button>`;
            var update_button = document.querySelector("#update_btn");
            update_button.onclick = async function () {
              var form = document.getElementById("form");
              var data = new FormData(form);
              var tmp = Object.fromEntries(data.entries());
              var form_data = JSON.stringify(tmp);
              await axios.put("http://localhost:8080/update/" + res.data._id,
                {
                  Data: form_data
                },
                {
                  headers: { Authorization: globalThis._token }
                })
                .then((res) => {
                  // console.log("res data :"+res);
                  // if(res.data.ok){
                  //   alert(res.data[0].name + " " + res.data[0].surname + " Eklendi.");
                  // }
                  var a = JSON.parse(res.config.data);
                  var b = JSON.parse(a.Data);
                  if (!b.name && !b.surname) {
                    alert("Name and surname can not be empty!");
                  } else {
                    alert(b.name + " " + b.surname + " updated");
                    document.querySelector(".crud_info").innerHTML = "";
                    getName.value = "";
                  }
                })
            }
          }
        });
    }
  } catch (err) {
    console.log(err);
  };
}
