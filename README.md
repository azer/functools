functools is a JavaScript library for functional programming.

Inspired by: Common Lisp, Clojure and Python.
Tested on: Chrome, IE6 and Node. (See *test/results.json* for details)

# SYNOPSIS

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

Async Juxtaposition:

```javascript
function turkish(word, callback){ /* some magic here */ }
function french(word, callback){ /* some magic here */ }
function polish(word, callback){ /* some magic here */ }

juxt.async({ 'tr': turkish, 'fr': french, 'pl': polish })("hello", function(error,  results){
  assert.equal(results.tr, "merhaba");
  assert.equal(results.fr, "bonjour");
  assert.equal(results.pl, "cześć");
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

# WHAT'S NEW?

06.09.2012
* each.async
* memoize
* memoize.async

06.08.2012
* IE6, IE7 and IE8 bugfixes
* better testing

# DOCUMENTATION

* [compose](#compose)
* [compose.async](#compose.async)
* [curry](#curry)
* [each](#each)
* [each.async](#each.async)
* [filter](#filter)
* [filter.async](#filter.async)
* [juxt](#juxt)
* [juxt.async](#juxt.async)
* [map](#map)
* [map.async](#map.async)
* [memoize](#memoize)
* [memoize.async](#memoize.async)
* [partial](#partial)
* [reduce](#reduce)
* [reduce.async](#reduce.async)

<a name="compose" />
## compose(*functions ...*)(*value*)

Combine *functions* in a new one, passing the result of each function to next
one, from left to right.

```javascript
function cube(x){ return x*x*x };

compose(Math.sqrt,cube)(4); // returns 8
```

<a name="compose.async" />
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
<a name="curry" />
## curry(*function*, *args ...*)

Transform multiple-argument *function* into a chain of functions that return each other until all arguments are gathered.

```javascript
function sum(x,y){ return x+y; }

var add3 = curry(sum, 3);

add3(14); // returns 17
add3(20); // returns 23
```

<a name="each" />
## each(*function*,*iterable*)

Call *function* once for each element in *iterable*.

```javascript
each(function(el,ind,list){ console.assert( el == list[ind] ); }, [3, 1, 4]);
```

<a name="each.async" />
## each.async(*function*,*iterable*,*callback*)

Call async *function* once for each element in *iterable*, and *callback* after iteration.

```javascript

> function uploadFile(filename, callback){
  console.log('Uploading ', filename);
  callback();
}

> each.async(uploadFile, [ '/docs/intro', '/docs/body', '/docs/outro' ], function(error){

  if(error){
    console.log('Failed to upload files');
    throw error;
  }

  console.log('All files has been uploaded successfully');

});

> Uploading /docs/intro
Uploading /docs/body
Uploading /docs/outro
All files has been uploaded successfully
```

<a name="filter" />
## filter(*function*,*iterable*)

Construct a new array from those elements of *iterable* for which *function* returns true.

```javascript
filter(function(el,ind,list){ return el%2==0 }, [3, 1, 4]); // returns [4]
```

<a name="filter.async" />
## filter.async(*function*,*iterable*, *callback*)

Call async *function* once for each element in *iterable*, receiving a boolean
parameter, and construct a new array of all the values for which *function*
produces *true*

```javascript

var users = [ 3, 5, 8, 13, 21 ]; // only user#3 and user#8 have permission in this example

function hasPermission(userId, callback){ ... callback(/* true or false */); }

filter.async(hasPermission, [3, 1, 4], function(permittedUsers){
  assert.equal(permittedUsers.length, /* ? */);
});

```

<a name="juxt" />
## juxt(*functions ...*)

Take a set of functions, return a function that is the juxtaposition of those
functions. The returned function takes a variable number of arguments and
returns a list containing the result of applying each fn to the arguments.

```javascript
function inc1(n){ return n+1 };
function inc2(n){ return n+2 };
function inc3(n){ return n+3 };

juxt(inc1, inc2, inc3)(314); // returns [315,316,317]
```

<a name="juxt.async" />
## juxt.async(*functions ...*)

Async implementation of *juxt*.

```javascript
function turkish(word, callback){ /* some magic here */ }
function french(word, callback){ /* some magic here */ }
function polish(word, callback){ /* some magic here */ }

juxt.async(turkish, french, polish)("hello", function(error,  results){
  assert.equal(results[0], "merhaba");
  assert.equal(results[1], "bonjour");
  assert.equal(results[2], "cześć");
});
```

<a name="map" />
## map(*function*,*iterable*)

Invoke *function* once for each element of *iterable*. Creates a new iterable
containing the values returned by the function.

```javascript

function square(n){
  return n*n;
}

map(square, [3,1,4,1,5,9]); // returns [9,1,16,1,25,81]
```

Objects can be passed as well;

```javascript
var dict = { 'en':'hello', 'tr': 'merhaba', 'fr':'bonjour' };

function capitalize(str){
  return str.charAt(0).toUpperCase() + str.slice(1);
}

map(capitalize, dict); // returns { 'en':'Hello', 'tr':'Merhaba', 'fr':'Bonjour' }
```

<a name="map.async" />
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

<a name="memoize" />
## memoize(*function*,*hasher*)

Return a memoized version of *function*. *hasher* is optional.

```javascript
> function myfunc(n){
    console.log("doing some work");
    return n + 10;
}

> var myfuncMemo = memoize(myfunc);
> myfuncMemo(1);
"doing some work"
11
> myfuncMemo(1);
11
> myfuncMemo(20);
"doing some work"
30
> myfuncMemo(20);
30
```

<a name="memoize.async" />
## memoize.async(*function*, *hasher*)

Memoize given async *function* if it doesn't produce any error.

```javascript
> function readFile(){ console.log('doing some work'); ... callback(undefined, buffer); }

> var readFileMemo = memoize.async(readFile);

> readFileMemo('/docs/readme', function(error, content){
    console.log(content);
});
"doing some work"

> "This is the Readme file"

> readFileMemo('/docs/readme', function(error, content){
    console.log(content);
});
"This is the Readme file"
```

<a name="partial" />
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

<a name="reduce />
## reduce(*function*,*iterable*)

Apply *function* cumulatively to the items of *iterable*,  as to reduce the
*iterable* to a single value

```javascript
reduce(function(x,y){ return x*y }, [3,1,4]); // returns 12
```

<a name="reduce.async" />
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

# Testing

## On NodeJS:

```
$ npm test
```

## On Browsers

Run `make test` command to publish the tests on `localhost:1314`. Visit the URL using the browser on which you want to run the tests. Stop the server (Ctrl+C) when you're done with testing.

To see the summary of results;

```
$ make test do=verify
Not Tested: firefox, ie8, ie7
Passed: ie6, webkit

Revision: 1.3.0
Results Source: test/results.json
Config: test/config.json
```

# SEE ALSO
- [Functional Programming - Eloquent JavaScript](http://eloquentjavascript.net/chapter6.html)
