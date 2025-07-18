const dogForm = document.querySelector("#dog-form");
const tableBody = document.querySelector("#table-body");

let currentDogId = null;

// Fetch and display all dogs
function fetchDogs() {
  fetch("http://localhost:3000/dogs")
    .then((res) => res.json())
    .then((dogs) => {
      tableBody.innerHTML = "";
      dogs.forEach((dog) => renderDogRow(dog));
    });
}

// Render single dog row
function renderDogRow(dog) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${dog.name}</td>
    <td>${dog.breed}</td>
    <td>${dog.sex}</td>
    <td><button class="btn btn-sm btn-primary edit-btn" data-id="${dog.id}">Edit</button></td>
  `;

  tableBody.appendChild(tr);
}

// When "Edit" button is clicked
tableBody.addEventListener("click", function (e) {
  if (e.target.classList.contains("edit-btn")) {
    const id = e.target.dataset.id;

    fetch(`http://localhost:3000/dogs/${id}`)
      .then((res) => res.json())
      .then((dog) => {
        dogForm.name.value = dog.name;
        dogForm.breed.value = dog.breed;
        dogForm.sex.value = dog.sex;
        currentDogId = dog.id;
      });
  }
});

// When form is submitted
dogForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!currentDogId) return;

  const updatedDog = {
    name: dogForm.name.value,
    breed: dogForm.breed.value,
    sex: dogForm.sex.value,
  };

  fetch(`http://localhost:3000/dogs/${currentDogId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedDog),
  })
    .then((res) => res.json())
    .then(() => {
      currentDogId = null;
      dogForm.reset();
      fetchDogs(); // refresh list
    });
});

// Load dogs on page load
fetchDogs();
