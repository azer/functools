functools is a JavaScript library for functional programming.

Inspired by: Common Lisp, Clojure and Python.

Version: 1.1.3

# SYNOPSIS

A typical usage:

```javascript
var map = require("functools").map;

var seq = [3,1,4,1,5,9];

functools.map(function(el,ind,seq){
  return el+ind;
},seq);
```

Function Composition:

```javascript
var compose = require("functools").compose;

compose(select, update, prettify, display)("body .messages");
```

Async Function Compositon:

```javascript

function findFiles(path, callback){  ... }
function readContents(files, callback){ ... }
function upload(files, callback){}

compose.async(findFiles, readContents, upload)('~/messages', function(error, uploadResult){
  ...
});
```

Currying:

```javascript
var fn = require("functools");

var pickEvens = fn.curry(fn.filter)(function(num){ return num%2==0 });

pickEvens([3,1,4]) // returns [4]
pickEvens([1,5,9,2,6,5]) // returns [2,6]
```


# INSTALL

```bash
$ npm install functools
```

or 

```bash
$ wget https://raw.github.com/azer/functools/master/lib/functools.js
```

# API

## compose(*functions ...*)(*value*)

Combine *functions* in a new one, passing the result of each function to next
one, from left to right.

```javascript
function cube(x){ return x*x*x };

compose(Math.sqrt,cube)(4); // returns 8
```

## compose.async(*functions ...*)(*value*,*callback*)

Asynchronous, continuation passing based version of compose function. Requires
specified functions to call a callback function, passing an error object (if
there is one) and the result to be carried.

```javascript
function receiveMessage(message, callback){ ... callback(); }
function findRelatedUser(message, callback){ ... callback(null, user, message); }
function transmitMessage(user, message){ ... callback(); }

var messageTransmission = compose.async(receiveMessage, findRelatedUser, transmitMessage);

messageTransmission({ msg:"Hello !", 'user': 3 }, function(error, result){
  ...
})

```

## curry(*function*, *args ...*)

Transform multiple-argument *function* into a chain of functions that return each other until all arguments are gathered.

```javascript
function sum(x,y){ return x+y; }

var add3 = curry(sum, 3);

add3(14); // returns 17
add3(20); // returns 23
```


## partial(*function*,*initial arguments*,*context *)

Return a new function which will call *function* with the gathered arguments.

```javascript
function testPartial(){
  var args = reduce(function(x,y){ x+", "+y },arguments);

  console.log("this:",this);
  console.log("args:",args);
}

partial(testPartial, [3,14], 3.14159)(1,5,9);
```

The example code above will output:
```
this: 3.14159
args: 3,14,1,5,9
```

## each(*function*,*iterable*)

Call *function* once for element in *iterable*.

```javascript
each(function(el,ind,list){ console.assert( el == list[ind] ); }, [3,1,4]);
```

## map(*function*,*iterable*)

Invoke *function* once for each element of *iterable*. Creates a new array
containing the values returned by the function.

```javascript
map(function(el,ind,list){ return el*el },[3,1,4,1,5,9]); // returns [9,1,16,1,25,81]
```


## map.async(*function*,*iterable*, *callback*)

Apply async *function* to every item of *iterable*, receiving a callback
function which takes error (if there is) and replacement parameters.

```javascript
function readFile(id, callback){ ... callback(undefined, data); }

map.async(readFile, ['./foo/bar', './foo/qux', './corge'], function(error, files){
  if(error) throw error;

  console.log(files[0]); // will put the content of ./foo/bar
});
```

## filter(*function*,*iterable*)

Construct a new array from those elements of *iterable* for which *function* returns true.

```javascript
filter(function(el,ind,list){ return el%2==0 },[3,1,4]); // returns [4]
```

## filter.async(*function*,*iterable*, *callback*)

Call async *function* once for each element in *iterable*, receiving a boolean
parameter, and construct a new array of all the values for which *function*
produces *true*

```javascript

var users = [ 3, 5, 8, 13, 21 ]; // only user#3 and user#8 have permission in this example

function hasPermission(userId, callback){ ... callback(/* true or false */); }

filter.async(hasPermission, users, function(permittedUsers){
  assert.equal(permittedUsers.length, 4);
});

```



## juxt(*functions ...*)

Take a set of functions, return a function that is the juxtaposition of those
functions. The returned function takes a variable number of arguments and
returns a list containing the result of applying each fn to the arguments.

```javascript
function inc1(n){ return n+1 };
function inc2(n){ return n+2 };
function inc3(n){ return n+3 };

juxt(inc1, inc2, inc3)([3,1,4]); // returns [4,3,7]
```



## juxt.async(*functions ...*)

Async implementation of *juxt*.

```javascript
function md5(path, callback){ fetch(path, callback); }
function sha1(path, callback){ fetch(path, callback); }
function crc32(path, callback){ fetch(path, callback); }

juxt.async(md5, sha1, crc32)("hello world", function(error,  result){
  result[0] => md5("hello world")
  result[1] => sha1("hello world")
  result[2] => crc32("hello world")
});
```

## reduce(*function*,*iterable*)

Apply *function* cumulatively to the items of *iterable*,  as to reduce the
*iterable* to a single value

```javascript
reduce(function(x,y){ return x*y }, [3,1,4]); // returns 12
```

## reduce.async(*function*,*iterable*, *callback*)

Async implementation of *reduce*.

```javascript

var users = [2, 3, 5, 8, 13];

function usernames(accum, userId){ ... callback(undefined, accum + ', ' + username); }

reduce.async(usernames, users, function(error, result){
  if(error) throw error;

  console.log(result); // foo, bar, qux ...
});

```

# SEE ALSO
- [Functional Programming - Eloquent JavaScript](http://eloquentjavascript.net/chapter6.html)
