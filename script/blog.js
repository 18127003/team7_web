

document.addEventListener("DOMContentLoaded", function () {
  let side_nav = M.Sidenav.init(document.querySelectorAll(".sidenav"), {edge: "left",draggable: true,});
  let dropdown = M.Dropdown.init(document.querySelectorAll(".dropdown-trigger"),{ hover: true });
  let profile_modal = M.Modal.init(document.querySelectorAll(".modal"));
  let carousel = M.Carousel.init(document.querySelectorAll(".carousel"), {indicators: true,fullWidth: true,});
  // let chips = M.Chips.init(document.querySelectorAll(".chips"), {
  //   data: hashtag,
  // });
});

mybutton = document.querySelector(".topbtn");

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
