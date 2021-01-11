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
  let edit_button = M.FloatingActionButton.init(document.querySelectorAll('.fixed-action-btn'), {direction:"left",hoverEnabled: false});
  let tooltip = M.Tooltip.init(document.querySelectorAll(".tooltipped"));
  let collap = M.Collapsible.init(document.querySelector(".collapsible"));
});
document.getElementById("assign_admin").addEventListener("click",async function (event){
  event.preventDefault();
  list=[]
  // console.log(document.querySelector(".user_container").childNodes)
  document.querySelector(".user_container").childNodes.forEach(node=>{
    if(node.firstElementChild.firstElementChild.checked==true){
      console.log(node.firstElementChild.lastElementChild.innerText)
      list.push(node.firstElementChild.lastElementChild.innerText)
    }
  })
  await fetch("/users/assign",{
    method:"POST",
    headers:{
      "Accept":"application/x-www-form-urlencoded",
      "Content-Type":"application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      alist:JSON.stringify(list)}) 
  })
  location.reload()
  M.toast({html: 'Assigned successfully', classes: 'rounded', displayLength: 2000});
})
async function deletepost(id){
  await fetch(`/users/deletePost?id=${id}`)

  location.reload()
  M.toast({html: 'Article deleted', classes: 'rounded', displayLength: 2000});

}
async function deletearticle(id){
  await fetch(`/users/deleteArticle?id=${id}`)
  location.reload()
  M.toast({html: 'Article deleted', classes: 'rounded', displayLength: 2000});
 
  
}

