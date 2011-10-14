if(typeof require!='undefined'){
  var functools = require("../lib/functools"),
      assert = require("assert");
}

function test_compose(){

  var unaltered = Math.floor(Math.random()*100);

  var increment = function(serial){
    return function(val){
      return val+serial;
    }
  }
  
  assert.equal(functools.compose(increment(1), increment(2), increment(3) )(unaltered),unaltered+6);

  function cube(x){ return x*x*x };
  function sum(x){ return x+x; };
  function div(x){ return x/2; }
  function mul(x){return x*3; }
  assert.equal(functools.compose(cube, sum, div, mul)(2), 24);
};

function test_compose_async(){
  var unaltered = Math.floor(Math.random()*100);

  function increment(serial){
    return function(val,callback){
      callback(undefined, val+serial);
    }
  }

  functools.compose.async( increment(1), increment(2), increment(3) )(unaltered,function(error,result){
    if(error){
      throw error;
    }

    assert.equal(result, unaltered + 6);
  });

  function cube(x,callback){ callback(undefined,x*x*x) };
  function sum(x,callback){ callback(undefined,x+x); };
  function div(x,callback){ callback(undefined,x/2); }
  function mul(x,callback){ callback(undefined,x*3); }

  functools.compose.async(cube, sum, div, mul)(2,function(error, result){
    assert.equal(result, 24);
  });
}

function test_compose_async_error(){
  functools.compose.async(function(_,callback){
    callback(new Error('foobar'),9);
  },[3,1,4],function(error, result){
    assert.equal(error.message, 'foobar');
  });
}

function test_curry(){
  function sum(a,b,c){
    return a+b+c;
  }
 
  assert.equal( functools.curry(sum)()(3)()(1)(4),8);
  assert.equal( functools.curry(sum,3,1,4),8);
  assert.equal( functools.curry(sum,3)(1,4),8);
   
}

function test_each(){
  var range = [3,1,4,1,5,9],
      serial = 0;
  assert.equal(functools.each(function(el,ind,seq){
    assert.equal(seq,range);
    assert.equal(ind,serial++);
    assert.ok(ind<seq.length);
  },range),range);
  
}

function test_filter(){
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

function test_filter_async(){
  var range = [3,1,4,1,5,9],
      rangeClone = Array.prototype.slice.call(range),
      serial = 0;

  functools.filter.async(function(el,callback){
    callback(el%2==0); 
  },range, function(evensInRange){
    assert.equal(evensInRange.length, 1);
    assert.equal(evensInRange[0], 4);
  });
}

function test_juxt(){
  var unaltered = Math.floor(Math.random()*100);
  function inc(serial){ return function(val){ return val+serial; } }

  var result = functools.juxt(inc(1), inc(2), inc(3) )(unaltered);
  assert.equal(result[0], unaltered+1);
  assert.equal(result[1], unaltered+2);
  assert.equal(result[2], unaltered+3);

  function cube(x){ return x*x*x };
  function sum(x){ return x+x; };
  function div(x){ return x/2; }
  function mul(x){return x*3; }

  result = functools.juxt(cube, sum, div, mul)(2);
  assert.equal(result[0], 8);
  assert.equal(result[1], 4);
  assert.equal(result[2], 1);
  assert.equal(result[3], 6);
}

function test_juxt_async(){
  var unaltered = Math.floor(Math.random()*100);

  function inc(serial){ return function(val, callback){ callback(undefined, val+serial); } }

  functools.juxt.async( inc(1), inc(2), inc(3) )(unaltered,function(error,result){
    if(error){
      throw error;
    }

    assert.equal(result[0], unaltered+1);
    assert.equal(result[1], unaltered+2);
    assert.equal(result[2], unaltered+3);
  });

  function cube(x,callback){ callback(undefined,x*x*x) };
  function sum(x,callback){ callback(undefined,x+x); };
  function div(x,callback){ callback(undefined,x/2); }
  function mul(x,callback){ callback(undefined,x*3); }

  functools.juxt.async(cube, sum, div, mul)(2,function(error, result){
  assert.equal(result[0], 8);
  assert.equal(result[1], 4);
  assert.equal(result[2], 1);
  assert.equal(result[3], 6);
  });
}

function test_map(){

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

function test_map_async(){

  var range = [3,1,4];
  
  functools.map.async(function(el,callback){
    callback(undefined, el*el);
  },range,function(error, seq){

    if(error){
      throw error;
    }


    assert.equal(range[0], 3);
    assert.equal(range[1], 1);
    assert.equal(range[2], 4);

    assert.equal(seq[0], 9);
    assert.equal(seq[1], 1);
    assert.equal(seq[2], 16);
  });
};

function test_map_async_error(){
  functools.map.async(function(_,callback){
    callback(new Error('foobar'),9);
  },[3,1,4],function(error, list){
    assert.equal(list[0], 9);
    assert.equal(list[1], 1);
    assert.equal(list[2], 4);

    assert.equal(error.message, 'foobar');
  });
}


function test_partial(){
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

function test_reduce(){
  var range = [3,1,4,1,5,9];
  assert.equal(functools.reduce(function(x,y,seq){ 
    return x*y;
  },range),540);

};

function test_reduce_async(){
  var range = [3,1,4,1,5,9];
  functools.reduce.async(function(x,y,callback){ 
    callback(undefined, x*y);
  },range,function(error, result){
    if(error){
      throw error;
    }
    assert.equal(result, 540);
  });

};

function test_reduce_async_error(){
  var range = [3,1,4,1,5,9];
  functools.reduce.async(function(_,_,callback){ 
    callback(new Error('foobar'));
  },range,function(error, result){
    assert.equal(error.message, 'foobar');
  });
};

var tests = {
  'test_compose':test_compose,
  'test_compose_async':test_compose_async,
  'test_compose_async_error':test_compose_async_error,
  'test_curry':test_curry,
  'test_each':test_each,
  'test_filter':test_filter,
  'test_filter_async':test_filter_async,
  'test_juxt':test_juxt,
  'test_juxt_async':test_juxt_async,
  'test_map':test_map,
  'test_map_async':test_map_async,
  'test_map_async_error':test_map_async_error,
  'test_partial':test_partial,
  'test_reduce':test_reduce,
  'test_reduce_async':test_reduce_async,
  'test_reduce_async_error':test_reduce_async_error,
  'test_partial':test_partial
};

typeof module != 'undefined' && ( module.exports = tests );
