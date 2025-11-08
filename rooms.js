class Room{
  constructor(){this.rooms=new Map();}
  add(r,u){if(!this.rooms.has(r))this.rooms.set(r,new Map());this.rooms.get(r).set(u.id,u);}
  remove(r,id){if(!this.rooms.has(r))return;this.rooms.get(r).delete(id);}
  count(r){return this.rooms.has(r)?this.rooms.get(r).size:0;}
}
module.exports={Room};
