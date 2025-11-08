import{socket,connectRoom,pushAction,askState}from'./websocket.js';

const canvas=document.getElementById("board");
const usersEl=document.getElementById("users");
const colorEl=document.getElementById("color");
const sizeEl=document.getElementById("size");
const eraser=document.getElementById("eraser");
const undo=document.getElementById("undo");
const redo=document.getElementById("redo");
const cursorBox=document.getElementById("cursors");

let ctx,dpr;
let uid=null,tool="brush",isDrawing=false,last=null,buffer=[],ops=[],redoOps=[];
function gen(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8);}
function scale(){dpr=window.devicePixelRatio||1;canvas.width=canvas.clientWidth*dpr;canvas.height=canvas.clientHeight*dpr;ctx=canvas.getContext("2d");ctx.scale(dpr,dpr);render();}
window.addEventListener("resize",scale);scale();

function draw(p){ctx.lineJoin="round";ctx.lineCap="round";ctx.lineWidth=p.size;ctx.strokeStyle=p.color;ctx.globalCompositeOperation=p.tool==="eraser"?"destination-out":"source-over";ctx.beginPath();ctx.moveTo(p.points[0].x,p.points[0].y);for(let i=1;i<p.points.length;i++){const mX=(p.points[i-1].x+p.points[i].x)/2;const mY=(p.points[i-1].y+p.points[i].y)/2;ctx.quadraticCurveTo(p.points[i-1].x,p.points[i-1].y,mX,mY);}ctx.lineTo(p.points[p.points.length-1].x,p.points[p.points.length-1].y);ctx.stroke();}
function render(){ctx.clearRect(0,0,canvas.width/dpr,canvas.height/dpr);for(const op of ops)draw(op.payload);}
function pos(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}

canvas.addEventListener("pointerdown",e=>{if(e.button!==0)return;isDrawing=true;last=pos(e);buffer=[last];});
canvas.addEventListener("pointermove",e=>{
  const now=Date.now();const p=pos(e);
  pushAction({type:"cursor",payload:{x:p.x,y:p.y},id:gen()});
  if(!isDrawing)return;buffer.push(p);draw({points:buffer,color:tool==="eraser"?"#fff":colorEl.value,size:+sizeEl.value,tool});
});
canvas.addEventListener("pointerup",()=>{if(!isDrawing)return;isDrawing=false;
  pushAction({type:tool==="eraser"?"erase":"draw",payload:{id:gen(),points:buffer.slice(),color:tool==="eraser"?"#fff":colorEl.value,size:+sizeEl.value,tool}});
  ops.push({type:tool==="eraser"?"erase":"draw",payload:{points:buffer.slice(),color:tool==="eraser"?"#fff":colorEl.value,size:+sizeEl.value,tool}});
  buffer=[];
});
canvas.addEventListener("pointercancel",()=>isDrawing=false);

eraser.onclick=()=>{tool=tool==="brush"?"eraser":"brush";eraser.textContent=tool==="eraser"?"Brush":"Eraser";};
undo.onclick=()=>pushAction({type:"undo"});
redo.onclick=()=>pushAction({type:"redo"});

socket.on("connect",()=>{connectRoom();askState();});
socket.on("init",d=>uid=d.id);
socket.on("state",d=>{ops=d.log||[];render();});
socket.on("users",d=>usersEl.textContent=`Users online: ${d.count}`);
socket.on("action",a=>{
  if(a.type==="cursor"){markCursor(a.uid,a.payload);}
  else if(a.type==="undo"||a.type==="redo")askState();
  else{ops.push(a);render();}
});
function markCursor(id,p){if(id===uid)return;let el=document.getElementById(id);if(!el){el=document.createElement("div");el.className="cursor";el.id=id;cursorBox.appendChild(el);}el.style.left=p.x+"px";el.style.top=p.y+"px";}
socket.on("left",id=>{const e=document.getElementById(id);if(e)e.remove();});
