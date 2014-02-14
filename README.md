## TouchAndGo

simple directory watcher(fs.watch wrapper)

### Usage

    $npm install touch-and-go

then

```js
var Watcher = require('touch-and-go').Watcher;
var watcher = new Watcher('/path/to/somewhere',function(o){return /\.txt$/.test(o)});
// or
// var w = require('touch-and-go').watcher;
// var watcher = w('/path/to/somewhere',function(o){return /\.txt$/.test(o)});

// added or changed
watcher.on('changed',function(filepath){
  console.log('abs path: '+filepath);
});

// removed
watcher.on('removed',function(filepath){
  // do something
});

// start observing
watcher.start();

// stop observing
watcher.stop();
```

