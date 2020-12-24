document.addEventListener("DOMContentLoaded", function () {
    let side_nav = M.Sidenav.init(document.querySelectorAll(".sidenav"), {edge: "left",draggable: true,});
    let dropdown = M.Dropdown.init(document.querySelectorAll(".dropdown-trigger"),{ hover: true });
    let profile_modal = M.Modal.init(document.querySelectorAll(".modal"));
    var tap = M.TapTarget.init(document.querySelectorAll('.tap-target'));
    let t = M.Tooltip.init(document.querySelectorAll(".tooltipped"));
    let edit_button = M.FloatingActionButton.init(document.querySelectorAll('.fixed-action-btn'), {direction:"right"});
    let parallax = M.Parallax.init(document.querySelectorAll(".parallax"));
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