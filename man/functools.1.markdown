functools(1) -- a minimal javascript library for functional programming
=======================================================================

## SYNOPSIS

A typical usage: 

    var map = require("functools").map;

    var seq = [3,1,4,1,5,9];

    functools.map(function(el,ind,seq){
      return el+ind;
    },seq);

Function Composition: 

    var compose = require("functools").compose;

    compose(select, update, prettify, display)("body .messages");

Currying:

    var fn = require("functools");

    var pickEvens = fn.curry(fn.filter)(function(num){ return num%2==0 });

    pickEvens([3,1,4]) // returns [4]
    pickEvens([1,5,9,2,6,5]) // returns [2,6]

Partial Function Application: 

    Foobar.prototype.doSomething = function(msg){
      puts(msg);
      this.corge();
    }

    server.on("connection", functools.partial(foobar.doSomething, ["Hello World"], foobar));


## DESCRIPTION

functools is a library for functional programming written in JavaScript. It's
based on a CommonJS module consists of several function manipulation and list
iteration tools.

## API

### compose(*functions ...*)(*value*)
Combine *functions* in a new one, passing the result of each function to next
one, from left to right. 

    function cube(x){ return x*x*x };

    compose(Math.sqrt,cube)(4); // returns 8

### compose.async(*functions ...*)(*value*,*callback*)
Asynchronous, continuation passing based version of compose function. Requires
specified functions to call a callback function, passing an error object (if
there is) and the result to be carried.

    function cube(x,callback){ callback(undefined, x*x*x); }

    function sqrt(x,callback){ callback(undefined, Math.sqrt(x)); }

    compose.async(Math.sqrt, cube)(4,function(error, result){
      console.log(error); // undefined
      console.log(result); // puts "8"
    });

### curry(*function*, *args ...*)
Transform multiple-argument *function* into a chain of functions that return each other until all arguments are gathered.

    function sum(x,y){ return x+y; }

    var add3 = curry(sum, 3);

    add3(14); // returns 17
    add3(20); // returns 23

### partial(*function*,*initial arguments*,*context *)
Return a new function which will call *function* with the gathered arguments.

    function testPartial(){
      var args = reduce(function(x,y){ x+", "+y },arguments);

      console.log("this:",this);
      console.log("args:",args);
    }

    partial(testPartial, [3,14], 3.14159)(1,5,9);

The example code above will output:

    this: 3.14159
    args: 3,14,1,5,9

### each(*function*,*iterable*)
Call *function* once for element in *iterable*. 

    each(function(el,ind,list){ console.assert( el == list[ind] ); }, [3,1,4]);

### map(*function*,*iterable*)
Invoke *function* once for each element of *iterable*. Creates a new array
containing the values returned by the function.

    map(function(el,ind,list){ return el*el },[3,1,4,1,5,9]); // returns [9,1,16,1,25,81]

### map.async(*function*,*iterable*, *callback*)
Apply async *function* to every item of *iterable*, receiving a callback
function which takes error (if there is) and replacement parameters.


    map(function(el,callback){ callback(undefined,el*el); },[3,1,4,1,5,9],function(error, newArray){
      assert.equal(newArray[0], 9); // true
    });

### filter(*function*,*iterable*)
Construct a new array from those elements of *iterable* for which *function* returns true.

    filter(function(el,ind,list){ return el%2==0 },[3,1,4]); // returns [4]

### filter.async(*function*,*iterable*, *callback*)
Call async *function* once for each element in *iterable*, receiving a boolean
parameter, and construct a new array of all the values for which *function*
produces *true*

    filter(function(el,callback){ callback(el%2==0); },[3,1,4],function(newArray){
      assert.equal(newArray[0], 4); // true
    });

## juxt(*functions ...*)
Take a set of functions, return a function that is the juxtaposition of those
functions. The returned function takes a variable number of arguments and
returns a list containing the result of applying each fn to the arguments.

    function inc1(n){ return n+1 };
    function inc2(n){ return n+2 };
    function inc3(n){ return n+3 };

    juxt(inc1, inc2, inc3)([3,1,4]); // returns [4,3,7]

## juxt.async(*functions ...*)
Async implementation of *juxt*. 

    function md5(path, callback){ fetch(path, callback); }
    function sha1(path, callback){ fetch(path, callback); }
    function crc32(path, callback){ fetch(path, callback); }

    juxt.async(md5, sha1, crc32)("hello world", function(error,  result){
      result[0] => md5("hello world")
      result[1] => sha1("hello world")
      result[2] => crc32("hello world")
    });

### reduce(*function*,*iterable*)
Apply *function* cumulatively to the items of *iterable*,  as to reduce the
*iterable* to a single value

    reduce(function(x,y){ return x*y }, [3,1,4]); // returns 12

### reduce.async(*function*,*iterable*, *callback*)
Apply version of *reduce*. See the example below.

    reduce(function(x,y,callback){ callback(undefined,x*y); },[3,1,4],function(error, result){
      assert.equal(result, 12); // true
    });

## SEE ALSO
- [Functional Programming - Eloquent JavaScript](http://eloquentjavascript.net/chapter6.html)
- [Underscore.js](http://documentcloud.github.com/underscore/)
- [Roka Lisp](http://github.com/azer/roka)


[SYNOPSIS]: #SYNOPSIS "SYNOPSIS"
[DESCRIPTION]: #DESCRIPTION "DESCRIPTION"
[API]: #API "API"
[SEE ALSO]: #SEE-ALSO "SEE ALSO"


[functools(1)]: functools.1.ron.html
