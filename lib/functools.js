/**
 * Function composition implementation
 */ 
var compose = exports.compose = function compose(/* functions */){
  var fns = Array.prototype.slice.call(arguments);
  return function(initialValue){
    return reduce(fns, function(f,g){
      return function(val){ 
        return f(g(val));
      }
    })(initialValue);
  }
}

/**
 * Transform multiple-argument 'fn' into a chain of functions that return each other until all arguments
 * are gathered.
 */
var curry = exports.curry = function curry(fn){
  var args = Array.prototype.slice.call(arguments,1),
      len = fn.length;
  return (function(){
    Array.prototype.push.apply(args,arguments);
    return args.length >= len && fn.apply(null,args) || arguments.callee;
  })();
}

/**
 * Apply 'fn' to every element of 'iterable', returning those elements for which fn returned a true value.
 */
var filter = exports.filter = function filter(iterable,fn){
  var accumulation = [];
  for(var i = -1, len=iterable.length; ++i < len; ){
    fn(iterable[i],i,iterable) && accumulation.push(iterable[i]);
  };
  return accumulation;
}

/**
 * Apply fn to every element of iterable.
 */
var map = exports.map = function map(iterable,fn){
  var seq = Array.prototype.slice.call(iterable);
  for(var i = -1, len=seq.length; ++i < len; ){
    seq[i] = fn(seq[i],i,seq);
  };

  return seq;
}

/**
 * Return a new function which will call 'fn' with the positional arguments 'args'
 */
var partial = exports.partial = function partial(fn,initialArgs,ctx){
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
var reduce = exports.reduce = function reduce(iterable,fn,accumulator){
  var index = 1;
  !accumulator && ( accumulator = iterable[0] ) || ( index = 0 );

  for(var i = index-1, len=iterable.length; ++i < len; ){
    accumulator=fn(accumulator,iterable[i],i,iterable);
  };

  return accumulator;
}
