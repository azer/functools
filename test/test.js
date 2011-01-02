var functools = require("../lib/functools"),
    assert = require("assert"),
    print = require("sys").print;

var tests = {};

tests.compose = function(){

  var unaltered = Math.floor(Math.random()*100);

  var increment = function(serial){
    return function(val){
      return val+serial;
    }
  }
  
  assert.equal(functools.compose( increment(1), increment(2), increment(3) )(unaltered),unaltered+6);
};

tests.each = function(){
  var range = [3,1,4,1,5,9],
      serial = 0;
  assert.equal(functools.each(function(el,ind,seq){
    assert.equal(seq,range);
    assert.equal(ind,serial++);
    assert.ok(ind<seq.length);
  },range),range);
  
}

tests.filter = function(){
  var range = [3,1,4,1,5,9],
      rangeClone = Array.prototype.slice.call(range),
      serial = 0;

  var evensInRange = functools.filter(function(el,ind,seq){
    
    assert.equal(range.length, rangeClone.length);
    for(var i = -1, len=rangeClone.length; ++i < len; ){
      assert.equal(rangeClone[i],range[i]);
    };

    assert.equal(serial++,ind);
    assert.equal(range[ind], el);
    assert.equal(seq[ind],el);

    return el%2==0; 
  },range);
  
  assert.equal(evensInRange.length, 1);
  assert.equal(evensInRange[0], 4);
};

tests.curry = function(){
  function sum(a,b,c){
    return a+b+c;
  }
 
  assert.equal( functools.curry(sum)()(3)()(1)(4),8);
  assert.equal( functools.curry(sum,3,1,4),8);
  assert.equal( functools.curry(sum,3)(1,4),8);
   
}

tests.map = function(){

  var range = [3,1,4],
      serial = 0;
  
  var seq = functools.map(function(el,ind,seq){

    assert.equal(range.length,seq.length);
    for(var i = ind-1, len=range.length; ++i < len; ){
      assert.equal(range[i],seq[i]);
    };

    assert.equal(serial++,ind);
    assert.equal(el,seq[ind]);
    
    return el*el;
  },range);

  assert.equal(range[0], 3);
  assert.equal(range[1], 1);
  assert.equal(range[2], 4);

  assert.equal(seq[0], 9);
  assert.equal(seq[1], 1);
  assert.equal(seq[2], 16);
};

tests.partial = function(){
  var sum = function(){
    return functools.reduce(function(x,y){ return x+y },arguments);
  }
  
  assert.equal(functools.partial(sum,[3,1,4,0])(),8);
  assert.equal(functools.partial(sum)(3,1,4,0),8);
  assert.equal(functools.partial(sum,[3,1])(4,1),9);

  var foo = {};

  functools.partial(function(){
    assert.equal(this, foo);
  },[],foo)();

};

tests.reduce = function(){
  var range = [3,1,4,1,5,9];
  assert.equal(functools.reduce(function(x,y,ind,seq){ 
    assert.equal(seq,range);
    assert.equal(y,seq[ind]);

    return x*y;
  },range),540);

  assert.equal(functools.reduce(function(x,y,ind,seq){
    return x*y;
  },range,2),1080);
};

var execCounter = 0;
console.log("Running tests...");
for(var testName in tests){
  print("  ["+(++execCounter)+"] Test: '"+testName+"'");
  tests[testName]();
  print(" OK\n");
};
