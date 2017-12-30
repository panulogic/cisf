# CISF.js
Support for **Simple Runtime Assertions** 
in JavaScript.
 
CISF.js allows you to add type-checks to your 
JavaScript code  with minimal syntax. 
No transpiling to JavaScript is needed since you
do it all in JavaScript.

Adding CISF.js to your platform is like
using "TypeScript Light", simpler and
easier to learn and unobtrusive to use, 
with no effect on your tool-chain. 

#### 0. MOTIVATING EXAMPLE

If you want to make sure you get
an early warning whenever your 
function is called with a wrong
type of argument, you might write
something like this: 

    if (typeof arg !== "number") 
    { throw "arg is not a number"
    }
 
 Using CISF you can write it more simply as:
 
    x (arg, 1)
 
 x() checks that its first and 2nd argument
 are of the same type.
 
 You are more likely to put such checks
 into your code when they are easy
 to write and easy to read. This
 in turn means that errors are caught
 early and thus their root-cause is
 easy to identify early on.
 
 
 
#### 1. INSTALLATION
    npm install cisf
    
#### 2. REQUIRING

##### A) With Node.js

    const { ok, not, x, is, fails, Type} 
    = require ('CISF');

The module CISF.js exports an object
with 6 methods shown above. But you 
can  easily take in just the functions
you want to use with the ES6 destructuring
assignment. For instance:

    const { ok, x }  = require ('CISF');

might be all you will mostly use.

##### B) With  browser

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
not() returns true if ok()
would cause an error, and causes
an error if ok() would not cause an error.

    not (0);
    not ("");
    not ("false");
    fails ( _ => not (true));


##### 3.3  x (value, Type)

###### 3.3.1  Two arguments
 x() is typicallly called with
 two arguments, a value and
 a "type":
  
  x (123, Number) 

  How the 2nd argument is used 
  as a "type" depends on its kind. The
 most obvious case is using a constructor
 as 2nd argument like above.  But it 
 can also be a _value that is of the same type_
 as the 1st:
 
    x (123, 1);  // shorter to write '1' than 'Number'
 
 
 
 x() throws an error
 if the 1st argument is not of the 
 type specified by the 2nd argument. 
 We can use our API-function "fails()"
 to show this happens:  
   
    fails (_=> x ("s", Number));

 
     
######  3.3.2  Result of x() 

If x() does _not_ fail it returns its
 first argument, which is useful
 so you can use it within an
 assignment for instance:
 
    ok (x ("s", String) 	    === "s" );

    ok (x ("")      === ""   );
    ok (x (false)   === false);
    ok (x (true)    === true );
    
###### 3.3.3 Only one argument
 If called with only one argument x() 
 fails if it is called with null
 or undefined or no argument at all.
 
 This usage let's you know if the 
 first argument is something from
 which you can ask its constructor:
 
    fails (_=> x (null));
    fails (_=> x (undefined));
    fails (_=> x ());
  
   
 ###### 3.3.4  More than 2 arguments
 x() can take more than one type-argument.
 If any of them accepts the first argument 
 as a  compliant value then x() succeeds:  
 
    ok (x ("s", Number, String) === "s" );
 
  
  For more advanced usage see
  the **test.js** -file. It shows how  
  for instance how you can define 
  your own  "custom types".
  
  
###### 3.3.5  Special case type-arguments
Depending on the type of the 2nd and
further argument the "type-check"
can mean different things than 
what it means for constructors.

For instance if the type-argument
is an **arrow-function** it means it
gets called with the 1st argument
as its argument. If the arrow-function
returns true x() passes, else not.

The special cases are best
explained by the test-cases code in
test.js. The simplest is 
to use only constructors as type-
arguments, their behavior is 
"obvious". 

One caveat is in order: 

    x (123, Number)

succeeds even though technically
123 is not "instanceof" Number.
But as far as x() is concerned 
it is "of type" Number as far as.
That just makes more sense to us 
intuitively.

 
   
##### 3.4 is (value, Type)
is() returns true if x() called with the
same arguments would not fail, and false
otherwise:

    ok  (is (123, String) === false);
    ok  (is (123, Number) === true);

##### 3.5 fails (aFunction)
Above you have already seen use of fails().
It assumes it is called with a function
as argument which it will call without
arguments. If the argument function throws
an error fails() returns true, else it
causes an error.

fails() may not be  used much
in runtime code but it is useful when writing
tests for functions we know should and will fail
under certain conditions.  It  is good to tell
the users of your API what such
cases are.

    fails ( a => throw "");
    fails ( b => fails ( a => 123));


##### 3.6 Type ()
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




