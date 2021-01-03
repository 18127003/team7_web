


document.addEventListener("DOMContentLoaded", function () {
    let side_nav = M.Sidenav.init(document.querySelectorAll(".sidenav"), {edge: "left",draggable: true,});
    let dropdown = M.Dropdown.init(document.querySelectorAll(".dropdown-trigger"),{ hover: true });
    let profile_modal = M.Modal.init(document.querySelectorAll(".modal"));
    let t = M.Tooltip.init(document.querySelectorAll(".tooltipped"));
    
    // const Pusher = require("pusher");
    Pusher.logToConsole = true;
  
    pusher = new Pusher('788c3dc0beb98f22422c', {
      cluster: 'ap1',
      encrypted: true
    })
    channel = pusher.subscribe('flash-comments');

    var commentsList = document.getElementById('comments-list'),
    commentTemplate = document.getElementById('comment-template');

    channel.bind('new_comment',(data)=>{
      var newCommentHtml = commentTemplate.innerHTML.replace('{{name}}',data.name);
      newCommentHtml = newCommentHtml.replace('{{id}}',data.id);
      newCommentHtml = newCommentHtml.replace('{{comment}}',data.comment);
      var newCommentNode = document.createElement('div');
      newCommentNode.classList.add('comment');
      newCommentNode.innerHTML = newCommentHtml;
      commentsList.appendChild(newCommentNode);
    });
   
    document.getElementById("comment").addEventListener("click",async function(event){
      event.preventDefault();
      let name = document.getElementById("new_comment_name").value
      let id = document.getElementById("new_comment_id").value
      let text = document.getElementById("new_comment_text").value
      const comres = await fetch("/users/comment",{
        method:"POST",
        headers:{
          "Accept":"application/x-www-form-urlencoded",
          "Content-Type":"application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          new_comment_name:name, 
          new_comment_id:id, 
          new_comment_text:text})
      })
      const content = await comres.json();
    })
});

