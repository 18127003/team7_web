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
    let collap = M.Collapsible.init(document.querySelector(".collapsible"));
});
var i = 2;
document.getElementById("articlesubmit").addEventListener("click",function (){
  chipsInstance = M.Chips.getInstance(document.querySelector(".chips-placeholder"));
  sub = document.getElementById("articletag");
  var element1 = document.createElement("input");         
  element1.name="hashtag";
  element1.value = JSON.stringify(chipsInstance.chipsData);
  element1.type = 'hidden';
  sub.appendChild(element1);
  sub.submit();
})
document.getElementById("adder").addEventListener("click", function(){
  let add = document.getElementById("adder");
  add.insertAdjacentHTML("beforebegin",
   `<div class="row input-field">
      <textarea id="textarea${i}" class="materialize-textarea" name="content"></textarea>
      <label for="textarea2${i}">Nội dung</label>
    </div>
    <div class="row file-field input-field upload-field">
      <div class="btn pink lighten-4">
        <img src="https://img.icons8.com/officel/40/000000/add-image.png" />
        <input type="file" name="image">
      </div>
      <div class="file-path-wrapper">
        <input class="file-path validate" type="text" placeholder="Thêm hình">
      </div>
    </div>`);
  ++i;
})