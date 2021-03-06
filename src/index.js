let addToy = false;
const addBtn = document.querySelector("#new-toy-btn");
const toyForm = document.querySelector(".container");
const toyCollection = document.querySelector('#toy-collection')

document.addEventListener("DOMContentLoaded", () => {
  retrieveToys();
  addNewToy();
  incrementLikes();
 
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyForm.style.display = "block";
    } else {
      toyForm.style.display = "none";
    }
  });
});

function retrieveToys(){
  return fetch('http://localhost:3000/toys')
  .then(response => response.json())
  .then(toys => {
    let toysHTML = toys.map(function(toy){
      return ` 
      <div class="card">
      <h2>${toy.name}</h2>
      <img src=${toy.image} class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button data-id="${toy.id}" class="like-btn">Like</button>
      <button data-id="${toy.id}" class="delete-btn">Back to the toy chest</button>
    </div>
    `
    })
    toyCollection.innerHTML += toysHTML
  })
}

function addNewToy(){
  toyForm.addEventListener("submit", function(e){
    e.preventDefault()
    const toyName = e.target.name.value 
    const  toyImage = e.target.image.value 

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: toyName,
        image: toyImage,
        likes: 99
      })
    })
    .then(r => r.json())
    .then(newToy => {

      let newToyHTML = `
      <div class="card">
      <h2>${newToy.name}</h2>
      <img src=${newToy.image} class="toy-avatar" />
      <p>${newToy.likes} Likes</p>
      <button data-id="${newToy.id}" class="like-btn">Like <3</button>
      <button data-id="${newToy.id}" class="delete-btn">Back to the toy chest</button>
    </div>
      `

      toyCollection.innerHTML += newToyHTML 
      e.target.reset()
    })
  })
}

function incrementLikes(){
  toyCollection.addEventListener("click", (e) => {
    if (e.target.className === "like-btn") {
      let currentLikes = parseInt(e.target.previousElementSibling.innerText)
      let newLikes = currentLikes + 1 
      e.target.previousElementSibling.innerText = newLikes + " likes"

      fetch(`http://localhost:3000/toys/${e.target.dataset.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          likes: newLikes 
        })
      })
    }
     if (e.target.className === "delete-btn") {
      fetch(`http://localhost:3000/toys/${e.target.dataset.id}`, {
        method: "DELETE"
    })
    .then(r => {
      e.target.parentElement.remove()
      })
     }
  })
}