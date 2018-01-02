# Release Notes for CISF.js



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
 messages easier to spot form the logs
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
Thich means the log will show not only
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
 

