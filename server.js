const express=require("express");
const http=require("http");
const path=require("path");
const{Server}=require("socket.io");
const{Room}=require("./rooms");
const{State}=require("./drawing-state");

const app=express();
const server=http.createServer(app);
const io=new Server(server);
app.use(express.static(path.join(__dirname,"..","client")));
const port=3000;
server.listen(port,()=>console.log("Running on",port));

const room=new Room();
const state=new State();

io.on("connection",s=>{
  const user={id:s.id};
  s.join("main");
  room.add("main",user);
  s.emit("init",{id:s.id});
  io.to("main").emit("users",{count:room.count("main")});

  s.on("join",()=>{});
  s.on("get_state",()=>s.emit("state",{log:state.log()}));
  s.on("action",a=>{
    a.uid=s.id;a.time=Date.now();
    if(a.type==="undo"){state.undo();io.to("main").emit("action",{type:"undo",uid:s.id});io.to("main").emit("state",{log:state.log()});return;}
    if(a.type==="redo"){state.redo();io.to("main").emit("action",{type:"redo",uid:s.id});io.to("main").emit("state",{log:state.log()});return;}
    if(a.type==="cursor"){io.to("main").emit("action",{...a,uid:s.id});return;}
    state.add(a);
    io.to("main").emit("action",a);
  });
  s.on("disconnect",()=>{room.remove("main",s.id);io.to("main").emit("users",{count:room.count("main")});io.to("main").emit("left",s.id);});
});
