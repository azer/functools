/**
 * Function composition implementation
 */ 
function compose(/* functions */){
  var fns = Array.prototype.slice.call(arguments);
  return function(initialValue){
    return reduce(function(f,g){
      return function(val){ 
        return f(g(val));
      }
    },fns)(initialValue);
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
function reduce(fn,iterable,accumulator){
  var index = 1;
  !accumulator && ( accumulator = iterable[0] ) || ( index = 0 );

  for(var i = index-1, len=iterable.length; ++i < len; ){
    accumulator=fn(accumulator,iterable[i],i,iterable);
  };

  return accumulator;
}

module.exports = {
  "compose":compose,
  "curry":curry,
  "each":each,
  "filter":filter,
  "map":map,
  "partial":partial,
  "reduce":reduce
}
