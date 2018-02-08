/**
Copyright (c) Panu Viljamaa 2017.  
SPDX-License-Identifier: Apache-2.0
*/
let testee = require ("./CISF");

example         	.bind 	(testee)(); 
log             	.bind 	(testee)(); 
warn            	.bind 	(testee)(); 
err             	.bind 	(testee)(); 
customMessages  	.bind 	(testee)(); 
ok              	.bind 	(testee)(); 
not             	.bind 	(testee)(); 
fails           	.bind 	(testee)(); 

// Tests for testee-method x(): 
mapType         	.bind 	(testee)(); 
objectType      	.bind 	(testee)(); 
sumType         	.bind 	(testee)(); 
zeroArgs        	.bind 	(testee)(); 
oneArg          	.bind 	(testee)(); 
atomicValueType 	.bind 	(testee)(); 
undefinedType   	.bind 	(testee)(); 
nullType        	.bind 	(testee)(); 
instanceType    	.bind 	(testee)(); 
arrayType       	.bind 	(testee)(); 
tupleType       	.bind 	(testee)(); 
classType       	.bind 	(testee)(); 
functionType    	.bind 	(testee)(); 
predicateType   	.bind 	(testee)(); 
selfRefType     	.bind 	(testee)(); 
is              	.bind 	(testee)(); 
Type            	.bind 	(testee)(); 
		
console.log("");
console.log ("_lib/CISF - All tests passed. ");
console.log("");
return;


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
  return;
}

/**
 This example shows how you can
 verify that  a function is called
 either with a number or a string
 as argument but nothng else.

The function exA() shows how you
 do that with CISF API "x()":

x (arg, 0, "") causes an error if
 its first argument is not of the
 same type as any of its remaining
 arguments. x (arg, 0) would cause
 an error if the arg is not a number.

The function exB() shows how you
 can do that WITHOUT x(), showing
 how the code to check that the
 argument is either a number or a
 string gets much longer. exB()
 takes longer to type and longer
 to type correctly and longer to
 understand making your code as
 a whole less "readable".

The point here is not only that
 shorter code which does the same
 as longer code is always better
 for the reasons mentioned.

It is that if type-checks are as
 complicated as in exB(), you are
 unlikely to put such checks into
 your code. And if you do it is
 much easier to have a bug in them
 or misunderstand what they dop when
 reading them. Most devious kind of
 bug? It is when you have a bug in
 your error-checking code.

The code above also demonstrates
 the usefulness of two other CISF API
 -functions,  fails() and ok().

fails() is a function which takes a
 function as argument and causes an error
 if calling the argument function does
 not cause error. So, it verifies
 that its argument-function causes an
 error. We will use a lot of it in
 other tests just to show the cases
 in which CISF API functions cause
 errors. Most of them are MEANT to
 cause an error if the thing they
 are checking is not like it should.

ok() causes an error if its argument
 is not "truthy", meaning anything
 except false, null, undefined, 0 or "".

In your runtime code you would mostly
 use ok() and x(), but in your tests
 (like above) you might find fails()
 useful too.
*/

/* ----------------------------------------- */

function log()
{ let  ok=this.ok, log=this.log;
  let s = log (`Test-method log() executed`);
  ok (s.match(/Test-method log\(\) executed/));
}

/**
 log() is a simple logger-method that comes as
 part of the CISF -package. Instead of writing
 "console.log('some msg')"
 you can more succinctly write:
 "log('some msg')" .

log() also adds to the log-message the current
 millisecond which may be helpful for measuring
 performance of some operations.
*/

/* ----------------------------------------- */

function warn()
{ let ok=this.ok, warn=this.warn;
  let s = warn (`Test-method warn() executed (to test API-function 'warn()').`);
  ok (s.match(/WARNING:/));
}

/**
 warn() is the same as log() except
 it adds the prefix "WARNING: " to the
 log-message so you don't have to.
 This makes the more critical warning-
 messages easier to spot from the logs
 apart from the rest of less critical
 messages.
*/

/* ----------------------------------------- */

function err()
{ let ok=this.ok,err=this.err, fails=this.fails;
  let e  = fails ( _=> err ('something wrong') );
  let e2 = fails ( _=> err ('wrong type', TypeError) );
}

/**
 err() is a simple utility to throw an
 error of default or chosen error-class.

Instead of writing
 "throw 'error-message'";
 you can write:
 "err ('error-message')"

This does not save many key-strokes
 in itself but calling a function instead
 of a built-in keyword has at itws benefits:

1. err('some string') turns its argument
 into an instance of Error before throwing it.
 Thich means the log will show not only
 the error-message but also the stack of
 the calls that lead to the error.

2. You can assign 'err' to an even shorter
 variable-name:

let e = err;  e('something wrong')

3. You can pass it (or something else)
 as argument to functions:

doSomething (something, err);

4. You can replace it with your own function
 which takes you to the de-bugger if an
 error happens. Or which ignores some
 specific error-messages altogether.

Using err() gives YOU the control of
 what should happen under which error-
 conditions, while providing a reasonable
 default behavior.
*/

/* ----------------------------------------- */

function customMessages()
{ let ok = this.ok, not=this.not, fails=this.fails, x=this.x;
  let n = 1;
  ok ( n > 0, `n is not > 0: ${n}`);
  n = 0;
  let em = fails (_=> ok ( n > 0,   `n was not > 0: ${n}`)) + "";
  ok (em.match (/n was not > 0/));
  not (n < 0,  `n is not <= 0: ${n}`) ;
  em = fails (_=> not ( n === 0,  `n was not < 0: ${n}`)) + "";
  ok (em.match (/n was not < 0/));
  x (n, null, Number);
  n = null;
  x (n, null, Number);
  n = "";
  em = "" + fails (_=> x (n, null, Number));
  ok (em.match(/Error/));
  em = "" + fails (_=>
  x.call
  ('N IS NOT A NUMBER OR null'
  , n, null, Number)
  );
  ok (em.match(/N IS NOT A NUMBER OR null/));
}

/**
 If you give ok() or not() or x() a string
 as 2nd argument it will be shown on the log
 if the assertion fails. That can give whoever
 is reading the log a much better idea of
 what failed and why than simply saying
 "assertion failed, see the stack-trace".

You can can give the 'message' as 2nd argument
 to ok() and not() but not to x() because x()
 expects N arguments to start with. If you
 want to still give a custom failure-message
 to such an assertion you can do it by binding
 the message to the 'this' of x().
*/

/* ----------------------------------------- */

function ok( )
{ let ok = this.ok, not=this.not, fails=this.fails, x=this.x;
  ok (true);                                
  ok ("non-empty string");
  ok (1);
  ok ({});
  ok ([]);
  ok (ok (true) === true) ;                
  ok (ok ("non-empty string") === true);
  ok (ok (1) === true) ;
  fails ( _ => ok()          ); 					
  fails ( _ => ok(undefined) );
  fails ( _ => ok(false));
  fails ( _ => ok("") );
  fails ( _ => ok(null) );
  let v = 4;
  let e = fails( e =>  ok(v%2, "v must be odd")); 
  ok (e .toString().includes ("v must be odd"));
  return;
}

/**
 ok() throws an error iff
 it is called with argument
 which is "falsy".
*/

/* ----------------------------------------- */

function not( )
{ let not   = this.not 	;
  let ok 	  = this.ok 	;
  let fails = this.fails;
  not ();
  not(0);
  not ("");
  not (false);
  fails ( _ => not ("false"));
  fails ( _ => not (true));
  [ 0, 1, 5, "", "s", true, false, null, undefined
  ] .map
  ( b =>
  {
  try {ok (b)} catch (e)
  { ok (not (b) === true);
  }
  try {not (b)} catch (e)
  { ok (ok (b) === true);
  }
  }
  );
}

/**
 not() is the opposite of ok().
 It succeeds if ok() would fail
 and fails if ok() would succeed.
 In other words:
 If ok(b) causes an error then
 not(b) returns true.
 If not(b) causes an error then
 ok(b) returns true.
*/

/* ----------------------------------------- */

function fails()
{ let fails = this.fails;
  let ok 		= this.ok;
  let not 	= this.not;
  var e = fails (funkThatFails);  
  ok (e instanceof Error);
  ok (e);
  let e2;
  try
  { fails (funkThatDoesNotFail);   
  } catch (e)
  { e2 = e;
  }
  ok (e2.message.match(/Did NOT fail/))
  return;
  function funkThatFails ()
  {
  null . toString() ;
  }
  function funkThatDoesNotFail  ()
  {
  }
}

/**
 fails() takes as argument a function
 which it calls without arguments.
 If the argument-function throws an
 error fails() returns that error-instance.
 If the arugmetn function does not throw
 an error then fials() does.

fails() is mostly useful in tests to show
 what arguments cause some function to fail.
 In many cases it does not make sense to
 provide default values for all arguments
 but in suchb cases you should have test-cases
 showing what types of arguments are expected
 to cause errors.
*/

/* ----------------------------------------- */

	
	
// -----------------------------------------------
// TESTS for testee-method x():
	

function mapType()
{ let r, ok = this.ok, fails=this.fails, not=this.not, x=this.x, is=this.is;
  let Type  = this.Type;
  ok (x ({a:1}, {} ));
  ok (x ({zzz:3}, {} ). zzz === 3);
  ok ( x ({a:1}, {_: 2}
  ).a === 1
  );
  x ({a:1}, {b: 2});
  ok (x ({a:1}, {b: 2}).b === 2);
  ok (x ({a:1}, {b: 2}).a === undefined);
  fails
  ( e =>
  {  x ({a:1}, {a: "2"});
  }
  );
  x ( {a:1, b:2, c:3}
  , {_: Number}
  );
  x ( {}
  , {_: Number}
  ); 
  fails
  ( _ =>
  { x ( {a:1, b:"2", c:3}
  , {_: Number}
  );
  }
  );
}

/**
 'mapType' means a {} with zero or one keys.

A zero keys {} matches any value whose
 constructor is Object.

With one key a {k:v} matches any value whose
 constructor is an Object and whose values are
 all of the same type as the only field of
 the type-object {k:v}

A map-type differs from object-type in the same
 way as an array-type differs from a tuple type.
*/

/* ----------------------------------------- */

function objectType()
{ let r, ok = this.ok, fails=this.fails, not=this.not, x=this.x, is=this.is;
  let Type = this.Type;
  ok ( x ({a:1}).a ===  1);
  x ({a:true}     , {a: e => is (e, Boolean, null) });
  x ({a:false}    , {a: e => is (e, Boolean, null) });
  ok (is (null, Boolean, null));
  x ({a:null}     , {a: e => is (e, Boolean, null) });
  x ({a:undefined}, {a: e => is (e, Boolean, null) });
  x ({ }          , {a: e => is (e, Boolean, null) });
  let BooleanOrNull = new Type (Boolean, null);
  true instanceof BooleanOrNull
  x (true, BooleanOrNull);
  x (false, BooleanOrNull);
  x (null, BooleanOrNull);
  x ({a:true} , {a: BooleanOrNull} );
  x ({a:false}, {a: BooleanOrNull} );
  x ({a:null} , {a: BooleanOrNull} );
  x  ({}, {}) ;
  ok (x ({n:1}, {n:2}).n === 1) ;
  ok ( x ( {n:1, o:{m:3}}
  , {n:2, o:{m:4}}
  ).o.m === 3
  );
  x   (1, Number);
  x   (   {a:1}, {a: Number})
  ok  (x ({a:1}, {a: Number}).a === 1);
  fails (e => x (undefined, {z:2})) ;
  fails (e => x (null,      {z:2})) ;
  fails (e => x (5,         {z:2})) ;
  fails ( e => x ({n:1}, {n:"s"}     				));
  fails ( e => x ({n:1}, {n: String} 				));
  fails ( e => x ({n:1, m:2}, {n:"s", m:2} 	));
  x ({M:1}, {});
  x ({}, {m:2}) ;
  let o =  x ({a:1}, {a:99, b:3} );
  ok (o.a === 1);
  ok (o.b === 3);
  return;
}

/**
 "Object-type" refers to x 2nd argument whose
 constructor is Object. In other words the 2nd
 argument is a literal object {}. ok
*/

/* ----------------------------------------- */

function sumType()
{ let fails=this.fails, x=this.x, is=this.is,not=this.not,ok=this.ok;
  x (1, String, Boolean, Number);
  ok (x (1, String, Boolean, Number) === 1);
  fails ( e=> x (1, String, Boolean));
  x (null				, String, Boolean, null);
  x (undefined	, String, Boolean, null);
  fails ( e=> x (null			, String, Boolean));
  fails ( e=> x (undefined, String, Boolean));
  x (123, undefined);         
  x (123, String, undefined); 
  ok (is (1, Boolean, Number))
  x  ({a:1}, {a:  e => is (e, Boolean, Number) } );
  return;
}

/**
 * For x(value, type1, type2, ... )
 * if x(value, typeN) succeeds for any
 * of the types then x succeeds.
 *
 * This can used with null as one of the types
 * meaning if the value is not null or undefined
 * then it muts of one of the other specified
 * types. That usage is often called the MAYBE-type,
 * which is a special case of SumType, meaning
 * either null or some specific type otherwise.
*/

/* ----------------------------------------- */

function zeroArgs()
{ let fails = this.fails;
  fails ( _=> x () );
}

/**
 
*/

/* ----------------------------------------- */

function oneArg()
{ let ok = this.ok, fails=this.fails, not=this.not, x=this.x;
  ok (x (123)  		=== 123);           
  ok (x (0)  			=== 0);
  ok (x ("") 			=== "" );
  ok (x (false)  	=== false);
  ok (x (true)  	=== true);
  fails (_=> x (null));
  fails (_=> x (undefined));
  fails (_=> x ());
  x( 123			, undefined);                 
  x( undefined, undefined)
  x( null     , undefined)
  return;
}

/**
 
*/

/* ----------------------------------------- */

function atomicValueType()
{ let ok = this.ok, fails=this.fails, not=this.not, x=this.x;
  x (1, 1); 							           
  x (0, 1);
  fails (_=>  x(1, "s"));
  x("", "s");
  ok (x (1, 2) === 1); 							 
  ok (x (0, 2) === 0);
  ok (x (123, undefined) 	=== 123 );
  ok (x (null     , null) === null);
  ok (x (0        , 123) 	=== 0   );
  ok (x (1        , 123) 	=== 1   );
  fails (_=>  x (123, ""));
  fails (_=>  x ( "", 123));
  fails (_=>  x (123, null));
  x(1, String, Number);
  x(1, String, undefined);
  return;
}

/**
 If the 2nd argument of x() is non-object or
 a function which is neither a constructor or
 an arrow function it is an "atomic value".

If so the 1st argument must be of the same
 type as the 2nd OR if the 1st argument is
 undefined tor null hen x() returns its 2nd
 argument, in effect using it as the as the
 "default value" for the 1st argument.
*/

/* ----------------------------------------- */

function undefinedType()
{ let ok = this.ok, fails=this.fails, not=this.not, x=this.x;
  ok (x ( 123, undefined) 	=== 123 );
  ok (x ( "" , undefined) 	=== ""  );
  ok (x ( null, undefined) 			=== null);
  ok (x ( undefined, undefined) === undefined);
  fails ( _=> x (null)      );
  fails ( _=> x (undefined) );
  return 	;
}

/**
 An explicit undefined as 2nd argument
 allows ANYTHING INCLUDING undefined
 and null as 1st argument returning that.

We need this to be able to declare a
 function-type when we don't know what
 the function returns meaning it could
 return anything including returning
 nothing meaning undefined.
*/

/* ----------------------------------------- */

function nullType()
{ let ok = this.ok, fails=this.fails, not=this.not, x=this.x;
  x (null, null);
  x (undefined, null);
  fails (e=> x(0, null));
  fails (e=> x(2, null));
  return;
}

/**
 An explicit null as 2nd argument
 allows ONLY null or undefined
 as the 1st argument.

This is useful in x() statements with
 multiple types so we can say that
 if something is not null nor undefined
 then it muts be of given type, it can't
 be juts anything.

SEE ALSO: undefinedType(). An explicit
 undefined as 2nd argument allows the
 first argument to be anything, including
 undefined.
*/

/* ----------------------------------------- */

function instanceType()
{ let ok = this.ok, fails=this.fails, not=this.not, x=this.x;
  class ClassA {};
  class ClassB {};
  let cA  = new ClassA ();
  let cA2 = new ClassA ();
  let cA3 = x  (cA, cA2);      			
  ok ( cA3 === cA ) ;
  let cB  = new ClassB (); 	 				
  fails( _=> x(cB, cA));
  fails( _=> x(cA, cB));
  class ClassSub extends ClassA {}; 
  let cSub  = new ClassSub();
  let cSub2 = x(cSub, cA);
  ok (cSub2 === cSub);
  fails( _=> x(cA, cSub));
  return;
}

/**
 If x() 2nd argument of type "object" but
 its constructor is not Object nor Array
 then we say it specifies an "instance type".
 That means ...

A) x() Succeeds if its 1st argument
 is an instance of the constructor of its
 2nd argument. As usual x() then returns its
 first argument.

B) If x() 1st argument is not an instance
 of the cosntructor of its 2nd argument
 x() fails.

C) If x() 1st argument is an instance of
 a class which extends the constructor of
 the 2nd argument that succeeds. This is
 is simply because the 1st argument is then
 instanceof the constructor of the 2nd argument
 (because instanceof class C is also instanceof
 any ancestor-calss of C).

"instance-type" differs from "object-type"
 in that instance-type either returns the
 first argument as is, or fails. Object-type
 instead tries to return a merge of the two
 and only fails if the merging does not
 succeeds because the same-named fields
 of the two objects have incompatible types
 of values.
*/

/* ----------------------------------------- */

function arrayType()
{ let ok = this.ok, fails=this.fails, not=this.not, x=this.x;
  x ( [], []);
  x ( [], [Number]);
  x ( [1, "2" ], []);
  x ( [1, 2, 3], [4]);
  fails (_ => x ( ["2", 3], [Number]) );
  let AType = [Number]; 
  x ([]			, AType);  
  x ([1]			, AType);  
  x ([1,2,3]	, AType);
  fails (_=> x (["1"]   , AType ));
  fails (_=> x ([1, "1"], AType ));
  x ([1, "1", 1], AType );
  let AType2 = [123];    
  x ([1]			, AType2);
  x ([1,2,3]	, AType2);
  fails (_=> x (["1"]   , AType2 ));
  fails (_=> x ([1, "1"], AType2 ));
  let AType3 =  [e => e > 0];   		
  x ([1,2,3], AType3);  						
  fails  													
  ( e => x ([1, -1], AType3)
  );
  x ([1, -1, 3], AType3);
  [1,2,3,4].map ( e => x (e, AType3[0]) );
  x ( [1,2,3], Array) ;  
  x ( [1,2,3], [])    ;
  return
}

/**
 Array-types are specified with an array of length 1
 which teklks the type of the array elements.
 In practice we only check the first and last
 elements of any actual array to make it faster,
 there is no limit how big your arrays might be.

A) An Array type can specify only a single
 element-type. If you give it more it
 is no longer an array-type but a TupleType and
 slightly different rules apply, see
 testXWithTupleType().

B) An empty array always matches any array type.

C) If an array has elements every one of them must
 type-check with the SINGLE element-type declared
 for the array-type.

D) The element-type can be specified like x()-types
 in general, either with a constructor, an example
 instance of the type, or even with a predicate.

E) An example predicate-based array-type
 F) Succeeds because every element in [1,2,3]
 is > 0.
 G) Fails because the element -1 is not > 0.

H) The SIMPLEST Array-type just says something is
 an Array with not constraints on its element-type.
 You can spec that either with `Array`, or an example
 empty array [].
*/

/* ----------------------------------------- */

function tupleType()
{ let ok = this.ok, fails=this.fails, not=this.not, x=this.x;
  let  TupleT = [Number, String];
  x ([1, "s"], TupleT);      					
  fails (_=>  x (["s", 1], TupleT)); 	
  fails (_=>  x ([1, "s", 2], TupleT));  
  fails (_=>  x ([ 		 		], TupleT));
  fails (_=>  x ([1		 		], TupleT));
  x([1,2,3], [3,2,1]);
  fails (_=> x([1,2,3], [3,2,1,4])) ;
  fails (_=> x([1,2,3], [1,2])) ;
  return;
}

/**
 If you define an array-type with more than
 one element type you in fact get a "TupleType"
 with which slightly different rules apply.

Array-types match an array of any length
 as long as every element acgrees with the
 element-type of the array type.

TupleTypes only match arrays whose length
 is the same as the tuple-specifying array
 and where every element of the array
 passes the corresponding element-type-check
 of the tuple.

TupleTypes are USEFUL especially when you
 want to return multiple values of different
 types from a function - because technically
 even though any function can take multiple
 arguments they can only ever return one
 result. But, that one result can be specified
 as a Tuple.
*/

/* ----------------------------------------- */

function classType()
{ let ok = this.ok, fails=this.fails, not=this.not, x=this.x;
  ok    (x ("s", String) === "s"   ); 
  fails (_=> x( 123, String)         );
  let e = new TypeError();               
  x (e, TypeError);
  x (e, Error);
  x (e, Object);
  let e2 = new Error();
  fails ( _ =>  x(e2, TypeError));
  x (e, Error);
  x (e, Object);
  x (Object, Object);
  x (Function, Object);
  x (Function, Function);
  fails (_=> x (Array, Array));
  debugger
  x(1,1);
  x({}, {})
  x("abc", "abc")
  return;
}

/**
 A) If the 2nd argument is a function which
 is not an arraow-function and whose name
 starts with uppercase letter then we
 take it to be a "class" in other words
 a constructor.  If the first argument
 is "instanceof" such a 2nd argument then
 x() returns its first argument, else
 it causes an error.

B) As you know classes can have a superclass
 and all classes inherit the class Object.
 x() is aware of that so as longas the
 1st argument is instanceof the 2nd argument
 then x() will return its first argumewnt
 without errors.  Note that subcalss-relation
 is of course not symmetric.
*/

/* ----------------------------------------- */

function functionType()
{ let ok = this.ok, fails=this.fails, not=this.not, x=this.x;
  ok    (    x (valueFunkGOOD, aTypeFunk) === valueFunkGOOD);
  fails (_=> x (valueFunkBAD , aTypeFunk)  );
  x (valueFunk3, trivialTypeFunk);
  return;
  function trivialTypeFunk ()
  {
  }
  function valueFunk3 ()
  {  
  }
  function aTypeFunk (arg)
  { if  (arg === undefined)
  { throw  123;
  }
  return "";
  }
  function valueFunkGOOD ()
  {  
  return "like typeFunk above must somethign that is x-compatible with a String"
  }
  function valueFunkBAD ()
  { return 321;
  }
}

/**
 A 2nd argument of x() which is a function which
 is not a class/constructor or predicate is
 a "function-type". The first argument then
 muts be a function too. The function-type can
 further declare what the argument-and result-types
 of the function given as first argument muts be
 and if they are not such then that will
 generate an error.

Thwe way a function type can dictate the
 argument- and result-types of the 1st
 argument is as follows:

1. The system calls the type-function
 without arguments. If that does not cause
 an error then it means the 1st argument
 is required to work if it too is called
 without arguments. It is not required
 to work if called with arguments. So in
 effect this is saying that the  function
 takes no argumemtns.

But if calling the type-funciton without
 arguments throws an error then the "error"
 that is throw is in fact either a non-array
 which is possible argument to the function
 or if it is an array then the function
 can be applied to those all together.

We call the type-function with the arguments
 we  now have and what we get as a result
 tells us the default type of result
 expected from any compliant 1st-argument.

We then verify that the actual 1st argument
 function is complinat with the type-function
 by calling it with with the default arguments
 for that type of function, then veriofying
 its result complias with the type-function
 as shows by calling
 x (resultOfValueFunk, resultOfTypeFunk).

If this sounds to complicated  you
 can always give Function as the 2nd argument
 to x() which simply says that the first
 argumetn must be SOME kind of a function.

Or be aware that a function which causes
 no error when called without arguments
 and returns undefined in fact specifies
 a function which must work when called
 without arguments, and whose result can
 be ANYTHING.  Its result can be anything
 because teh default result was undefined
 and x(anything, undefined) is guaranteed
 to always work.

It is often perfectly useful to specify
 that something muts be a function which
 can return anything because realize that
 that is only the SYNTACTIC part of the
 argument specification. But somewhere
 there also muts be some SEMANTIC
 constraints for the value saying what
 methods it must have for instance.
 You can spec such methods with x(),
 but sometimes that may be overkill.
*/

/* ----------------------------------------- */

function predicateType()
{ let ok = this.ok, fails=this.fails, not=this.not, x=this.x;
  let odd = x =>  x % 2;
  ok    ( x (1, odd) === 1);
  ok    ( x (3, odd) === 3);
  fails (_=> x (4,  odd) );
  let funk = function (x){return x % 2}    
  fails (_=> x (1,  funk) );
  x (funk, Function);
  x (odd, funk);
  x (funk, funk);
  fails (_=> x (1, funk) ); 
  fails (_=> x (2, funk) ); 
  fails (_=> x (undefined, funk) ); 
  return;
}

/**
 "Predicate-type" is implemented by passing an
 arrow-function as 2nd argumetn to x(). That
 functions is then called with the 1xst argument.
 If the result is tru then x() returns its first
 argument, else throws an error.
*/

/* ----------------------------------------- */

function selfRefType()
{ let ok = this.ok, fails=this.fails, not=this.not, x=this.x, is=this.is;
  let nextType =
  {  next: e =>  e === null  ||  is (e,  nextType)
  };
  let linkedList = {next:   null};
  x (linkedList, nextType);
  linkedList =  {next: {next: {next: null}}};
  x (linkedList, nextType);
  fails ( e=>  x({next:2}, nextType));
  return;
}

/**
 using x() together with the predicate-types
 and the primitive function is() allows you to
 define recursive data-types whose definition
 refers to that definition itself to declare
 that the type of component is the same as
 the type of the whole it is part of.

A recursive data-structure however always
 needs a default type to end the recursion
 like the leaves of a tree muts stop branching
 at some point. The value of such a field
 then must be EITHER the type of the whole
 structure OR something more primitive like
 null.

This is the  main reason we need the primitive
 is() which returns a boolean instead of
 throing an error like x(). If you declared
 x(e, A) ||  x(e, B)
 then if  x(e, A) fails and throws an error
 then the 2nd condition never gets a chance
 to be tested.
*/

/* ----------------------------------------- */

function is()
{ let ok = this.ok, fails=this.fails, not=this.not, x=this.x, is=this.is;
  not (is (123, String));
  ok  (is (123, String) === false);
  ok  (is (123, Number) === true);
  ok  (is (123, String) || is (123, Number));
  return;
}

/**
 is(a,b) returns false if x(a,b) would throw
 an error. If not then is(a,b) returns true.
 It is good for implementing disjunctive
 conditions.

is() never throws an error.
*/

/* ----------------------------------------- */

function Type()
{ let ok = this.ok, fails=this.fails, not=this.not, x=this.x, is=this.is, Type=this.Type;
  let ob     = {a: {b: new Object }};
  let ObType =  new Type (ob);
  let ob2    = ObType.new();
  ok (ob .a.b.constructor === Object);
  ok (ob2.a.b.constructor === Object);
  ok (ob.a.b  !== ob2.a.b );
  let BooleanOrNumber = new Type (Boolean, Number);
  ok (BooleanOrNumber.toString() === "Boolean | Number" );
  ok  (1 		instanceof BooleanOrNumber );
  ok  (true instanceof BooleanOrNumber );
  not ("s" 	instanceof BooleanOrNumber );
  let BooleanOrNull = new Type (Boolean, null);
  ok  (true instanceof BooleanOrNull );
  ok  (null instanceof BooleanOrNull );
  not (123  instanceof BooleanOrNull );
  let NullOrBoolean = new Type (null, Boolean);
  ok  (true instanceof NullOrBoolean );
  ok  (null instanceof NullOrBoolean );
  not (123  instanceof NullOrBoolean );
  ok ( BooleanOrNull.new()  ===  false);
  ok ( NullOrBoolean.new () === null);
  ok  ( is (true, BooleanOrNull) );
  ok  ( is (null, BooleanOrNull) );
  not ( is (123 , BooleanOrNull) );
  x  ({a:null},  {a:  BooleanOrNull } );
  x  ({a:true},  {a:  BooleanOrNull } );
  x  ({a:false}, {a:  BooleanOrNull } );
  fails(_=>
  x  ({a:123}, {a:  BooleanOrNull } )
  );
  let NumberOrNull = new Type (Number, null);
  x ( 123      , NumberOrNull);
  x ( null     , NumberOrNull);
  x ( undefined, NumberOrNull);
  fails (e=> x("s", NumberOrNull))
  return;
}

/**
 The API-constructor Type() when called with
 'new' will return a new "sum-type" when
 called with n alternative types as constructor-
 arguments. The result-type accepts anything
 that would be accepted by one or more of its
 component-types. If none of the component
 types accepts a valu then the composite type
 will not accept it either.

The instanceof behave with the result-type
 as you would expect as well. But note that
 Type() can be used to construct a new sumtype
 out of anything that could be used as 2nd
 argument of x(), not only from constructors.
 THerefore we can for instacne use null as
 one of the argument of Type to create types
 such as BooleanOrNull in our example.
*/

/* ----------------------------------------- */

