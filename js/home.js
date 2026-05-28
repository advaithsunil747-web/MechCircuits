function toggleContact(event){
  event.preventDefault();

  let box = document.getElementById("contactBox");

  if (box.style.display === "block") {
    box.style.display = "none";
  } else {
    box.style.display = "block";
  }
}

function toggleFeedback(event){
  event.preventDefault();

  let box = document.getElementById("feedbackBox");

  if (box.style.display === "block") {
    box.style.display = "none";
  } else {
    box.style.display = "block";
  }
}

function toggleMenu(){
  document.getElementById("nav-links").classList.toggle("show");
}
