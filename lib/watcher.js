var fs = require('fs'),
    path = require('path'),
    EventEmitter = require('events').EventEmitter;

function Watcher(fp,filter){
  var self = this;
  self.path = path.resolve(fp);
  self.filter = filter || function(filename){return true};
  self.event_emitter = new EventEmitter;

  return self
};

Watcher.prototype.on = function(eventname,cb){
  var self = this;
  if(EventEmitter.listenerCount(self.event_emitter,eventname)!==0){
    self.event_emitter.removeAllListeners(eventname);
  }
  self.event_emitter.on(eventname,cb);
  return self
};

Watcher.prototype.start = function(){
  var self = this;
  self.watcher = fs.watch(self.path, function(event,filename){
    if(self.filter(filename)){
      var apath = path.join(self.path,filename);
      // added or changed
      if(fs.existsSync(apath)){
        self.event_emitter.emit('changed',apath);
      }
      // removed
      else{
        self.event_emitter.emit('removed',apath);
      }
    }
  });
  
  return self
};

Watcher.prototype.stop = function(){
  var self = this;
  self.watcher.close();
  return self
};

module.exports = {
  Watcher: Watcher,
  watcher: function(path,filter){
    return new Watcher(path,filter)
  }
};
