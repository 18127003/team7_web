
const search_data={
  "Banh Chung": null,
  "Banh Day": null,
  "Cha Gio": null,
  "Banh Mi": null,
  "Cha Ca": null
}
// const search_data = posts;

document.addEventListener("DOMContentLoaded", function () {
  let side_nav = M.Sidenav.init(document.querySelectorAll(".sidenav"), {
    edge: "left",
    draggable: true,
  });
  let carouself = M.Carousel.init(document.querySelectorAll('.carousel.food'), {indicators:true, duration:500});
  let carouselp = M.Carousel.init(document.querySelectorAll('.carousel.carousel-slider'), {indicators:true, duration:1000, fullWidth:true});
  let dropdown = M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), {hover:true});
  let profile_modal = M.Modal.init(document.querySelectorAll('.modal'));
  let el = document.getElementById("login_modal");
  if(el){
    let login_modal = M.Modal.getInstance(el);
    login_modal.open();
  }
  let search_modal = M.Autocomplete.init(document.querySelectorAll('.autocomplete'), {limit:3, data: search_data});
  var tap = M.TapTarget.init(document.querySelectorAll('.tap-target'));
  let t = M.Tooltip.init(document.querySelectorAll(".tooltipped"));
  let tabs = M.Tabs.init(document.querySelector(".tabs"));
});
document.getElementById("hint").addEventListener("click", function (){
  let tap = M.TapTarget.getInstance(document.querySelector('.tap-target'));
  if(tap.isOpen==true){
    tap.close();
  }
  else{
    tap.open();
  }
})
