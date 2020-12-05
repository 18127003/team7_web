document.addEventListener("DOMContentLoaded", function () {
  let side_nav = M.Sidenav.init(document.querySelectorAll(".sidenav"), {
    edge: "left",
    draggable: true,
  });
  let dropdown = M.Dropdown.init(
    document.querySelectorAll(".dropdown-trigger"),
    { hover: true }
  );
  let profile_modal = M.Modal.init(document.querySelectorAll(".modal"));
  let carousel = M.Carousel.init(document.querySelectorAll(".carousel"), {indicators: true,fullWidth: true,});
  let edit_button = M.FloatingActionButton.init(document.querySelectorAll('.fixed-action-btn'), {direction:"left"});
});
