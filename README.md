# Cisf 4.2.0

Support for simple **Runtime Type-Assertions **
in JavaScript, and assorted simple utilitites
 
Cisf.js allows you to add type-checks to your
JavaScript code with minimalistic syntax.

cisf.js could be described as "TypeScript Light",
simple and easy to learn and unobtrusive to use.
No transpiling to JavaScript is needed since
you do it all in JavaScript.

Cisf also provides a select few a
dditional utilities
for making programmers' lives easier:
log, err, r, w, fs, path.

'w()' is actually
a minimalistic framework for adding
extensions to JavaScript base-classes.
Since cisf is open source you can modify
cisf.js  and add your own favorite
extensions as needed.

Cisf comes with several useful
JS-extensions already such as the
 **last()** -method for Arrays,
 and **map()** for Objects.
 More but not many more
 may be added in the future.
See documentation of w().


##### USAGE:

    let { ok, not, x, xNot(), fails, eq, neq, A
        , Type
        , is, isNot, isEq, isNeq
        , log, err, r, w
        , path, fs
        } = require ("cisf");
        
Or, pick just the subset of API-functions you need:

    let {ok, x, r} = require ("cisf");


##### RELEASE-ANNOUNCEMENTS:
   
https://twitter.com/ClassCloudLLC
   
   
#### 0. MOTIVATING EXAMPLE

You want to make sure you get
an early warning whenever your 
function is called with
something that is not a Number
and not a String.  You might
write something like this:  

    if ( arg.constructor !== Number &&   
         arg.constructor !== String
	   )
	  { throw "not number nor string";
	  }
 
 Using CISF you can write it more simply as:
 
     x (arg, Number, String);
 
x() checks that its first argument is
of the same type as one of the other
remaining arguments.
 
You are more likely to put such checks
into your code when they are easy
to write  and easy to read and understand.
 
This in turn means that bugs get caught
early, which is good.
 
#### Motivating example 2:

Your function has many arguments and
you want to DECLARE what the types of
those arguments should be. You want
a clear simple way of expressing, and
enforcing the types of several arguments
at once.

So not only dio you want to catch the
error of being called with wrong
arguments early, you also want to make
it simple for everybody to understand
what type those arguments should be.

You could write a lot of comments and
documentation that tells that  but
writing and reading documentation takes
time. You'd ratherr be coding. You would
rather have the code itself make it clear
what types of arguments it can be called
with.

In statically typed languages like
Java and C# you must declare the types
of your arguments. In JavaScript you don't
but it would still seem like a good idea
to tbe ABLE to do that when you want to.
For instance for the PUBLIC interface
of your module. Leave your private
inner functions as they are, but declare
the types of your public methods.

With the A() -primitive of Cisf you can
now declare your argument-types succinctly
and know that you get an error if the
function is called with wrong
types of arguments:

    function AExample (s, n)
	{ A ([String, Number], s, n);
	}

Unlike with Java or #C this is optional.
Use it when and where it helps.



 
#### 1. INSTALLATION
    npm install cisf
    
#### 2. REQUIRING

##### A) With Node.js

    const
    { ok, not, x, fails, eq, neq, A, Type,
      log, err, r, path, fs, r, w
     }
    = require ('CISF');

The module CISF.js exports an object
with the API-functions shown above.
You  can  easily take in just the functions
you want  with  ES6 destructuring
assignment. For instance:

    const { ok, x }  = require ('CISF');

might be what you mostly use.

##### B) With  browser

If cisf.js detects it is not
running in Node.js it stores its API-functions
into  global variable "CISF", which you
can then access from within your
HTML-page:

    <script src="CISF.js"></script>
    <script> let {ok, not, x, fails, is, Type, r} = CISF;
    </script>



SEE: **test_browser.html** which does the
above and then runs all CISF-tests 
within the browser. To
check whether it runs on your browser 
open  **test_browser.html** in it. 
Seems to work on latest versions of Edge, 
FireFox and Chrome but not in IE-11. 

#### 3. API  

##### 3.1 ok ( truthy )
 
 ok() takes a  value
 as argument and throws an error
 if the argument is not "truthy".
 
    ok ({});
    ok ([]);
    ok (ok (true) === true) ;                
    ok (ok ("non-empty string") === true);
    ok (ok (1) === true) ;
    
    fails ( _ => ok()           ); 					
    fails ( _ => ok (undefined) );
    fails ( _ => ok(false));


##### 3.2 not ( nonTruthy )
not() succeeds if ok()
would cause an error.

not() causes an error if ok()
would not cause an error for the
same argument.

    not (0);
    not ("");
    not ("false");
    fails ( _ => not (true));


##### 3.3  x (value, ... Types)

###### 3.3.0 Zero arguments

Calling x() without arguments
throws an error, because doing
that is same as calling
x (undefined):

###### 3.3.1 One x() argument
 If called with  one argument x()
 fails if it is called with null
 or undefined or no argument at all.

 This allows you to know if the
  argument is something from
 which you can ask its constructor:

    x(0);
    x(false);
    x("");
    fails (_=> x (null));
    fails (_=> x (undefined));
    fails (_=> x ());

A special case is using null as
type-argument. It allows values that
are either null or undefined, but
nothing else:


###### 3.3.2  Two x() arguments
 x() is typicallly called with
 two arguments, a value and
 a "type":
  
    x (123, Number)
    fails (_=> x ("s", Number));

A special case is using null as the
2nd argument, it matches only itself
or undefined:

  x (null     , null);
  x (undefined, null);
  fails (() => x(33, null));

You will typically not be testing that
somnething is null or undefined,
but the opposite.

So why have a "null type"? It is because
you may often want to assert that IF
something is not null or undefined,
THEN it must be of some specific type.
That you can do by having
more thna one type argument:

  x (3   , Number, null);
  x (null, Number, null);



###### 3.3.3  Many x() arguments
You can add any number of types
as arguments after the value-argument.
The x() sill succeed if the value
argument is an instacne of any of
the  type-arguments:

    x (123, Number, String)
    x ("123", Number, String)
    fails (_=> x (true, Number, String));

     
######  3.3.4  Result of x()

If x() does not cause an error
it returns its first argument.

 This is  useful when
 you want to assign the
 value to a field and want
 to be sure you are not
 assigning  a value of wrong type:

    function example (arg)
    { let this.n  =  x(arg, Number);
        ...
    };

##### 3.3.B  xNot (nullOrUndefined)

xNot() causes an error unless it is called
with exactly a single argument which is
either null or undefined.

Useful for ensuring that immutable
instance-variables can have only
one value.


##### 3.4 is (value, Type)

is() returns true if x() called with the
same arguments would not fail, and false
otherwise:

    ok  (is (123, String) === false);
    ok  (is (123, Number) === true);

You can thus use the same type-machinery
as x() does to make branching  decisions
within your program.


##### 3.5 fails (aFunction)

Above you have already seen use of fails().
It assumes it is called with a function
as argument which it will call without
arguments. If the argument -function throws
an error fails() returns that error, else
it causes an error.

fails() may not be  used much
at runtime but it is useful when writing
tests for functions we know should and
will fail under certain conditions.
It  is good to tell the users of your API
what such cases are.

The function argument to fails is most
simply expressed as an ES6 arrow-function.
To make it as short as possible we typically
use '_' as  the argument-name of the arrow-function:

    fails (_ => throw "");
    fails (_ => fails ( arg => 123));
    fails (_ => divide (n, 0))




##### 3.6 Type ()
Type is a constructor for creating new  types.
Cisf supports the following types of types:

1. ConstructorType
2. SumType
3. NullType
4. ArrayType
5. ObjectType
6. FunctionType
7. PredicateType

8.  TruthyType
9.  FalsyType
10. RegExpType
11. StartsWithType
12. BiggerOrEqualType

At the time of this writing the best
documentation for how to use them
all is to read the tests in test.js.
But we are working on more documentation.

There are two type-types worthy of special
mention for now:


###### 3.6.1 (Named) Sum-Types ()

Type() can be used to combine
existing types into a "sum type"
which accepts anything that
is accepted by one of its components.

This is especially useful
for declaring that something is EITHER
a value of specific type or it is null
or undefined. A type like this is
commonly referred to as a
"Maybe-type":

    let NumberOrNull = new Type (Number, null);
    x( 123      , NumberOrNull);
    x( null     , NumberOrNull);
    x( undefined, NumberOrNull);
    fails (e=> x("s", NumberOrNull))

Note, null as 2nd argument accepts  null or
undefined as value. See test.js.


###### 3.6.2 Dependent Types ()

A DependentType is something whose
memebership depends on some other
value.

A function might take two numbers
as argument but require that 2nd one
is always bigger than the first.

This can be expressed by creating
a Dependent Type where the type
of the 2nd argument depends on the
first one. An example of such is
tested in test.js.

In practice it is often simpler to
juts use ok() to express the relationship
between the arguments:

    function fu (a, b)
    { ok (a < b);
    }

Dependent Types are not part of
mainstream programming languages
because when "type-checking"
usually refers to  static type-checking.
That means dependent-types must be
verified by the comnpiler when the
progrma is compiled without access
to the inputs the program will be run with.
That makes it difficult to create compilers
to support checking of types like
(a, b, where a < b) at compile-time.

But if we allow for the fact that
"type-checking" is useful also at runtime
then dependent types are trivial really.
"ok()" does not return a Type, but it
does "check the type of its argument".
And it typically expresses how the type
of one thing must depend on some other thing.


##### 3.7 path ()
The value of require("cisf").path
is the same as the Node.js standard
require("path");

You get 'path' easily along with cisf
so you don't have to require it yourself.
You just refer to it as one of the
fields of your structuring require
-assignment:

    let {ok, x, path} = require('cisf');

Note 'cisf.path' is not available on browser.


##### 3.8 fs ()
The value of require("cisf").fs
is the value of the Node.js standard
require("fs");

You get 'fs' along with cisf so you
don't have to require it yourself.
You just refer to it as one of the
fields of your structuring require
assignment:

    let {ok, x, fs, path} = require('cisf');

Note 'cisf.fs' is not available on browser.

'fs' and 'path' are (currently)
the only two  Node.js core APIs available
via cisf and it will likely remain that way.

We added those two because we think they are
the most useful and most frequently used core APIs.


##### 3.9 r()

cisf.r() takes as argument a module-path which
it interprets as relative to process.cwd()
and then tries to require. If the path does
not exist there will be an error like there
would be with standard Node.js require().

r() can also be used with Node.js internal
paths and module-names that exist in node_modules.
For instance:

      ok (r('fs') === require('fs'))


"r" has 2 helper-methods you may find useful:

1. **cisf.r.abs() :** Returns the absolute path of
its argument, which if relative is interpreted
relative to process.cwd().

2. **cisf.r.rel() :** Returns the relative path
of its argument relative to process.cwd().


The next code-excerpt shows the main reason why r() exists
in cisf: You can require modules by
giving r() their path relative to the cwd,
so you don't need to type out the full
host-specific abspath, nor use fragile
non-portable module-relative upward paths.

    let relPath = r.rel(__filename);
    ok (r (relPath) === require (__filename));

Above test in fact does nothing because
it requires the same module you are
already in. We use that as a
test becaseu we know that module
must exist, so the test does
not crash like it would if the file
did not exist.


##### 3.10 A()

API A() takes as argument
an Array of Types and then same number
or  more values. It causes an
error if the values are not instances
of the corresponding types.

A() is useful for declaring the types of your
arguments in a single statement. You would
use it like this:

    function AExample (s, n)
	{ A([String, Number], s, n);
	}
	...
	AExample ("yeah", 123); // works
	fails (_=> AExample ("yeah", "BAD"));

You probably would not write the
fails() -call  we did.
We just added it to prove to ourselves
that A() would catch the error of
AExample() being called with
wrong types of arguments.


##### 3.11 w()

 "w" stands for "wrapper". This API was inspired by
the question how best to get the
last element of an Array. We know it
would be nice if there was a built-in-method
of Array.prototype called "last()"
but there isn't.

You could add such a method to the
Array.prototype but problem is
somebody else's program
might have their own definition of
last() which differs from yours.
Your definition could then break
their program.

Cisf.js solution is to provide
an easy way to wrap any array-instance
such that the wrapper has the method
last():

    let {w, ok} = cisf  ;
    let last = w([1,2,3]).last();
    ok (last === 3);

Above is almost as short as "[1,2,3].last()"
would be.

But at the same time w() will add
other methods to arrays, and different
versions of such methods for different
types of wrappees. The current set
of things w()  can do are shown
in the next excerpt from the file
cisf/test.js:


    // LAST, FIRST, CAR, CDR:
    let a = [1,2,3];
    ok (w(a) . last()  === 3);
    ok (w(a) . first() === 1);
    ok (w(a) . car()  === 1);
    eq (w(a) . cdr(), [2,3]);

    // MAP AN ARRAY LIKE ORDINARILY:
    // Point is this allows you to treat
    // arrays and objects with the same
    // piece of code without you knowing
    //
    eq (w(a).map (e=>e+1), [2,3,4]);


    // MAP AN OBJECT TO LOOP OVER ITS KV-PAIRS:
    let ob  = {a:22, b: 33};
    let kvs = w(ob).map
    ( key  =>  key + ob[key]
    );
    eq (kvs, ["a22", "b33"]);



    // MAP A STRING TO LOOP OVER ITS CHARS:
    let asciis = w("ABC").map (e=>e.codePointAt(0));
    eq (asciis, [65, 66, 67]);



    // MAP A NUMBER TO REPEAT  N times:
    // (return the indexes as array)

    let digits = w(10).map (e=>e);
    eq (digits, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);



    // WRAP A FUNCTION TO PRODUCE A SERIES:
    //

    let wf     = w (a=>a*10);
    let series = wf.map (5, 3) ; // (firstArg, howManyResults)
    eq (series, [50, 500, 5000]);

    eq (wf.map (), [0,0,0,0,0  ,0,0,0,0,0]);
    // The default for first arg is 0 and the
    // default for how many is 10. So if we
    // multiply 0 by 10 ten times we get an
    // array of 10 0s.

    // Create an array of 10 1s:
    eq ( w(_=> 1).map()
     , [1,1,1,1,1, 1,1,1,1,1]
     );

    // Create an array of 3 xs:
    eq ( w(_=> 'x').map( 0, 3)
     , ['x', 'x', 'x']
     );


    // WRAP A BOOLEAN TO GET KEYS WHICH ARE TRUTHY OR FALSY:

    let truthyIndexes
     = w(true).map ( [1, 0, 2, false, null, undefined, ""] ) ;
    eq (truthyIndexes, [0,2]);

    let falsyIndexes
     = w(false).map ( [1, 0, 2, false, null, undefined, ""] ) ;
    eq (falsyIndexes, [1,3,4,5,6]);

    let valuesWithProperties
     = w(null).map ( [1, 0, 2, false, null, undefined, ""] ) ;
    eq
    ( valuesWithProperties
    , [1,0,2,false,""]
    );
    let classes = valuesWithProperties.map(e=>e.constructor);
    eq
    ( classes
    , [Number, Number , Number, Boolean, String]
    );

    // WRAP A REGEXP TO FIND ALL ITS MATCHES.
    //
    // The 1st arg to map is a string to
    // find the matches in, not a function.
    // This because regexp kind of is a
    // function itself.

        eq ( "Get My UPPer-Case-Letters".match(/[A-Z]+/g)
             , ['G', 'M', 'UPP', 'C', 'L']
             );

    // Above shows that using plain match() with
    // -g-flag does give you all matched strings.
    // But it does NOT give you the match-Objects
    // so  the information match-locations and
    // matched groups are lost. So for instance
    // if you wanted to replaces the matches with
    // your own algorithm that depends on all
    // matches found and their locations you could
    // not do that simply.

    let ups  = w ( /[A-Z]+/
               ).map ("Get My UPPer-Case-Letters"
                     );
    ok (ups[2][0] === 'UPP');

    // Note w(regExp).map() always adds the g-flag
    // to a copy of the argument-regexp so it will
    // find all matches, not juts the first. If you
    // add 'g' yourwself it has no extra effect. You
    // can add other flags like 'i' for instance and
    // have them take effect.
    return;


#### 4. Tests
The file test.js in the same directory as CISF.js
contains the tests to run on Node.js.
The file cisf/test_browser.html contains the
tests to run on the browser. Simply open
it in your browser to run the tests in it.


   
   
#### 5. What does CISF mean?

CISF stands for **"Canary In Software Factory"**.
The idea is that CISF assertions do a
similar job for your code as canaries do
for coal-miners. They give an early warning
if your assumptions about the context your 
program is working in are incorrect.  

In a coal-mine you would of course make the
assumption that air is good to breathe.
The canaries you put into the mine would
tell you it is so by staying alive. If Cisf
assertions fail, it is like a canary dying.
Something is wrong. A Canary stopped singing.

Putting Canaries into a coalmine is an
investment, there is a cost associated
with it.
But it is a small investment compared
to the cost of detecting that something
is wrong too late.




#### 6. License
SPDX-License-Identifier: Apache-2.0




