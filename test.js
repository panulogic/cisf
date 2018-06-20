/**
Copyright (c) Panu Viljamaa 2017.  
SPDX-License-Identifier: Apache-2.0
*/


// Below we bind each test- function to the
// exports of the module cisf. That way
// each test has access to the functions
// ok, not, x(), fails() etc. which are
// PERFECTLY SUITED FOR TESTING themselves.
// See the exaamples.

testCisf ();

function testCisf ()
{
  let cisf;
  if (typeof require === "function")
  { cisf = require ("./cisf");
  } else
  { cisf = CISF; // for the browser
  }

eq                .bind   (cisf) ();
path              .bind 	(cisf) ();
fs                .bind 	(cisf) ();

x             	  .bind 	(cisf) ();
r           	    .bind 	(cisf) ();

ok              	.bind 	(cisf) ();
not             	.bind 	(cisf) ();
fails           	.bind 	(cisf) ();

log             	.bind 	(cisf) ();
err             	.bind 	(cisf) ();

Type              .bind 	(cisf) ();
A             	  .bind 	(cisf) ();


msg ("cisf.js 3.0.0 all tests passed. ");

return;

function msg (s)
{
  console.log("");
  console.log (s);
  console.log("");
  if (typeof document !== "undefined")
  { let doc = document;
    setTimeout
    ( function ()
      { if (doc && doc.body && doc.body.innerHTML)
         {  doc.body.innerHTML += "<h1>" + s +   "</h1>";
         }
      }
    , 1000
    );
  }
}
// -----------------------------------------------

// eq() also tests neq() which is simply the negation of eq().

function eq ()
{ let {fails, ok, eq, neq} = this;

  fails (_=> eq());
  fails (_=> eq(1));
  fails (_=> eq(1,2,3));

  eq (1,1); // YES!
  eq ("1", "1"); // YES!
  fails (_=> eq(1,2));
  fails (_=> eq("1", "2"));

  neq (1,2);
  fails(_=> neq(2,2));

  ok ( eq(1,1) === 1);  // returns its first argument

  fails (_=> eq(1,2));
  fails (_=> eq([1], [2]));
  fails (_=> eq([1], 1));

  eq([1,2,3], [1,2,3]);
  eq([1,[2,[3]]], [1,[2,[3]]]);

 let ob =
 { a: {b: [1,2, {c:3}]}
 }
 let ob2 =
 { a: {b: [1,2, {c:3}]}
 }
 let ob3 =
 { a: {b: [1,2, {c:5}]}
 }

 eq (ob, ob2);
 eq (ob2, ob);
 fails (_=> eq(ob,ob3 ));
 fails (_=> eq(ob2,ob3));

 eq (new Object(), new Object());
 // Because they must have all the same fields
 // with all the same values they must be eq.
 // Point is eq() works with non-literal
 // arguments as well.
 eq (new Object(), new Function () );

 ok (Object === eq (Object, Function));
 // Above works too because for objects
 // we dont compare their constructors
 // only thgeir ENUMERABLE properties.
 //
 // But as seen for primitive objects
 // eq() does not compare the properties
 // because we know there are none:

 eq  (1,1);
 neq (1,2);
 // WHEREAS for boxed Strings and numbers they are juts
 // like other objects, and rq only compares their
 // ENUMERABLE properties:
 eq (new String(), new Number() )

// So eq () is about comparing the "carried data"
// of two objects, or if objects are primitive
// meaning they are data themselves then comparing
// that data. Or in other wrods if you compare
// VESSELS we only compare the CONTENT of those
// vessels, NOT whether the vessels are the same
// or even of the same class.

// If one of the args is an object and the
// other is not then we fail, even if neither
// has any enumerable properties. You can not
// compare Apples and Oranges.

neq (1, {});
neq ({}, 1);
eq  ({}, {});

return;

  /**
  You would rarely check that your arguments are
  a given fixed array or object. But eq() is part
  of the API because it  supports the 2nd major
  user-case of cisf: Writing the  documentary tests
  for your  API, including the API of cisf itself.

  So in this sense eq() is in same group as fails().
  You typically only call fails() in your API-doc
  -tests, to show what are some illegal calls.

   */
}


function path ()
{
  let {path, x} = this;
  if (! path)
  { return;  // in the browser
	}
  x (path.join   , Function);
  x (path.resolve, Function);
}

function fs ()
{
  let {fs, x} = this;
  if (! fs)
  { return;  // in the browser
	}
	x (fs.readFile, Function);
}


function A ()
{ let {ok, x, A, Type, fails, is, eq, neq } = this;
  let StringOrNull = Type (String, null);

  let ex = fails (a => a.yah() );

  A     (        [String, Number], "good", 123   );
  fails (_=> A ( [String, Number], "good", "BAD" ));


  function AExample (s, n) { A([String, Number], s, n) }
	AExample ("yeah", 123);
	fails (_=> AExample ("yeah", "BAD"));


  A     (        ["", 1], "good", 123   );
  fails (_=> A ( ["", 1], "good", "BAD" ));


  let [types, values]
  =  A ( [1, StringOrNull ]
       , 1,  "abc"
       );

  eq  (values, [1,  "abc"]);
  neq (types, [1, StringOrNull] );
  // Above neq() because the 1 has by now
  // been converted to Type(Number).
  ok  (types[0].name === "Type(Number)" );

  A ( [1, StringOrNull ]
    , 1,  null
    );

  A ( [1, StringOrNull ]
    , 1   // nulltype accepts undefined
    );


 [types, values] = fails
 ( _=>
   A ( [1, StringOrNull ]
     , 1,  321
     )
 );

eq (values, [1,  321]);
ok (types[0].name === "Type(Number)");
ok (types[1].name === "Type(String, null)"  );


              A([Number, String], 123, "123");
   fails (_=> A([Number, String], 123, 123  ));

	/* BEWARE: A() first Arg is an array of types,
     it does NOT create an ARRAY-type unless you
     give it an element which is an Array:
   */
   A([ [Number] ], [555] );
   A([ [0]    ]  , [555] );

   return;

/*
Above shows how to use A().
It is a good way to test ALL your
argument-types in a single statement.
*/

}


function Type ()
{ let {Type, ok, not, fails, x, is, err, log} = this;

	let CtorType = Type (String);
	let ctorT    = new CtorType();
	// ctorT MUST be BOXED because constructors
	// can only return boxed values. Therefore:

	ok (ctorT instanceof String);

	// But also:
	ok  (ctorT instanceof CtorType);

	// So, new CtorType() is a boxed String
	// so it is instanceof String. But it is
	// ALSO instanceof CtorType because Types
	// have their own way to do instanceof .
	// Also in this case we have:

	ok ( ctorT.constructor === String );



  //  TYPES' NAME IS THEIR SERIALIZATION:

  let A3b = Type( [[[ 1 ]]] ) ;
  ok (A3b.name === "Type([Type([Type([Type(Number)])])])" );
  let GetBack     = Type([Type([Type([Type(Number)])])]);
  ok (GetBack.name  ===  A3b.name );

/*
What the above shows is that if I have a type like
A3b which only depends on built-in JavaScript classes
I can then send the NAME of the type over the network
and whoever gets it can evaluate it and get the
exactly same type to use in their own applications.
 */




/* ==================================
   ATOMIC TYPES
*/
  let NumberYes = Type (123);
  x (111, NumberYes);

  // interperting 1 as a type means it is
  // a SHORTHAND for its constructor in the context
  // where a type is expected.


   let S2 = Type ("abc");
   ok (S2 !== String);
   x (123  , Type(1));
   x ( true, Type(false));
   x ( "a" , Type("b"));

   // Note this applies only to
   // unboxed numbers, unboxed strings and
   // unboxed booleans, not to {} etc. :


/* ==================================
   CONSTRUCTOR TYPES

   Types which already exist in JavaScript
   are String, Number, Boolean Object, Function.
   They are the buillding blocks of moe complex
   types. But you can easily create your own
   constructors or "classes" which can be
   used as "types" as is.
 */

  x (1, Number);

   let O = Type (Object);
   let F = Type (Function);
   ok (O === Object);
   ok (F === Function);

   let S = Type (String);
   let N = Type (Number);
   let B = Type (Boolean);

   ok (S !== String);
   ok (N !== Number);
   ok (B !== Boolean);



   let AnyOb = Type({});
   ok (AnyOb !== Object);
   // Type({})  is valid but it is not === Object
   // it matches anything which is an instance of Object.
   x ({}, AnyOb);
   x ({x:8}, AnyOb);
   x (new String(), AnyOb); // Because boxed Strings are Objects
   x (new Number(), AnyOb); // Similarly

   x (Type, AnyOb); // Because Type is a Function
                    // and all Functions are instances
                    // of Object





/* ==================================
   SUM TYPES
 */

  let ST  = Type (String, Number);
  let ST2 = Type (ST);
  ok (ST === ST2);

  ST2 = Type (ST, ST);
  not (ST === ST2);

  let sCount=0, nCount=0, st, st2;

  for (let j=0; j<100; j++)
	{ st  = new ST ();
	  if (is (st, String))
		{ sCount++;
		  continue;
		}
		if (is (st, Number))
		{ nCount++;
		  continue;
	  }
	  debugger
		err ("Error in test"); // beware not to call err() which is part of the test
	}
  ok (sCount + nCount === 100);
  ok (sCount); // if its 0 you won a cosmic jackpot
  ok (nCount); // if its 0 you won a cosmic jackpot

  // Next the same but with ST2. But really they
  // are ther same types internally because when
  // the type is created the comp-types are resolved
  // already.

  sCount=0, nCount=0;
  for (let j=0; j<100; j++)
	{ st  = new ST2 ();
	  if (is (st, String))
		{ sCount++;
		  continue;
		}
		if (is (st, Number))
		{ nCount++;
		  continue;
		}
		err ("Error in test")
	}

  ok (sCount + nCount === 100);
  ok (sCount); // if its 0 you won a cosmic jackpot
  ok (nCount); // if its 0 you won a cosmic jackpot


/* ==================================
   NULL TYPES
 */

 let NullT = Type(null);
 x (null, NullT);
 x (undefined, NullT);

/*
NulLType is not very useful by itself.
It is useful as part of a SumType for saying
that IF something is NOT null THEN it mus be
a value of a specific type:
*/

  let StringOrNull         = Type(String, null);
  ok (StringOrNull.name === "Type(String, null)" );

  x (null     , StringOrNull);
  x (undefined, StringOrNull);
  x ("", StringOrNull);

  fails (_=> x(123, StringOrNull));


/* ==================================
   FUNCTION TYPES
 */
  let  FT = Type ( () =>  [String, Number, String] );
  // Above describes a function which take 2 arguments
  // a String and a Number, and returns a String;

  ok (is (()=> "result", FT) );
  ok (   (()=> "result") instanceof  FT);

  let ft = new FT ();
  ft();
  ok (is (ft, FT) );
  ok (is (ft()     , String));
  ok (is (ft(1,2,3), String));



/* ==================================
   PREDICATE TYPES

   To create a predicate-type the argument
   - function must havbe a name which
   MUST NOT start with [A-Z]. If it does
   then it will be treated as an ordinary
   constructor-type.

	 The predicate-function from which a
	 Predicate-type is created when called
	 without arguments must return its
	 "example instance" which must be such
	 that the predicate-function returns true
	 when called with it as argument.

*/

  function odd_p (n)
  { if (! arguments.length)
    { return example ();
    }
    if ( n % 2 === 1 || n % 2 === -1)
    { return true;
    }

    function example ()
		{ let max    = Math.floor (Number.MAX_SAFE_INTEGER / 2)  ;
		  let bigOdd =  max  * 2 - 1 ;

		  let it  = rix (max) * 2 - 1 ;

		  if (rix(9) > 4)
			{ // it is important that edge-cases
			  // get testing in a limited test-run.
				it =  [bigOdd, 1,3,5,7,9,11,13,15,17] [rix(9)];
			}

      // beware rix returns a random index into
      // an array of length of its arg. So if you
      // call it with 1 it will always return 0.
      // So think of its argument as telling the
      // nuymber of possibel values it can return.

		  if (rix(2) > 0)
			{ it = it * -1;
			}

      return it;
		}

		function rix (leng)
		{ let randix =  Math.floor (Math.random() * leng ) ;
			return randix;
    }
	}

  let Odd  = Type (odd_p);
  ok (Odd.name === "Type(odd_p)");


let anOdd = new Odd ();   // boxed number
let value = anOdd.valueOf();
ok (value % 2 === 1 || value % 2 === -1 );

ok  (is (anOdd, Odd));
ok  (is (value, Odd));


// BEWARE: It deos not make a predicate=-type
// if the argument of Type() is a NAMELESS
// function. That creates a Funk-Type.
// And the function then must return
// an Array of arg-types + result-type
// of the function that are to be memebers
// of that type.


  fails (_ => Type (n => n % 2 === 1));
  // You can not create predicate functions
  // from nameless functions. And if you
  // want to create a Functon-type then the
  // function you pass as argument must
  // return an array of types to tell the
  // argument- and result-types required
  // of the instances of that Function-type.




/* ==================================
   OBJECT TYPES
 */

  let XObType = Type ({x: 1});

  ok  (is ({x:777}  , XObType));
  not (is ({x:"abc"}, XObType));
  not (is ({x:null} , XObType));
  not (is ({y:777}  , XObType));

let OT = Type ({a: Number, b: Type(String, null)});
ok (OT.name === "Type({a: Type(Number), b: Type(String, null)})" );
ok  ( is ( {a:1, b: "b" }, OT  ));
not ( is ( {a:1, b: 23  }, OT  ));
ok  ( is ( {a:1, b: null}, OT ));

let OT2 = Type ({a: Number, b: [String, null] });
ok (OT2.name === "Type({a: Type(Number), b: Type([Type(String), Type(null)])})");

not ( is ( {a:1, b: "b" }, OT2  ));
not ( is ( {a:1, b: 23  }, OT2  ));
not ( is ( {a:1, b: null}, OT2 ));
// Above all are not because value of b:
// must be an Array of Strings or nulls
ok  (is ( {a:1, b: ["b"] }, OT2 ));
not (is ( {a:1, b: [23 ] }, OT2 ));
ok  (is ( {a:1, b: [null]}, OT2 ));


let OB3 = Type
( { a :
      { b :
          { c: 1
          }
      }
  }
);
ok (OB3.name ===
    "Type({a: Type({b: Type({c: Type(Number)})})})"
   );
x ({a: {b: {c: 77}}}, OB3);




/* ==================================
   ARRAY TYPES
 */

  // For arrays if there are multiple types
  // given inside the array those are alternative
  // element types. For instance [String, null]

  let NA  = Type ([Number]);
  ok (NA.name = 'Type([Number])');

  let NA2  = Type ([1]);
  ok (NA2.name = 'Type([Number])');

  ok  ([1]       instanceof NA);
  ok  ([1,2,3]   instanceof NA);
  not (["a,b,c"] instanceof NA);

  let StringOrNullArr  = Type ([String, null]);
  ok (StringOrNullArr.name = 'Type([String,null])' );
  not ([1,2,3]   instanceof StringOrNullArr);
  ok  (["1"]     instanceof StringOrNullArr);

  ok  ([null]    instanceof StringOrNullArr);
  ok  (["a", null,"c"]   instanceof StringOrNullArr);



ok (Type(String).name === "Type(String)" );
// MULTI-D ARRAYS:
let NA2D   = Type ([  Type([Number])  ]);
 ok (NA2D .name === "Type([Type([Type(Number)])])");

ok ([ [1]            ] instanceof  NA2D);
ok ([ [1,2]          ] instanceof  NA2D);
ok (is ([ [1,2], [3] ], NA2D));

not (is ([ [1,2], ["3"]  ], NA2D));
not (is ([ [1,2], [null] ], NA2D));

ok ("abc" instanceof  Type(String, null) );



// MULTI-D ARRAYS:

let A2 = Type( [ [1] ] ) ;
ok ([[5]] instanceof A2);


let A3 = Type( [[[ 1 ]]] ) ;
ok (A3.name === "Type([Type([Type([Type(Number)])])])" );

A3 = Type( [[[ 1, "", false ]]] ) ;
ok (A3.name ===
    "Type([Type([Type([Type(Number), Type(String), Type(Boolean)])])])"
    );
ok ([[[5]]] instanceof A3);

ok (
[ [ [1, 2]
  , [3, 4]
  ]
, [ [5, 6]
  , [7, 8]
  ]
] instanceof A3);




/* =====================================
 LEGACY MISC TESTS:
*/

  not (is(2, Odd ));

fails (()=> x(2, Odd));

  let NumberOrString  = Type (Number, String);

  ok  (is (2        , NumberOrString));
  ok  (is ("2"      , NumberOrString));

  not (is (null     , NumberOrString));
  not (is (undefined, NumberOrString));
  not (is (true     , NumberOrString));
  not (is (false    , NumberOrString));

  let NumberOrNothing = Type (Number, null);
  ok (is (3         ,  NumberOrNothing));
  ok (is (null      ,  NumberOrNothing));

  ok (is (undefined ,  NumberOrNothing));

  not (is (false,  NumberOrNothing));
  not (is (""   ,  NumberOrNothing));

  x  (3       , NumberOrNothing);
  x (null     , NumberOrNothing);
  x (undefined, NumberOrNothing);
  fails (()=> x("3", NumberOrNothing));

  not (is ("3"  , NumberOrNothing));
  not (is (""   , NumberOrNothing));
  not (is (false, NumberOrNothing));

  // You can use ES6 arrow-functions
  // to make Type-definitions succinct:


  // INSTANTIATING SUM-TYPES:
  let nos  = new NumberOrString  ( );
  let nos2 = new NumberOrString  ( );
   x (nos , NumberOrString);
   x (nos2, NumberOrString);

  let NT2 = Type (null);
  let non  = new NumberOrNothing ( )  ;


  if (   non.valueOf() === null )  // note it could be null
	{
	  ok (non instanceof NT2 );
	}

let NT = Type(null);

for (let j = 0; j<22; j++)
{ let non2 = new NumberOrNothing ( );

	if (non2.name === "Null")
	{ ok (non2 instanceof NT); // NullType  checks the valueOf() as well
	  x (non2,  NT);
	  ok (is (non2,  NT));

	  let vof = non2.valueOf();
	  if (vof !== null)
		{
			debugger
			vof = non2.valueOf();
		}
	  ok (vof  ===  null) ;
	}

  x (non , NumberOrNothing);
  x (non2, NumberOrNothing);
}


  x   (null, NumberOrNothing);
  not (is ("abc", NumberOrNothing));

  let NullType = Type(null);
  x (null , NullType);
  x (undefined , NullType);

  ok (is(null, NullType));
  ok (is(undefined, NullType));

  not (is(0, NullType));
  not (is("", NullType));
  not (is(false, NullType));

  not (is(33, NullType));



/* ==================================
   NON-TYPES

   Calling Type() with no argument creates
   a type which is npobody's type.
   It is not very useful but it is possible
   you might find a use for it.

*/

   let NBT = new Type();
   not (is (123, NBT));   // but we cant test them all

	/*
   You can not call Type with just
   anything. You have to know what are
   its valid arguments, see further below
   the tests for each type of Type you can
   create. Here are some exaxmples of
   what you can NOT call Type() with:
	 */
	fails (()=> Type (new String() ));
	fails (()=> Type (new Number() ));
	fails (()=> Type (new Boolean()));
	fails (()=> Type (undefined));


// end test.js::Type()
return;




}

// -----------------------------------------------

function x ()
{
  let x=this.x, ok=this.ok, fails=this.fails;


  x (""   , String);
  x (0    , Number);
  x (false, Boolean);


  x (null     , null);
  x (undefined, null);
  fails (() => x(33, null));

  x (null     , Number, null);
  x (undefined, Number, null);

  x (3, Number);
  fails (() =>   x("3", Number));
  x ("3", Number, String);

  fails (() => x(null     , Number));
  fails (() => x(undefined, Number));



  // How you use it often:
  let arg = 3;
  let someVar = x(arg, Number);
  ok (someVar === 3);

  // x can handle any single argument which
  // is not undefined or null:
  x (0);
  x (false);
  x ("");

  fails (() => x(null));
  fails (() => x(undefined));
  fails (() => x());
}

// -----------------------------------------------

function r ()
{
  let {r, ok, log, path, not}  = this;

  if (! r)
  { log (`cisf/tes.js: There is no 'r()'
    when running in the browser so we won't
    try to test it either, on the browser`);
    return;
	}

	ok ( r ("path") === require ("path")) ;
	ok ( r ("fs"  ) === require ("fs"))   ;  // etc.

  let cwd = process.cwd();
  ok (r.abs() === cwd );
  ok (r.abs("") === cwd );


  let relPath = r.rel(__filename);
  not (path.isAbsolute(relPath));
  ok (r.abs (r.rel (__filename) ) === __filename);

  ok (r (relPath) === require (__filename));

  // Above is the main reason for r(), you can
  // require modules by giving r() their path
  // relative to the cwd, so you don't need
  // to type out the full host-specific abspath,
  // nor use fragile non-portable module-relative
  // upward paths.

}



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

}
