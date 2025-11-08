class State{
  constructor(){this.history=[];this.redoList=[];}
  add(op){this.history.push(op);this.redoList=[];}
  undo(){if(this.history.length===0)return;this.redoList.push(this.history.pop());}
  redo(){if(this.redoList.length===0)return;this.history.push(this.redoList.pop());}
  log(){return this.history.slice();}
}
module.exports={State};
