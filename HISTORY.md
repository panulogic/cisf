# cisf.js release notes

Latest build is v.3.0.5.
For information about future releases
follow https://twitter.com/ClassCloudLLC.


##### v. 3.1.1:  Removed limits on log-entry size
In previous versions the size of log-entries
was 2k or so. The idea was to prevent some
error-messages from bloating up the log.
But we realized that meant some information
could be lost, so no more artificial limits
on log-entry-size.


##### v. 3.1.0: w()

w() is a new API in 3.1.0. "w" stands for
"wrapper".  This API was inspired by
the question how best to access the
last element of an Array. We know it
would be nice if there was a built-in-method
of Array.prototype called "last()"
but there isn't.

You could add to
Array.prototype but problem is
what somebody else's program
might have their own definition of
last() which differs from yours.
So your definition could break
their program.

The cisf.js solution is here:

    let {w, ok} = cisf  ;
    let last = w([1,2,3]).last();
    ok (last === 3);

So w() creates and easy-to use wrapper
around arrays which allows you to
easily ask for the last element of the
array. Notice above is almost as short
as "[1,2,3].last()" would be.

But at the same time w() will add
other methods to arrays, and different
versions of such methods for different
types of wrappees. The current set
of things you can do with w() are shown
in the next excerpt from the test-file
test.js:



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


##### v. 3.0.5: Better log()

As before log() removes whitespace from the
beginning of NON-empty lines in its argument.
That makes it convenient to format a multi-line
log-message aligned with the code-block it
exists in.

in v.3.0.5 it no longer trims the argument-string
as a whole . Which means you can put empty lines
at the beginning and end of your log-message
if you want to.

This often makes sense as it allows you
to make specific important log-messages
to stand out from the crowd when inspecting
a long log.

####  Version 3: More Support for Types

This latest version bumps the version
number all the way to 3 because the way
Predicate Types are declared is slightly
backwards incompatible.

There is a new api A() which allows you
to declare the types of your arguments
in a single statement.

**r()** now requires modules interpreting
its argument relative to process.cwd().
It now has two helper methods abs() and rel()
to switch between absolute and relative paths.

The Types support is now complete as far
as we can see. It includes eight (8) types
of types:

1. AtomicType
2. ConstructorType
3. FunctionType
4. PredicateType
5. ArrayType
6. ObjectType
7. SumType
8. NullType

See the test.js for examples of each
ot them can be defined and used.

PredicateTypes of 3.x differ from
version  2.x in that they are now
created  only from
non-Title-cased named functions
In 2.x  also anonymous functions
created predicate-types.
In 3.x anonymous functions create
Function-types, which declare the
argument- and result-types of Functions.

There is also a new API-primitive
"A()" which allows you to check
the types of an array of elements.
This is useful for asserting the
types of arguments with a single
statement. Like this:

    let {A} = require("cisf");

    function funk (n, s)
    { A([Number, String], n, s);
      ...
    }

And two new API-=functions eq() and neq() the ;atter of which is the negative of the former.

eq() tests for field-wise equality
of Objects and arrays. You might not use
it to test your arguments since arguments
ahve always dfifferent values. But it is
useful for writing Unit-Tests, you can
test that two arrays or obejcts carry the
same values.

Example:

         let {eq, neq} = require("cisf");
         eq([1,2,3], [1,2, 2+1]);
         eq ({x:1}, {x:2-1});
         neq ([1], [2]);





#### Pre-3.x Versions:

##### 2.1.1 Fix to x()

A fix was made that allows the following tests,
which were added, to pass:

     x (""   , String);
     x (0    , Number);
     x (false, Boolean);



####  2.1: path(), fs()

Two new api-functions 'path' and
'fs' now come along with require("cisf")
if you are running on Node.js.

Their values are the normal 'path'
and 'fs' a normal require() gives
you on Node.js.

The reason they are now part of
Cisf is that this spares you from
having to require them yourself,
they "hitch a ride" with Cisf:

    let {ok, path, fs} = require("cisf");

See, two less require-statements you would
otherwise need to write.  Of course your
module may not use either 'path' nor 'fs'
in which case you would not include them
but would write something like:

    let {ok, x} = require("cisf");

We added only these two Node.js core-APIs
because our intention is to keep the
cisf-API simple. But in our own work
we find we end up using both "fs" and "path"
in most modules.

Of course you could use this same trick
yourself to import your most frequently
used core modules in a single statement:

    let {http, url} = require("myFavorites");

If there is popular demand we might
consider adding
those and other core-APIs to cisf as well.
The downside is that loadingf them takes
time and memory.  So currently we feel
that just loading 'fs' and 'path'
 with 'cisf' is
a worthy compromise.


####  2.0: Simpler x(), Type(), r()

See the file cisf/test.js.

Cisf version 2 is <b><em>not</em> backwards-compatible</b>
with earlier versions.
But it is much simpler to use and easier to understand.
Most API-functions work the same as before.
Many of the x() type-declaration-options that were present
in previous versions no longer apply.
They were quite esoteric, good riddance.



#### Sinplified x() Type-System
The arguments of x() after 1st must now
all be TYPES -- meaning functions.

NON-title-cased-argument functions are called
with the 1st  argument of x(). If the result
is truthy then the type-check passes.

Title-cased argument-functions are NOT called,
instead they are tested with 'instanceof'.

#### New API-function  'Type()'

x() allows you to test a value
against the disjunction of
multiple types. Type() allows
you to package such a disjuntion
into a new type of its own.

Example:

    const {Type, x, ok} = require("cisf");
    ...
    const NumberOrString = Type(Number, String);
    x  (123, NumberOrString);
    ok (is (123, NumberOrString));

Example 2:

    const {Type, x} = require("cisf");
    ...
    const NumberOrNothing = Type(Number, null);
    x (123, NumberOrNothing);
    x (null, NumberOrNothing);
    x (undefined, NumberOrNothing);

To create arbitrary dynamic types use
non-title-cased functions:

    const {Type, x} = require("cisf");
    ...
    const Odd = Type(n => n % 2 === 1);
    x(123, Odd);

As shown in the above example
you can use **ES6 arrow-functions** to
make the type-declarations quite succinct:

    Odd = Type(n => n % 2 === 1)


#### New API-function 'r()'

'r()' is a shorthand for require.main.require.
It is the best way to load other modules which
are also under development in Node.js.

Example:

    const {r}   = require("cisf");
    let libComp = r ("../lib/someComp");

r() is used like ordinary require but it
interprets relative paths relative
to the directory of the first module
loaded. Typically that is your main
'application'.

Using r() means modules in lower
directory levels
need not refer to upper-level modules
with paths consisting mostly
of  several "../".

If you move a module that uses
r() up or down the file-system the
<b>r()</b> -calls will keep on working
as is. That would
not be the case with standard
'require' that would need to
refer to modules in upper
directories with a fixed
number of "../" -steps.





### History of earlier versions 1.x.x

#### 1.3.6: Better x()
If x() causes an error and
typeof 'this' === "number"
then a debugger -statement is executed.

This is useful if you get an x() -error
and would then like to debug it live to see
the values of variables around the stack-frame
where it happens. To do that call x() like
x.call (123, valueArg, typeArg, ...);


#### 1.3.5: Better log()
Increased the maximum length of
log-messages to 2048, was < 400.

#### 1.3.4: Better err()

Previously if you called err() from within
your error-handler because of some original
error eOrig it logged the stack-trace only
based on the location where you called err().

Now err(e) recognizes that its argument
can be EITHER a string or an instance of
Error. If it is an instance of Error
it will log the stack-trace of its
error-argument, not the stack-trace
of the location where err() was called.

The previous behavior meant that if you
passed an error-instance to err() it
was hard to know from the log where the
real error actually happened.


#### 1.3.3: Improved Error-Reporting

##### Errors inside a call to fails()
Errors which happens inside a call
to fails() are no longer reported
to the console no matter how deep
in the stack they happen.

Previously
this caused some fails() -calls cause
error-output which was confusing,
because the purpose of fails is
not to report errors but to assert
that certain calls will cause errors.

##### Calls to log()
Calls to **log()** now preserve empty
lines in their argument-string.
Like before they still remove empty
space from in front of (now only non-empty)
-lines.

#### 1.3.2: Fixed  x(Array, Array)

Fixed an issue with method x() where

     x(Array, Array));

dir NOT cause an error although it must.
In 1.3.2 it does. The reason it is an error
is that Array is  NOT an instance of Array.

You might have thought x(Array, Array)
should not cause an error because  
x(Function, Function) and  x(Object, Object)
do not cause error. But there is good
reason for that: Every Function in Javascript
IS AN INSTANCE of Object. And
every Function is an instanceof Function.

The fixed behavior is demonstrated
in the test-method: classType ()
whose relavant code is here:

    x (Object, Object);
    // Works  because Object is a Function
    // and all Functions are instances of Object.
    //
    x (Function, Object);
    // Works because Function is a Function
    // and every Function is also an instanceof
    // Object.
    //
    x (Function, Function);
    // Works because  Function is an
    // instanceof Function.
    //
    fails (_=> x (Array, Array));
    // Fails because Array is NOT instacneof Array.



#### 1.3.1: Updated browser-tests

 The tests to run on browser
 in file 'test_browser.html'
were updated to test the
new behavior of x() in Cisf v. 1.3.n .


### 1.3.0: Relaxation of x()

In 1.3 the behavior of x() has been relaxed
so statements like this no longer cause errors:

      x ({a:1}, {b: 2});

This used to cause an error. Why?
Well, the thinking was that
passing in {a:1} as argument when {b:2} was
expected would make no sense and therefore
making such a call would likely be a typo
by the user, which we wanted to
draw the user's attention to.

But, it turns out in
practice it is more useful that x() only checks
that the value has EVERYTHING NEEDED.
It does not matter if it  has more than what
is needed.  You only need what you need, right?

In contrast the code below still
fails, like it should, because the
same field exists in both the value-
and type-argument  but has a different
type of value in each:  

    fails
    ( () =>
      { x ({a:1}, {a: "2"});
      }
    );

As before x() uses fields which
only exist in the type-argument
to produce default values for fields
missing from the value-argument:

    ok (x ({a:1}, {b: 2}).b === 2);
    ok (x ({a:1}, {b: 2}).a === undefined);

Fields which
only exist in the value-arg will be
undefined in the result of x().

Version 1.3.0 is backwards-compatible
with previous version 1.2.4 in that
it causes no more errors than 1.2.4.
Because of the relaxation of x() it
may not cause errors in
every situation where 1.2.4 did.

See the function **mapType()** in the file
**test.js** for updated tests that
demonstrate the behavior described above.


#### 1.2.4: Left-aligned log-messages

Assume you have code like below
in your program. You have taken
extra care to indent the error-message
like it is because you want the
indentation of the code to follow
the level of the statement-block
in which it appears.

But just because the call to err()
is indended several levels to right
it does not mean that is how you
want the message to be indended in
the log. The log-output should not
depend on the indentation-level of
the statement which made the call to
log something. In CISF v.1.2.4 each
line in the log-output will be strictly
on the left edge of the log.

        try
        { "" . thisMethodDoesNotExist ()
        } catch (e)
        { err
          (`This example shows how you
            can write an error-message
            in your code indending it
            like the statement it is
            contained in, yet in the
            log the message will show
            aligned on the left edge
            of the log LIKE ALL OTHER
            log-messages.  

            The log-output should not
            depend on the indentation-level
            of the statement which made the
            call to log something.
        `);
        }

This may seem a like a very minor detail
but somehow I just had to make this change.  
Else I started aligning code like above
to the left edge and I didn't like that
either. Now I'm happy. This


#### 1.2.3: More control over error-messages

Calling err ("some message") will output the
given message to the log followed by the
stack-trace showing where the call to err()
was made.

If the error message is aimed at end-users
you might want to show them just the plain
explanation of what went wrong, without the
stack-trace.

You can do that by binding err() to
"no stack":

    err.call
	("no stack", " user-friendly error -message ...");




#### 1.2.2:  Better Motivating Example
Updated the "Motivating Example" in
README.md, to show how **x()** can be
used to check that its 1st argument is
of the same type as ANY of the
remaining arguments. It now better
shows how using x() makes code
shorter, easier to write (correctly),
and easier to understand (correctly).

Added this test-function in test.js to
test the code of the motivating example:

    function example()
    { let x=this.x, fails=this.fails, ok=this.ok;

      function exA (arg)
      { x (arg, 0, "");
      }

      function exB (arg)
      { if ( arg.constructor !== Number &&
             arg.constructor !== String
           )
          { throw "not number nor string";
          }
      }
      exA (123);
      exA ("s");
      exB (123);
      exB ("s");
      fails (e => exA (true));
      fails (e => exB (true));
      ok (exA (123) === undefined);
    }


#### 1.2.1:  Updated browser-tests

Updated the browser-tests in
test_browser.html to work with
this latest version of CISF.

CISF requires an ES6-compliant
JavaScript engine. Therefpore
latest version of Chrome, FireFox
and Edge will do, but IE-11 not.


#### 1.2.0:  Optional fields with  x()

The behavior of x() was relaxed
so that if the type-argument is
a {} it can have fields which do
not exist in the value-argument,
as long  assuming all common fields'
values are of compatible type.

The fields which
do not exist in the 1st argument but
do in the 2nd are (deep-) copied to
the result of x(). This
now works:

    let o =  x ({a:1}, {a:99, B:3} );
    ok (o.a === 1);
    ok (o.B === 3);


As a consequence the 2nd argument
of x() is now only  interpreted
as a "map-type" if it has exactly
one  field  whose name is'_'.

Next works because
all fields in the value-argument
have a value which is compatible
with the type of the (only) field
'_' in the type-argument:

    x ( {a:1, b:2, c:3}
      , {_: Number}
      );


But the next now fails because
field 'b' of the  value-argument
is not compatible with  the value
of the (only) type-field  '_':  

    fails
    ( _ =>
      { x ( {a:1, b:"2", c:3}
          , {_: Number}
          );
	  }
    );



#### 1.1.7: static new() of Type

 When you now create a type out of an
 instance of Object or Array and then
 ask that type for a new instance of it,
 it returns a DEEP COPY of the
 object from which the type was created.

 This means that if you modify that
 deep copy it will not affect the original
 type-object in any way. That was the case/bug
 in previous version.

 Demonstration of new behavior:

    let ob     = {a: {b: new Object }};
    let ObType = new Type (ob);
    let ob2    = ObType.new();
    //
    ok (ob .a.b.constructor === Object);
    ok (ob2.a.b.constructor === Object);
    ok (ob.a.b  !== ob2.a.b );


#### 1.1.6:  toString() of composite types

The toString() of composite types now returns
a string telling the component-types. This helps
when debugging your program and trying to
figure out why a type-check perhaps didn't pass.

Example:

	let BooleanOrNumber = new Type (Boolean, Number);
	ok (BooleanOrNumber.toString() === "Boolean | Number" );


#### 1.1.5: API-functions log(), warn(), err()  

1.1.5 Adds three simple utility functions
 log(), warn(), err()  to do more
 **instrumentation**
of your program.  Even though it would
be trivial
to implement these functions on your own
it helps to get them automatically
as part of importing the CISF -package.

Because they are used so frequently
even small savings in code
you are required to type
over the built-in versions (like
"console.log()") will
accrue over time.

The functions' test-methods below show
examples of using them:

##### log()

    function log ()
    { let  ok=this.ok, log=this.log;
      let s = log (`Test-method log() executed`);
      ok (s.match(/Test-method log\(\) executed/));
    }

log() is a simple logger-method that comes as
part of the CISF -package. Instead of writing
"console.log('some msg')"
you can more succinctly write:
"log('some msg')" .

log() also adds to the log-message the current
millisecond which may be helpful for measuring
performance of some operations.



##### warn()
    function warn()
    { let ok=this.ok, warn=this.warn;
      let s = warn (`Test-method log() executed`);
      ok (s.match(/WARNING:/));
    }

 warn() is the same as log() except
 it adds the prefix "WARNING: " to the
 log-message so you don't have to.
 This makes the more critical warning-
 messages easier to spot from the logs
 apart from the rest of the less critical
 log-messages.


##### err()


    function err()
    { let ok=this.ok,err=this.err, fails=this.fails;
      let e  = fails ( _=> err ('something wrong') );
      let e2 = fails ( _=> err ('wrong type', TypeError) );
      ok (e.stack);
      ok (e.stack.match (/something wrong/));
      ok (e.constructor.name === "AssertError");
      ok (e2.message.match (/wrong type/));
      ok (e2.constructor.name === "TypeError");
    }


**err()** is a simple utility to throw an
error of default or chosen error-class. Instead of writing:

     throw 'error-message';
you can write:

     err ('error-message');

This does not save you
many key-strokes but calling a function
instead of a built-in keyword has
its benefits:


A) err('some string') turns its argument
into an instance of Error before throwing it.
This means the log will show not only
the error-message but also the stack of
the calls that lead to the error.

B) You can assign 'err' to an even shorter
variable-name:

       let e = err;  e('something wrong')

C) You can pass it (or something else)
as argument to functions:

       doSomething (something, err);

D) You can replace it with your own function
 which takes you to the debugger if an
 error happens. Or which ignores some
 specific error-messages altogether.

Using err() gives you the control of
what should happen under which error-
conditions, while providing a reasonable
default behavior for it.


#### 1.1.4: Custom log-messages for ok(), not() and x()  

You can set a custom failure-message
for **ok()** and **not()**, to be shown on the
log if they fail, by passing the error-string
as 2nd argument to them:

    ok  (n > 0, `n is not   > 0: ${n}`);
    ...
    not (m < 0,  `m is not  < 0: ${m}`) ;

You can do a similar thing with x() but
there you must "bind" the error-message
to x() because x() takes 1 + N arguments
to start with. So you could call:

    x.call
    (`n IS NOT NUMBER OR null: ${n}`
    , n, Number, null)
    );


#### 1.1.3:  Map-type  
Updated package.json to reflect the
current version-number.

#### 1.1.2:  Map-type  
Improved documentation.

#### 1.1.0:  Map-type  

**mapType:**
'mapType' is a {} with one or no keys in it.

  A {} with zero keys matches any value whose
  constructor is Object. This behavior is
  similar to how a [] with no elements matches
  any array.

  A {} with exactly one key matches any value
  whose constructor is an Object and whose values
  are all of the same type as the value of the
  only field of the type-object.  

  A Map-type  differs from Object-type in the same
  way as an Array-type differs from Tuple type:

  Both Object-type and Tuple-type have a fixed
  number of fields whose values can be of different
  types.

  Map-type and Array-type allow arbitrary number of
  fields in the value but their types must be all
  the same.

Examples (from test.js):

    ok (x ({a:1}, {} ));
    ok (x ({zzz:3}, {} ). zzz === 3);

    ok ( x ({a:1}, {any: 2}
           ).a === 1
       );

    x ( {a:1, b:2, c:3}
      , {any: Number}
      );

    x ( {}
      , {any: Number}
      );

    fails
    ( _ =>
	   { x ( {a:1, b:"2", c:3}
        , {any: Number}
        );
		}
	);


#### 1.0.8:  Instantiable Types
The type-constructor-function Type()
was extended so that the types it
creates now have the (static) method new()
which returns the default instance
for the type.

For types with multiple component-types
the first component-type produces the
default instance.

    ok ((new Type(Number))  .new() === 0);
    ok ((new Type(1))       .new() === 1);
	ok ((new Type(2, null)) .new() === 2);
	ok ((new Type(null, 1)) .new() === null);

 The main use-case for instantiable types
 could be to declare the
 instance variables, their types and
 default values for a class.  

#### 1.0.7: First Release  
First Release. See README.md
