var functools = (function(undefined){

  /**
   * Function composition implementation
   */ 
  function compose(/* functions */){
    var fns = Array.prototype.slice.call(arguments);
    return function(initialValue){
      return reduce(function(f,g){
        return function(val){ 
          return g(f(val));
        }
      },fns)(initialValue);
    }
  }

  compose.async = function compose_async(/* functions */){
    var fns = Array.prototype.slice.call(arguments);
    return function(initialValue,callback){
      (function(i,error,value){
        if(error || fns.length<=i){
          return callback(error, value);
        }

        fns[i](value, partial(arguments.callee, [i+1]));

      })(0,undefined,initialValue);
    }
  }

  /**
   * Transform multiple-argument 'fn' into a chain of functions that return each other until all arguments
   * are gathered.
   */
  function curry(fn){
    var args = Array.prototype.slice.call(arguments,1),
        len = fn.length;
    return (function(){
      Array.prototype.push.apply(args,arguments);
      return args.length >= len && fn.apply(null,args) || arguments.callee;
    })();
  }

  /**
   * Execute 'fn' once per 'iterable' element.
   */
  function each(fn,iterable){
    for(var i = -1, len=iterable.length; ++i < len; ){
      fn(iterable[i],i,iterable);
    };
    return iterable;
  }

  /**
   * Apply 'fn' to every element of 'iterable', returning those elements for which fn returned a true value.
   */
  function filter(fn,iterable){
    var accumulation = [];
    for(var i = -1, len=iterable.length; ++i < len; ){
      fn(iterable[i],i,iterable) && accumulation.push(iterable[i]);
    };
    return accumulation;
  }

  filter.async = function filter_async(fn, iterable, callback){
    var accumulation = [];
    (function(i,ptest){

        ptest && accumulation.push(iterable[i-1]);

        if(i>=iterable.length){
          return callback(accumulation);
        }

        fn(iterable[i], partial(arguments.callee, [i+1]));

    })(0);
  }

  /**
   * Apply fn to every element of iterable.
   */
  function map(fn,iterable){
    var seq = Array.prototype.slice.call(iterable);
    for(var i = -1, len=seq.length; ++i < len; ){
      seq[i] = fn(seq[i],i,seq);
    };

    return seq;
  }

  map.async = function map_async(fn, iterable, callback){
    var seq = Array.prototype.slice.call(iterable);
    (function(i, error, rpl){
      
      rpl && ( seq[i-1] = rpl );

      if(error || i>=seq.length){
        return callback(error, seq);
      }

      fn(seq[i], partial(arguments.callee, [i+1]));

    })(0);
  }

  /**
   * Return a new function which will call 'fn' with the positional arguments 'args'
   */
  function partial(fn,initialArgs,ctx){
    !initialArgs && ( initialArgs = [] );
    return function(){
      var args = Array.prototype.slice.call(initialArgs,0);
      Array.prototype.push.apply(args,arguments);
      return fn.apply(ctx,args);
    };
  };

  /**
   * Apply fn cumulatively to the items of iterable,  as to reduce the iterable to a single value
   */
  function reduce(fn,iterable){
    var accumulator = iterable[0];

    for(var i = 0, len=iterable.length; ++i < len; ){
      accumulator=fn(accumulator,iterable[i],iterable);
    };

    return accumulator;
  }

  reduce.async = function reduce_async(fn,iterable,callback){
    (function(i, error, accumulator){
      
      if(error || i>=iterable.length){
        return callback(error, accumulator);
      }

      fn(accumulator, iterable[i], partial(arguments.callee, [i+1]));

    })(1,undefined,iterable[0]);
  }

  return {
    "compose":compose,
    "curry":curry,
    "each":each,
    "filter":filter,
    "map":map,
    "partial":partial,
    "reduce":reduce
  }

})();

if(typeof module != 'undefined' && module.exports){
  module.exports = functools;
}
