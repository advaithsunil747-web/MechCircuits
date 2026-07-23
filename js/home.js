/* ===========================
   CONTACT POPUP
=========================== */

function toggleContact(){

    const contact = document.getElementById("contactBox");
    const feedback = document.getElementById("feedbackBox");

    feedback.style.display = "none";

    if(contact.style.display === "block"){
        contact.style.display = "none";
    }
    else{
        contact.style.display = "block";
    }
}


/* ===========================
   FEEDBACK POPUP
=========================== */

function toggleFeedback(){

    const contact = document.getElementById("contactBox");
    const feedback = document.getElementById("feedbackBox");

    contact.style.display = "none";

    if(feedback.style.display === "block"){
        feedback.style.display = "none";
    }
    else{
        feedback.style.display = "block";
    }
}


/* ===========================
   CLOSE POPUPS WHEN CLICKING OUTSIDE
=========================== */

document.addEventListener("click", function(event){

    const contact = document.getElementById("contactBox");
    const feedback = document.getElementById("feedbackBox");

    if(
        !event.target.closest(".contact-menu") &&
        !event.target.closest(".feedback-menu")
    ){
        contact.style.display = "none";
        feedback.style.display = "none";
    }

});


/* ===========================
   HAMBURGER MENU
=========================== */

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {

    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");

});

function toggleMenu(){
  document.getElementById("nav-links").classList.toggle("show");
}
