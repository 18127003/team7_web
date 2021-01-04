

document.addEventListener("DOMContentLoaded", function () {
  let side_nav = M.Sidenav.init(document.querySelectorAll(".sidenav"), {edge: "left",draggable: true,});
  let dropdown = M.Dropdown.init(document.querySelectorAll(".dropdown-trigger"),{ hover: true });
  let profile_modal = M.Modal.init(document.querySelectorAll(".modal"));
  let carousel = M.Carousel.init(document.querySelectorAll(".carousel"), {indicators: true,fullWidth: true,});
  let t = M.Tooltip.init(document.querySelectorAll(".tooltipped"));
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

async function Likey(id){
  var element = document.getElementById(id)
  user_id = document.body.id
  if(element.classList.contains("liked")){
    const favres = await fetch("/users/unfavorite",{
      method:"Post",
      headers:{
        "Accept":"application/x-www-form-urlencoded",
        "Content-Type":"application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        user_id: user_id,
        content_id: id.slice(4)
      })
    })
    element.setAttribute("src","https://img.icons8.com/material-outlined/24/000000/like--v1.png");
    element.classList.remove("liked");
  } else{
    
    const favres = await fetch("/users/favorite",{
      method:"Post",
      headers:{
        "Accept":"application/x-www-form-urlencoded",
        "Content-Type":"application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        user_id: user_id,
        content_id: id.slice(4)
      })
    })
    // let stat = await favres.status()
    element.setAttribute("src","https://img.icons8.com/officexs/24/000000/hearts.png");
    element.classList.add("liked");
    
  }
}

(()=>{document.querySelectorAll(".showmore").forEach(function (p) {
  p.querySelector("a").addEventListener("click", function () {
    p.classList.toggle("show");
    this.textContent = p.classList.contains("show") ? "Rút gọn" : "Xem tiếp";
  });
})})();




  

