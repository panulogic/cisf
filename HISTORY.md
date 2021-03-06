# cisf.js release notes


For information about future releases
follow https://twitter.com/ClassCloudLLC.


##### v. 5.0.0:  w({}).map() usable with library functions

Small and slightly backwards incompatible
change to the arguments of w().map() when
looping over Objects.

The test for the changed behavior in test.js i
s as follows.

// WRAP AN OBJECT TO LOOP OVER ITS KV-PAIRS:

    let ob  = {a:22, b: 33};

    let kvs = w(ob).map
    ( ([k, v])  =>
      {  return k  + v;
      }
    );

    eq (kvs, ["a22", "b33"]);

In previous versions the argument
passed to the function given as
argument to map() was simply the
key. In the new implementation it
is an array of two elements, the key
and the value, of each "entry" in
the argument-object we are mapping
over.

Why doe sit matter? IOn the previous
version the function given as argument
to map() had to be in the same scope
as the call to mapo(), because in order
for it to do anything with the key it
got as argument, it had to refer to
the object whose key it was. Thus
in the old implementation the test-section
above was:

    let kvs = w(ob).map
    ( key  =>
      {  return key + ob[key];
      }
    );

See, the arrow-function had to
REFER to the 'ob' it is iterating
over.

The new implementation measn that the
function you give as argument to
w({}).map() can be a function that
comes form a library. It need not
have the obvject it is iterating over
in the same scope.

So this is a one small step for cisf,
but it does mean if your code relies
on the old behavior  of w({}).map(),
to bneed to updated your code. We
apologize not having this change
already in place in the eqarlier
versions. To make old compatible
with the new version observe that
the old version really was simply
iterating over the KEYS of the object,
which you can get at with Object.keys({}).

Note, this is the ONLY change
made for Cisf version 5.0.0.


##### v. 4.6.0: r.rel() optional 2nd argument added

If given the 2nd argument to r.rel()
specifies a custom base-path to use
instead of process.cwd()  relative to
which the relative paths returned by
r.rel() are relative to.

Tests added to test.js:

    // 2nd OPTIONAL ARG CAN SPECIFY A BASE
    // FOR CALCULATING THE RELATIVE PATH:

    let rel = r.rel ;

    ok ( rel ( cwd ) === ".");
    let SEP = $path.sep ;

    let customCwd = $path.join     (cwd, "../");
    let cwdName   = $path.basename (cwd);

    ok ( rel (cwd, customCwd )  ===  "."  + SEP + cwdName);

    ok ( rel ("/a/b", "/a/b/c") ===  ".." + SEP  ) ;
    ok ( rel ("/a", "/a/b/c"  ) ===  ".." + SEP  + ".." + SEP) ;
    ok ( rel ("/a/b/c", "/a"  ) ===  "."  + SEP  + "b"  + SEP + "c") ;


    // Custom cwd does not affect the rel() -result
    // IF 1st arg is already relative:

    ok (rel ("abc", customCwd      ) === "abc");
    ok (rel ("./abc" , customCwd   ) === "./abc");
    ok (rel ("../abc", customCwd   ) === "../abc");
    ok (rel ("./../abc", customCwd ) === "./../abc");



##### v. 4.5.1: Updated README.md

##### v. 4.5.0: Fixed is(), expanded isNot()


###### A) Fixed is() null-type behavior

A fix  for is() and
correspondingly to isNot()
means that now:

    ok  (is (null     , null));
    ok  (is (undefined, null));

    not (isNot (null     , null));
    not (isNot (undefined, null));

That makes sense, right? The main
reason for the change was that above
behavior now agrees with:

    x(null, null)
    x(undefined, null)

See test.js test-function for is().


###### B) xNot() now more proper negation of x()

xNot() called without arguments no longer
fails, because x() called without arguments does.

So xNot() is now more properly the negation
of x(). Also if there are multiple type-arguments
given to xNot() it fails is any of them accepts
the value argument as its member.

See test.js section for xNot() .


###### C) Clarifying test for Object-Types

New tests fo ObjectType mroe clearly
show what it measn to be an instance
of ObjectType, the value must have
all the fields declared with correct
types of values, but it can have more.

This simply says that a value must
have ALL REQUIRED FIELDS, with correct
types of values.

    let Person =
    Type ({ name: String
          , age : Number
         });

    let bob = {name:  'Bob', age: 3.14};
    x  (bob, Person);
    ok (is (bob, Person));

    let bob2
    = { name  : 'Bob'
      , age   :  3.14
      , hobby : 'math'
      };

    x  (bob2, Person);
    let notPerson
    = { name  : 'Bob'
      };
    xNot (notPerson, Person);

    let notPerson2 =
    { name: 56
    , age : 3.14
    };
    xNot (notPerson2, Person);


##### v. 4.4.0:  Better Paths

###### A) RELATIVE PATHS

cisf.r.rel() now produces the relattive
path of its argument relative to process.cwd()
also when the argument-path is
not under process.cwd(), as shown by these
tests taken from test.js:

    const {r} = rquire("cisf");
    let rel   = r.rel ;
    let abs   = r.abs ;

    let pathBelowCwd  =  $path.resolve ("./abc");
    let pathBelowCwd2 = $path.resolve (rel (pathBelowCwd) );
    ok (pathBelowCwd2 === pathBelowCwd) ;

    let pathAboveCwd  = $path.resolve ("../abc");
    let pathAboveCwd2 = $path.resolve (rel (pathAboveCwd) );
    ok (pathAboveCwd2 === pathAboveCwd) ;


###### B) $fs and $path as ALIASES FOR path and  fs

In previous version of cisf you could easily
get access to Node.js built-in modules 'fs'
and 'path' with:

    let {path, fs} = require ("cisf");

In 4.4.0 they can also be accessed as:

    let {$path, $fs} = require ("cisf");

This is helpful because you often have
an argument or local variable you want to
name 'path'. Now you can, and still
refer to the built-in module 'path'
as well with '$path'.

In general we believe that references
to built-in modules like 'path' and 'fs'
are best named in a way that makes
them standaout from ordinary variables.
They are special, so best to name them
specially as well.




##### v. 4.3.2:  Better debugging

If you now execute

    x (123, Object);

while debugging, it will  halt
in the debugger before
throwing the error. Previously
it would just throw the error.

Note: You may need to configure your
IDE or Node.js debugger so that
it does "step into library scripts",
because most likely you will have
cisf.js in your node_modules -folder.





##### v. 4.3.1:  Better README.md

The Motivating Example now acknowledges
the fact that you can not ask for
constructor of null or undefined:

    if ( arg !== null               &&
         arg !== undefined          &&
         arg.constructor !== Number &&
         arg.constructor !== String
	   )
	  { throw "not number nor string";
	  }

The Motivating Example is what you __don't__
want to be writing repeatedly.
Cisf greatly simplifies the above to:

     x (arg, Number, String);




##### v. 4.3.0: Error only if there is an error-message

    err (null);
    err ();
    err (undefined);

  In v. 4.3.0 the above 3 no longer
  cause an error at all.

  That is very useful when using
  Node.js async APIs because their
  callbacks are called whether there
  was an error or not. So now you can
  write the callbacks simply with ES6
  arrow-syntax like this:

    fs.writeFile
    ( path
    , contentString
    , e => err(e)
    );

   The callback above does nothing if
   writeFile() did not cause an error,
   but throws an error if it did.
   Makes your code faster to type
   and easier to read and understand.



##### v. 4.2.0: xNot()

xNot() is the negation of x() except
it must be called with exactly one
argument.

xNot() causes an error unless it is called
with exactly a single argument which is
either null or undefined.

Useful for ensuring that immutable
instance-variables can have only
one value.


##### v. 4.1.0:  Jump to debugger

When an assertion like ok() or x() fails
an error is thrown like in the previous
versions. What is news is the before
the error is thrown if you are debugging
you will halt in the debugger instead
of killing the process and just seeing
the error-message and stack-trace.

So now instead you can inspect the
exatc state of the program when the
error happens, but before the process
is killed. Very useful and measn you
can put in eperimental assertions to
just TEST whether your assumptions
are correct.

Instead of writing:

    if (! condition)
    { debugger;
    }
you can get the same halt into the
debugger with less code:

    ok (condition)

The effect is not exactly the same
for the two code-segements above
AFYER the halt. If condition is falsy
ok() WILL throw an error. if you don't
kill the process yourself before that.

Depending on your IDE
you might be able to configure it
so that every error causes it
to halt in the debugger if debugging.

But sometimes you don't want to
stop in the debugger - when you
are callling fails() to show to
yourself and others that something
causes an error. You would typically
do that in your tests.


##### v. 4.0.3:  Link to online documentation

The presentation given at NYC Node.js
summit July 18 2018 is now online at:
https://panulogic.github.io/cisf/doc/index.htm



##### v. 4.0.2: Refactored Type-Tests

Refactored the test-function 'Type()'
into multiple inner functions one per
the type of Type being tested.

If you view the code in an IDE that
allows you to see a listing of
functions in the file this helps
when you want to look up the
behavior and thus the de facto
definition  of a given type of type.

The inner test-functions of Type()
are now:

1. ArrayType
1. BiggerOrEqualType
1. ConstructorType
1. DependentType
1. EmptyType
1. EqualsType
1. FalsyType
1. FunctionType
1. MultiDArrayType
1. NullType
1. ObjectType
1. PredicateType
1. RegExpType
1. StartsWithType
1. SumType
1. TruthyType
1. xMiscTypeTests

Tests run on Node, FireFox Chrome and Edge
except ...

KNOWN ISSUE:
Do not use  w(RegExp) on Edge-browser.
The tests for w(RegExpo are disabled
when ruiinning on a browser. See the
code in test.js.


##### v. 4.0.1: Better log()

The API-function log() prefixes its output
with a time-stamp which helps to
see how long some operations take.

In 4.0.1 the format of the time-stamp
is changed so the milliseconds-part
is no longer separated by a space but
by ':' like the other parts of the
time-stamp.

This makes it clearer that the milliseconds
are part of the time-stamp, not part of the
message being logged.

The log-entries now look like this:

    13:52:10:684 Test-method log() executed


#### v. 4.0.0: Truthy and Falsy Types

This version does away with the "shorthand types"
for Number String and Boolean. They were confusing
because they statements like:

    x(true, false);

In 4.x you muste express what the above meant
in 3.x as:

    x(true, Boolean);

This means 4.x is not fully backwards comptible
with versions 3.x and therefore the major
version-number was bumped up to 4.

The main reason for the change is that
now numbers, strings and booleans
can  be usedfor new ways
of expressing types in Cisf 4.x.

Most
significantly we can now have the
"TruthyType" which means that the
allowed argument-types of ok() and
not() can be declared using
cisf itself. ok() and not() are
now written like this:

    function ok (arg)
    { x (arg, true);
    }

    function not (arg)
    { x (arg, false);
    }


Using the newly available semantic space
v. 4.0.0  can now provide
five (5) new types of types:

##### TruthyType:

Using true as a type-specifier creates
a type who memebers are all "truthy"
values of JavaScript, meaning anything
except false, null, 0, "" or undefined:

    x (-1  , true);
    x ("s" , true);
    x (true, true);
    x ({}  , true);
    x ([]  , true);
    x (x   , true);

    fails (_=> x (0    		 , true));
    fails (_=> x (""   		 , true));
    fails (_=> x (false		 , true));
    fails (_=> x (null 		 , true));
    fails (_=> x (undefined, true));

In JavaScript there is often little
need to use pure Boolean values since
all truthy values behave in most ways
the same as true. Falsy values
behave like false, for instance as
operand of if -statement.

Instead of returning false it
shortens code if you return nothing.
But whosever check the type of such
a result muts then allow for the
fact that it might be false, or
undefined, or null etc. Truthiness
and Falsyness is very much built in
to JavaScript so its best to have
types for truthy and falsy.


##### FalsyType:

Using false as a type-specifier creates
a type whose instances are
false, null, 0, "" and  undefined:

    x (0                , false);
    x (""               , false);
    x (false            , false);
    x (null             , false);
    x (undefined        , false);

    fails (_=> x (1     , false));
    fails (_=> x ("s"   , false));
    fails (_=> x (true  , false));
    fails (_=> x ({}    , false));
    fails (_=> x ([]    , false));
    fails (_=> x (x     , false));


##### RegExpType:

    x       ('A'  , /A/);
    x       ('bAb', /A/);
    x       ('A'  , /a/i);
    fails   (_=> x ('a' , /A/));
    fails   (_=> x ('bb', /A/));
    fails   (_=> x (''  , /A/));

Using a RegExp as a type-specifier
makes it easy to say something must
match a RegularExpression. The
wolloginc two are equal but using
x() is shorter:

    'A'.match(/A/)

    x('A',/A/)

The RegExp type also first always
converts its argument to String
which measn it can be used with
other types of arguments:

    x (5, /\d/);
    fails (_=> 5 . match(/\d/));

##### StartsWithType:

RegExp type can be used for checking
that a string starts with a certain prefix,
if you know how to write such a RegExp
(use '^'). But since testing for a prefix
is quite common  that can now be done by
using an unboxed string as type-specifier:

    x ("abc", "");
    x ("abc", "a");
    x ("abc", "ab");
    x ("abc", "abc");

    fails (_=> x ("Abc", "a"));
    fails (_=> x ("", "a"));


##### BiggerOrEqualType:

Using an unboxed number as type-specifier
creates atype whose instances are all numbers
equal or bigger than the type-specifier::

x     ( 0, 0);
x     ( 0.001, 0);
fails (_=> x ( -0.001, 0));





##### v. 3.1.6:
Improved tests

##### v. 3.1.5:
Added API-functions
* isNot ()
* isEq  ()
* isNeq ()

This makes Cisf-API more symmetric,
you have x(), is(), isNot() and
eq(), isEq(), isNeq()


##### v. 3.1.4:
Updated HISTORY.md.


##### v. 3.1.3:
Updated the browser-tests to have the same code
as Node.js tests in test.js

##### v. 3.1.2:   Type() to convert 2nd arg of x() if needed

 If the 2nd argument of x() does not recognize
 the 1st argument of x() as its instance, we
 try to transform the 2nd argument to a Type
 by calling Type(the2ndArg).

 Same transformation is applied to 2nd argument
 of is() as well.

 Because an unboxed number, string or boolean
 produces a corresponding type when passed to
 Type() as argument this means they can conveiently
 be used as  shorthands for their constructor as
 a type:

      x (0, 1)
      x ("s", "")
      x (true, false)
      x (new Number(5), 1)

So, that makes it unnecessary to type Number and
String too many times. Shorter is better

The next fails because new Number(5)  is not
a valid argument of Type() - because Type()
has specific rules of how it interprets its
arguments of type "object", it allows
{}, [], and specifc types of functions
as its argument.

  fails (_=>  x(123, new Number(5) );


If any instanceof Object would be
automatically turned into the type
that is its constructor then a {}
would be turned into Object,  which
as a Type is not the same thing
as the type we create from a {},
which we call ObjectType which checks
field-names and value-types to decide
is some value is an instance of it.



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
