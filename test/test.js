var fs = require('fs'),
    EventEmitter = require('events').EventEmitter;
var should = require('should');

var W = require(__dirname+'/../');
var Watcher = W.Watcher;
var watcher_fn = W.watcher;
describe('watcher test', function(){
  var tmp = __dirname+'/tmp',
      testfile = tmp+'/test.txt';
  var tmpdir,
      watcher,
      data;

  before(function(done){
    tmpdir = fs.mkdir(tmp,function(){
      watcher = new Watcher(tmp,function(o){return /\.txt$/.test(o)});
      watcher.on('changed',function(o){
        console.log('changed: '+o);
      });
      watcher.on('removed',function(o){
        console.log('removed: '+o);
      });
      done();
    });
  });

  beforeEach(function(done){
    watcher.start();
    done();
  });

  afterEach(function(done){
    watcher.stop();
    done();
  });
  
  after(function(done){
    fs.rmdir(tmp,function(){
      done();
    });
  });

  it('watcher constructor should be Watcher and have some properties',function(done){
    watcher.should.instanceof(Watcher);
    watcher.should.have.properties('path','filter','event_emitter');
    done();
  });

  it('watch function value should be Watcher and have some properties',function(done){
    var w = watcher_fn(tmp,function(o){return /\.txt$/.test(o)});
    w.should.instanceof(Watcher);
    w.should.have.properties('path','filter','event_emitter');
    done();
  });

  it('watcher should have changed and removed eventlistener',function(done){
    EventEmitter.listenerCount(watcher.event_emitter,'changed').should.eql(1);
    EventEmitter.listenerCount(watcher.event_emitter,'removed').should.eql(1);
    done();
  });
  
  it('watcher should have only one eventlistener',function(done){
    watcher.on('changed',function(path){
      console.log(path);
    });
    EventEmitter.listenerCount(watcher.event_emitter,'changed').should.eql(1);
    done();
  });
  
  it('watcher changed event fired',function(done){
    watcher.on('changed',function(path){
      path.should.eql(testfile);
      done();
    });
    fs.writeFileSync(testfile,'this is test');
  });

  it('watcher removed event fired',function(done){
    watcher.on('changed',function(path){
      path.should.eql(testfile);
    });
    fs.unlink(testfile,function(){
      done();
    });
  });
  
});
