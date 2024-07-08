const inputBox = document.getElementById("input-box"); 
const listContainer = document.getElementById("list-container"); 
const navigation = document.querySelector(".navigation div");

listContainer.innerHTML = `<div>loading..</div>`

function updateNavigation() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        navigation.innerHTML = `
            <a href="/frontend/index.html">Home</a>
            <a href="#" id="logout">Logout</a>
        `;
        document.getElementById('logout').addEventListener('click', handleLogout);
    } else {
        navigation.innerHTML = `
            <a href="/frontend/index.html">Home</a>
            <a href="./register.html">Register</a>
            <a href="./login.html">Login</a>
        `;
    }
}

function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/frontend/index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();
    fetchTodos().then((response) => {
        listContainer.innerHTML = "";
        const todos = response.result;
        for (let index = 0; index < todos.length; index++) {
            const todo = todos[index];
            let li = document.createElement("li");
            li.id = todo._id;
            if (todo.done === true) {
                li.classList.add("checked");
            }
            li.innerHTML = todo.title;
            listContainer.appendChild(li);
            let span = document.createElement("span");
            span.innerHTML = "\u00d7"; // cross icon, span elementinin içeriğini çarpı iconu ile doldurur
            li.appendChild(span);
             // oluşturulan span elementini, li elementine ekler. Böylece kullanıcı görevi silebilir.
        }
    });
});

async function fetchTodos() {
    try {
        const response = await fetch("http://localhost:3000/todos");
        const json = await response.json();
        return json;
    } catch (error) {
        console.log('Error when fetch todos', error);
        return null;
    }
}

async function addTask(){ 
    if(inputBox.value === ''){ //Eğer task eklemek istediğimiz ifade için input kısmı boş ise uyarı göster
        alert("You must write something!");
    } else {
        let li = document.createElement("li"); /*Eğer input girmişsek document'in içine li elementi olustur ve 
        bunu li değiskeninde tut*/
        li.innerHTML = inputBox.value; // li içine girdiğimiz input-box'da ki value(değeri) ile doldurur
        listContainer.appendChild(li); // listemiz listcontainer içerisinde görüntülenir ve lsiteleriz
        let span = document.createElement("span");
        span.innerHTML = "\u00d7"; // cross icon, span elementinin içeriğini çarpı iconu ile doldurur
        li.appendChild(span); // oluşturulan span elementini, li elementine ekler. Böylece kullanıcı görevi silebilir.
        await fetch("http://localhost:3000/todos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: inputBox.value,
                done: false,
            }),
            credentials: 'include'
        }).then(async (response) => {
            const json = await response.json();
            if (response.status === 201 || response.status === 200) {
                console.log('Todo added successfully');
            } else {
                throw new Error(json.message);
            }
        }).catch((error) => {
            console.log('Error when fetch todos', error);
            alert(error.message);
        });
    }
    inputBox.value = ""; // add işleminden sonra kutunun içinin boş olmasını isteriz
    // saveData();
}

listContainer.addEventListener("click", async function(e){
    if(e.target.tagName ==="LI"){
       e.target.classList.toggle("checked");
         await fetch(`http://localhost:3000/todos/${e.target.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                done: e.target.classList.contains("checked"),
              }),
              credentials: 'include'
         }).then(async (response) => {
              const json = await response.json();
              if (response.status === 200) {
                console.log('Todo updated successfully');
              } else {
                throw new Error(json.message);
              }
         })
    }
    else if(e.target.tagName ==="SPAN"){
        e.target.parentElement.remove();
        await fetch(`http://localhost:3000/todos/${e.target.parentElement.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include'
        }).then(async (response) => {
            const json = await response.json();
            if (response.status === 200) {
                console.log('Todo deleted successfully');
            } else {
                throw new Error(json.message);
            }
        })
    }
}, false);

function saveData(){
    localStorage.setItem("data",listContainer.innerHTML);
}

function showTask(){
    listContainer.innerHTML = localStorage.getItem("data");
}
// showTask();
