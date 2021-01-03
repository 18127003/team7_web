const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1131628",
  key: "788c3dc0beb98f22422c",
  secret: "319643e0b229cfe4f526",
  cluster: "ap1",
  useTLS: true
});

// pusher.trigger("my-channel", "my-event", {
//   message: "hello world"
// });
module.exports=pusher;