# CISF.js
Support for **Simple Runtime Assertions** 
in JavaScript.
 
CISF.js allows you to add type-checks to your 
JavaScript code  by using plain old pure JavaScript. 
No transpiling to JavaScript is needed, since you
do it all in JavaScript.

Adding CISF.js to your platform could be thought
of as using "TypeScript Light", simpler and
easier to learn and unobtrusive to use, with
no effect on your tool-chain. It might be  
useful even when used from within TypeScript.

  
#### 1. INSTALLATION
    npm install cisf
    
#### 2. REQUIRING

##### 2.A) With Node.js

    const { ok, not, x, is, fails, Type} 
    = require ('CISF');

The module CISF.js exports an object
with 6 methods shown above. But you 
can  easily take in just the functions
you want to use with the ES6 destructuring
assignment. For instance:

    const { ok, x }  = require ('CISF');

might be what you will mostly use.

##### 2.B) With  browser

If CISF.js detects it is not
running in Node.js it stores its API-functions
into the global variable "CISF" which you
can then access like shown here from within an
HTML-page:

    <script src="CISF.js"></script>
    <script> let {ok, not, x, fails, is, Type} = CISF;
    </script>



SEE: **test_browser.html** which does the
above and then runs all CISF-tests 
within the browser. So to
check whether it runs on your browser 
open 
**test_browser.html** in it. Seems to work on latest versions of Edge, 
FireFox and Chrome but not in IE-11. 

#### 3. API  

##### ok (aBoolean)
 
 ok() takes a boolean condition
 as argument and throws an error
 if that is not "truthy".
 
    ok ({});
    ok ([]);
    ok (ok (true) === true) ;                
    ok (ok ("non-empty string") === true);
    ok (ok (1) === true) ;
    
    fails ( _ => ok()           ); 					
    fails ( _ => ok (undefined) );
    fails ( _ => ok(false));


##### not (aBoolean)
not() returns true if ok()
would cause an error, and causes
an error if ok() would not cause an error.

    not (0);
    not ("");
    not ("false");
    fails ( _ => not (true));


#####x (value, Type)

 x() takes two arguments, a value and
 a "type" and throws an error
 if the 1st argument is not of the 
 type specified by the 2nd argument. 
 
 If x() does not fail it returns its
 first argument, which is useful
 so you can use it within an
 assignment for instance.
 
 If there is no 2nd argument x() 
 fails if it is called with null
 or undefined or no argument at all.
 This usage let's you know if the 
 first argument is something from
 which you can ask its constructor.
 
 x() can take more than one type-argument.
 If so if any of them accepts as the
 first argument x() passes.
 
    ok (x ("")      === ""   );
    ok (x (false)   === false);
    ok (x (true)    === true );
    fails (_=> x (null));
    fails (_=> x (undefined));
    fails (_=> x ());
  
    ok (x ("s", String) 	    === "s" );
    fails (_=> x ("s", Number));
    ok (x ("s", Number, String) === "s" );
 
  How the 2nd argument is interpreted
  as a type depends on its type. The
  basic case is just providing one or
  more constructors as arguments as
  above. For more advanced usage see
  the test.js -file. It shows how you 
  can define yous own  custom "types".
  
  
##### is (value, Type)
it() returns true if x() called with the
same arguments would not fail, and false
otherwise:

    ok  (is (123, String) === false);
    ok  (is (123, Number) === true);

##### fails (aFunction)
Above you have already seen use of fails().
It assumes it is callwed with a function
as argument which it will call without
arguments. If the argument function throws
an error fails() returns true, else it
causes an error.

fails() may not be the most often used
ubn runtime code but it is useful when writing
tests of functions which we know will fail
under ceratin conditions.  It is good to tell
the users of your API what are some such
cases.

    fails ( a => throw "");
    fails ( b => fails ( a => 123));


##### Type ()
Type is a constructor for creating new "sum types"
out of existing types. It is especially useful
for declaring that something is EITHER
a value of specific type or it is null.

    let NumberOrNull = new Type (Number, null);
    x( 123      , NumberOrNull);
    x( null     , NumberOrNull);
    x( undefined, NumberOrNull);
    fails (e=> x("s", NumberOrNull))

Note, null used as the 2nd argument
accepts  null or undefined as the actual
value. See test.js.




#### 4. Tests
The file test.js in the same directory as CISF.js
contains the tests which in effect specify what 
CISF functions do in particular. 

tests.js is the de facto "User's manual 
for CISF". Not too long.
   
   
#### 5. What does CISF mean?

CISF stands for **"Canary In Software Factory"**.
The idea is that CISF assertions do a
similar job for your code as canaries do
in coal-mines. They give an early warning
if your assumptions about the context your 
program is working in are incorrect.  

In a coal-mine you would of course make the
assumption that air is good to breathe, 
the canaries would tell you it is by
staying alive. If CISF assertions fail
it is the equivalanet of a canary dying.




#### 6. License
SPDX-License-Identifier: Apache-2.0

