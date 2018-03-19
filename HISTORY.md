# "Cisf" release notes  

For future information about future releases
see https://twitter.com/ClassCloudLLC 


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
 

