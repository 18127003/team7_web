
document.addEventListener("DOMContentLoaded", function () {
  let side_nav = M.Sidenav.init(document.querySelectorAll(".sidenav"), {
    edge: "left",
    draggable: true,
  });
  let dropdown = M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), {hover:true});
  let profile_modal = M.Modal.init(document.querySelectorAll('.modal'));
  let chips = M.Chips.init(document.querySelectorAll(".chips-placeholder"), {
    placeholder: "Enter a tag",
    secondaryPlaceholder: "+Tag",
  });
  let t = M.Tooltip.init(document.querySelectorAll(".tooltipped"));
});
document.getElementById("postsubmit").addEventListener("click",function (){
  chipsInstance = M.Chips.getInstance(document.querySelector(".chips-placeholder"));
  sub = document.getElementById("posttag");
  var element1 = document.createElement("input");         
  element1.name="hashtag";
  element1.value = JSON.stringify(chipsInstance.chipsData);
  element1.type = 'hidden';
  sub.appendChild(element1);
  sub.submit();
})