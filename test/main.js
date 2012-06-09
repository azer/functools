var node = typeof process != 'undefined' && process.versions && process.versions.node != undefined;

if(node){
  functools = require("../lib/functools");
  assert  = require('assert');
}

function cube(x){ return x*x*x; };
function sum(x){ return x+x; };
function div(x){ return x/2; };
function mul(x){return x*3; };

function cubeAsync(x,callback){ callback(undefined,x*x*x); };
function sumAsync(x,callback){ callback(undefined,x+x); };
function divAsync(x,callback){ callback(undefined,x/2); };
function mulAsync(x,callback){ callback(undefined,x*3); };

function test_compose(callback){

  var unaltered = Math.floor(Math.random()*100);

  var increment = function(serial){
    return function(val){
      return val+serial;
    };
  };

  assert.equal(functools.compose(increment(1), increment(2), increment(3) )(unaltered),unaltered+6);

  assert.equal(functools.compose(cube, sum, div, mul)(2), 24);

  callback();
};

function test_compose_async(callback){
  var unaltered = Math.floor(Math.random()*100);

  function increment(serial){
    return function(val,callback){
      callback(undefined, val+serial);
    };
  }

  functools.compose.async( increment(1), increment(2), increment(3) )(unaltered,function(error,result){
    if(error){
      callback(error);
      return;
    }

    assert.equal(result, unaltered + 6);

    functools.compose.async(cubeAsync, sumAsync, divAsync, mulAsync)(2,function(error, result){
      if(error){
        callback(error);
        return;
      }
      assert.equal(result, 24);
      callback();
    });
  });
}

function test_compose_async_error(callback){
  function err(_,callback){
    callback(new Error('foobar'),9);
  };

  functools.compose.async(err)([3,1,4], function(error, result){
    assert.equal(error.message, 'foobar');
    callback();
  });
}

function test_curry(callback){

  function sum(a,b,c){
    return a+b+c;
  }

  assert.equal( functools.curry(sum)()(3)()(1)(4),8);
  assert.equal( functools.curry(sum,3,1,4),8);
  assert.equal( functools.curry(sum,3)(1,4),8);

  callback();
}

function test_each(callback){
  var range = [3,1,4,1,5,9],
      serial = 0;

  assert.equal(functools.each(function(el,ind,seq){

    assert.equal(seq,range);
    assert.equal(ind,serial++);
    assert.ok(ind<seq.length);

  }, range),range);

  callback();

}

function test_filter(callback){
  var range = [3,1,4,1,5,9],
      rangeClone = Array.prototype.slice.call(range),
      serial = 0;

  var evensInRange = functools.filter(function(el,ind,seq){

    assert.equal(range.length, rangeClone.length);

    var i = rangeClone.length;
    while( i -- ){
      assert.equal(rangeClone[i],range[i]);
    }

    assert.equal(serial++,ind);
    assert.equal(range[ind], el);
    assert.equal(seq[ind],el);

    return el%2==0;
  }, range);

  assert.equal(evensInRange.length, 1);
  assert.equal(evensInRange[0], 4);

  callback();
};

function test_filter_async(callback){
  var range = [3,1,4,1,5,9],
      rangeClone = Array.prototype.slice.call(range),
      serial = 0;

  functools.filter.async(function(el,callback){
    callback(el%2==0);
  }, range, function(evensInRange){
    assert.equal(evensInRange.length, 1);
    assert.equal(evensInRange[0], 4);

    callback();
  });
}

function test_juxt(callback){

  function inc(serial){ return function(val){ return val+serial; } }

  var unaltered = Math.floor(Math.random()*100);

  var result = functools.juxt(inc(1), inc(2), inc(3) )(unaltered);
  assert.equal(result[0], unaltered+1);
  assert.equal(result[1], unaltered+2);
  assert.equal(result[2], unaltered+3);

  result = functools.juxt(cube, sum, div, mul)(2);
  assert.equal(result[0], 8);
  assert.equal(result[1], 4);
  assert.equal(result[2], 1);
  assert.equal(result[3], 6);

  result = functools.juxt({ 'cube': cube, 'sum': sum, 'div': div, 'mul': mul })(2);
  assert.equal(result.cube, 8);
  assert.equal(result.sum, 4);
  assert.equal(result.div, 1);
  assert.equal(result.mul, 6);

  callback();
}

function test_juxt_async(callback){
  var unaltered = Math.floor(Math.random()*100);

  function inc(serial){
    return function(val, callback){
      callback(undefined, val+serial);
    };
  };

  functools.juxt.async( inc(1), inc(2), inc(3) )(unaltered,function(error,result){

    if(error){
      callback(error);
      return;
    }

    assert.equal(result[0], unaltered+1);
    assert.equal(result[1], unaltered+2);
    assert.equal(result[2], unaltered+3);

    functools.juxt.async(cubeAsync, sumAsync, divAsync, mulAsync)(2,function(error, result){

      if(error){
        callback(error);
        return;
      }

      assert.equal(result[0], 8);
      assert.equal(result[1], 4);
      assert.equal(result[2], 1);
      assert.equal(result[3], 6);


      functools.juxt.async({ 'cube':cubeAsync, 'sum':sumAsync, 'div':divAsync, 'mul':mulAsync })(2,function(error, result){

        if(error){
          callback(error);
          return;
        }

        assert.equal(result.cube, 8);
        assert.equal(result.sum, 4);
        assert.equal(result.div, 1);
        assert.equal(result.mul, 6);

        callback();

      });

    });

  });



}

function test_map(callback){

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
  }, range);

  assert.equal(range[0], 3);
  assert.equal(range[1], 1);
  assert.equal(range[2], 4);

  assert.equal(seq[0], 9);
  assert.equal(seq[1], 1);
  assert.equal(seq[2], 16);

  range = { 'a': 3, 'b': 1, 'c': 4 };

  seq = functools.map(function(el, key, self){
    assert.equal(el, range[key]);
    return el * el;
  }, range);

  assert.equal(range.a, 3);
  assert.equal(range.b, 1);
  assert.equal(range.c, 4);

  assert.equal(seq.a, 9);
  assert.equal(seq.b, 1);
  assert.equal(seq.c, 16);

  callback();

};

function test_map_async(callback){

  var range = [3,1,4];

  functools.map.async(function(el,callback){
    callback(undefined, el*el);
  }, range, function(error, seq){

    if(error){
      throw error;
    }

    assert.equal(range[0], 3);
    assert.equal(range[1], 1);
    assert.equal(range[2], 4);

    assert.equal(seq[0], 9);
    assert.equal(seq[1], 1);
    assert.equal(seq[2], 16);

    range = { 'a': 3, 'b': 1, 'c': 4 };

    functools.map.async(function(el,callback){ callback(undefined, el*el); }, range, function(error, seq){

      if(error){
        throw error;
      }

      assert.equal(range.a, 3);
      assert.equal(range.b, 1);
      assert.equal(range.c, 4);

      assert.equal(seq.a, 9);
      assert.equal(seq.b, 1);
      assert.equal(seq.c, 16);

      callback();

    });

  });

};

function test_map_async_error(callback){
  functools.map.async(function(_,callback){ callback(new Error('foobar'),9); }, [3, 1, 4], function(error, list){
    assert.equal(list[0], 9);
    assert.equal(list[1], 1);
    assert.equal(list[2], 4);

    assert.equal(error.message, 'foobar');
    callback();
  });
}

function test_memoize(callback){

  var table = {};

  function mark(n){
    if(table.hasOwnProperty(n)){
      throw new Error('memoization error');
    }
    table[n] = true;
  }

  var plus1 = functools.memoize(function(n){
    mark(n);
    return n+1;
  });

  assert.equal(plus1(1), 2);
  assert.equal(plus1(1), 2);

  assert.equal(plus1(2), 3);
  assert.equal(plus1(2), 3);

  assert.equal(plus1(3), 4);
  assert.equal(plus1(3), 4);

  callback();
}

function test_memoize_async(callback){
  var table = {};

  function mark(n){
    if(table.hasOwnProperty(n)){
      throw new Error('memoization error');
    }
    table[n] = true;
  }

  var plus1 = functools.memoize.async(function(n, cb){
    mark(n);
    setTimeout(cb, 100, undefined, n+1);
  });

  plus1(1, function(error, result){
    assert.ok(!error);
    assert.equal(result, 2);
  });

  plus1(1, function(error, result){

    assert.ok(!error);
    assert.equal(result, 2);

    plus1(1, function(error, result){

      assert.ok(!error);
      assert.equal(result, 2);


      plus1(2, function(error, result){

        assert.ok(!error);
        assert.equal(result, 3);


        plus1(2, function(error, result){

          assert.ok(!error);
          assert.equal(result, 3);

          callback();

        });

      });

    });

  });
}

function test_memoize_async_error(callback){
  var table = {}, throwErr = true;

  function mark(n){
    if(table.hasOwnProperty(n)){
      throw new Error('memoization error');
    }
    table[n] = true;
  }

  var plus1 = functools.memoize.async(function(n, cb){
    if(throwErr){
      throwErr = false;
      setTimeout(cb, 100, new Error('foobar'));
      return;
    }

    mark(n);
    setTimeout(cb, 100, undefined, n+1);
  });

  plus1(1, function(error, result){
    assert.ok(!result);
    assert.equal(error.message, 'foobar');
  });

  plus1(1, function(error, result){
    assert.ok(!result);
    assert.equal(error.message, 'foobar');

    plus1(1, function(error, result){
      assert.ok(!error);
      assert.equal(result, 2);

      plus1(1, function(error, result){

        assert.ok(!error);
        assert.equal(result, 2);

        callback();

      });

    });

  });
}

function test_partial(callback){
  function sum(){
    return functools.reduce(function(x,y){ return x+y },arguments);
  };

  assert.equal(functools.partial(sum,[3,1,4,0])(),8);
  assert.equal(functools.partial(sum)(3,1,4,0),8);
  assert.equal(functools.partial(sum,[3,1])(4,1),9);

  var foo = {};

  functools.partial(function(){
    assert.equal(this, foo);
  },[],foo)();

  callback();

};

function test_reduce(callback){

  var range = [3,1,4,1,5,9];

  assert.equal(functools.reduce(function(x,y,seq){
    return x*y;
  },range),540);

  callback();

};

function test_reduce_async(callback){
  var range = [3,1,4,1,5,9];
  functools.reduce.async(function(x,y,callback){ callback(undefined, x*y); }, range, function(error, result){

    if(error){
      throw error;
    }

    assert.equal(result, 540);
    callback();
  });
};

function test_reduce_async_error(callback){
  var range = [3,1,4,1,5,9];
  functools.reduce.async(function(_,_,callback){ callback(new Error('foobar')); }, range, function(error, result){
    assert.equal(error.message, 'foobar');
    callback();
  });
};

module.exports = {
  'test_compose': test_compose,
  'test_compose_async': test_compose_async,
  'test_compose_async_error': test_compose_async_error,
  'test_curry': test_curry,
  'test_each': test_each,
  'test_filter': test_filter,
  'test_filter_async': test_filter_async,
  'test_juxt': test_juxt,
  'test_juxt_async': test_juxt_async,
  'test_map': test_map,
  'test_map_async': test_map_async,
  'test_map_async_error': test_map_async_error,
  'test_memoize':  test_memoize,
  'test_memoize_async':  test_memoize_async,
  'test_memoize_async_error':  test_memoize_async_error,
  'test_partial': test_partial,
  'test_reduce': test_reduce,
  'test_reduce_async': test_reduce_async,
  'test_reduce_async_error': test_reduce_async_error,
  'test_partial': test_partial

};
