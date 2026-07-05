/* ===========================
   Newnan Family Chiropractic
   Main JavaScript
=========================== */

// Mobile Navigation
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show");
    menuToggle.classList.toggle("active");
  });
}

// Close menu when clicking a link
document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    if (navMenu) navMenu.classList.remove("show");
    if (menuToggle) menuToggle.classList.remove("active");
  });
});

// Sticky Header Shadow
const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {

  if(window.scrollY > 30){

      header.classList.add("scrolled");

  }else{

      header.classList.remove("scrolled");

  }

});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll(
".section,.feature-card,.condition-card,.review-card,.appointment-card,.steps-grid article,.contact-card,.map-card");

const observer = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("visible");

}

});

},{
threshold:.15
});

revealElements.forEach(el=>observer.observe(el));

// Smooth Anchor Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

anchor.addEventListener("click",function(e){

e.preventDefault();

const target=document.querySelector(this.getAttribute("href"));

if(target){

target.scrollIntoView({

behavior:"smooth"

});

}

});

});

// FAQ Animation
document.querySelectorAll("details").forEach(detail=>{

detail.addEventListener("toggle",()=>{

if(detail.open){

document.querySelectorAll("details").forEach(other=>{

if(other!==detail){

other.removeAttribute("open");

}

});

}

});

});

// Button Ripple Effect
document.querySelectorAll(".btn").forEach(button=>{

button.addEventListener("click",function(e){

const circle=document.createElement("span");

const diameter=Math.max(this.clientWidth,this.clientHeight);

const radius=diameter/2;

circle.style.width=circle.style.height=`${diameter}px`;

circle.style.left=`${e.clientX-this.getBoundingClientRect().left-radius}px`;

circle.style.top=`${e.clientY-this.getBoundingClientRect().top-radius}px`;

circle.classList.add("ripple");

const ripple=this.getElementsByClassName("ripple")[0];

if(ripple){

ripple.remove();

}

this.appendChild(circle);

});

});
