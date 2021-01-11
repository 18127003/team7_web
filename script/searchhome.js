document.addEventListener("DOMContentLoaded", function () {
    let side_nav = M.Sidenav.init(document.querySelectorAll(".sidenav"), {edge: "left",draggable: true,});
    let dropdown = M.Dropdown.init(document.querySelectorAll(".dropdown-trigger"),{ hover: true });
    let profile_modal = M.Modal.init(document.querySelectorAll(".modal"));
    let instance = M.Tabs.init(document.querySelector(".tabs"));
    let t = M.Tooltip.init(document.querySelectorAll(".tooltipped"));
    let collap = M.Collapsible.init(document.querySelector(".collapsible"));
  });
  