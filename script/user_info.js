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
document.getElementById("update_btn").addEventListener("click", async function(event){
  event.preventDefault();
  let post_id = document.getElementById("post-id").dataset.id;
  let new_title = document.getElementById("post-title").value;
  let new_description = document.getElementById("post-description").value;
  await fetch(`/users/postUpdate?id=${post_id}`,{
    method:"POST",
    headers:{
      "Accept":"application/x-www-form-urlencoded",
      "Content-Type":"application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      title: new_title,
      description: new_description}) 
  })
  await location.reload();
  M.toast({html: 'Post updated', classes: 'rounded', displayLength: 2000});
})
document.getElementById("info_update_btn").addEventListener("click", async function(event){
  event.preventDefault();
  let user_id = document.getElementById("user-id").dataset.id;
  let new_name = document.getElementById("user_name").value;
  let new_email = document.getElementById("user_mail").value;
  let new_bio = document.getElementById("user_bio").value;
  await fetch(`/users/updateUser?id=${user_id}`,{
    method:"POST",
    headers:{
      "Accept":"application/x-www-form-urlencoded",
      "Content-Type":"application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      name: new_name,
      email: new_email,
      bio: new_bio}) 
  })
  await location.reload();
  M.toast({html: 'Information updated', classes: 'rounded', displayLength: 2000});
})
document.getElementById("avatar_btn").addEventListener("click", async function(event){
  event.preventDefault();
  let user_id = document.getElementById("user-id").dataset.id;
  let data = new FormData();
  data.append("user_id", user_id);
  data.append("avatar", document.getElementById("avatar_input").files[0]);
  await fetch("/users/avatarUpdate",{
    method:"POST",
    body: data
  })
  await location.reload();
  M.toast({html: 'Avatar updated', classes: 'rounded', displayLength: 2000});
})
