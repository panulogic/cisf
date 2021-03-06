/** =========================================
   cisf/test.js

   Copyright 2018 Class Cloud LLC

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

   =============================================
*/


testCisf ();

function testCisf ()
{
  let cisf;
  if (typeof require === "function")
  { cisf = require ("./cisf");
  } else
  { cisf = CISF; // in the browser
  }


/* Below we bind each test- function to the
   exports of the module 'cisf' then call
   each of them.

   That way each test-function has access to
   the cisf functions ok, not, x(), fails(),
   eq(), etc. which are well-suited for testing
   themselves and their peers.
*/

  x       .bind (cisf) ();
  xNot    .bind (cisf) ();

  ok      .bind (cisf) ();
  not     .bind (cisf) ();
  fails   .bind (cisf) ();
  eq      .bind (cisf) ();


  is      .bind (cisf) ();
  isEq    .bind (cisf) ();

  Type    .bind (cisf) ();
  A       .bind (cisf) ();

  log     .bind (cisf) ();
  err     .bind (cisf) ();

  path    .bind (cisf) ();
  fs      .bind (cisf) ();
  r       .bind (cisf) ();

  w       .bind (cisf) ();

  tell_tests_passd ();


  return;

function tell_tests_passd (s)
{ s = `Cisf v. ${cisf.v} tests passed.`;

if (typeof require === 'undefined')
{ s += `
<h2>${s}</h2>
<pre><tt>
${testCisf}
</tt></pre>
`;
}

  console.log("");
  console.log (s);
  console.log("");
  if (typeof document !== "undefined")
  { let doc = document;
    setTimeout
    ( function ()
      { if (doc && doc.body && doc.body.innerHTML)
         {  doc.body.innerHTML +=  s  ;
         }
      }
    , 1000
    );
  }
}

function w ()  // w for 'wrapper'
{
  let {fails, ok, eq, neq, w} = this;

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


  // WRAP AN OBJECT TO LOOP OVER ITS KV-PAIRS:

  let ob  = {a:22, b: 33};
  let kvs = w(ob).map
  ( ([k, v])  =>
    { return k  + v;
    }
  );
  eq (kvs, ["a22", "b33"]);


/*--------- was:
  let kvs = w(ob).map
  ( key  =>
    {  return key + ob[key];
    }
  );
------------------------ */
/*
why change it to take [k,v] as argument?
Because that means that any library function
could be passed as argument to map the
function need not exist in the same scope
it does not need to KNOW about the object
whose entries it is looping over.
 */

  // WRAP A STRING TO LOOP OVER ITS CHARS:
  let asciis = w("ABC").map (e=>e.codePointAt(0));
  eq (asciis, [65, 66, 67]);


  // WRAP A NUMBER TO REPEAT  N times:
  // (return the indexes as array)

  let digits = w(10).map (e=>e);
  eq (digits, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);


  // WRAP A FUNCTION TO PRODUCE A SERIES:

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


   // WRAP A BOOLEAN TO GET INDEXES WHICH ARE TRUTHY OR FALSY:

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
   , [Number, Number, Number, Boolean, String]
   );


  // WRAP A REGEXP TO FIND ALL ITS MATCHES.
  if (typeof require === "undefined")
  { // we skip testing  wrapped-RegExps on BROWSERS
    // because
    // they dont work on IE.  Better to have something
    // working on IE than crashing the tests.

    return;
	}

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


}  // end function w()


function is()                 // tests also isNot()
{ let {is, isNot, ok, not, x} = this;

  ok (is (1, Number));
  ok (is (1, String, Number));

  ok (isNot ("abc", Number));
  ok (isNot (true, Number, String));

  // v. 4.5 news:
  ok  (is (null     , null));
  ok  (is (undefined, null));
  not (isNot (null     , null));
  not (isNot (undefined, null));

  x(null, null)
  x(undefined, null)

}


// isEq() also tests isNeq() which is simply the negation of isEq().
function isEq ()
{  let {isEq, isNeq, ok, not } = this;

  not ([1,2,3] == [1,2,3]) ;

  ok  (isEq ([1,2,3], [1,2,3   ]));
  not (isEq ([1,2,3], [1,2,3, 4]));

  not  (isNeq ([1,2,3], [1,2,3]));
  not  (isEq ([1,2,3 ], [1,2,3, 4]));

}


// eq() also tests neq() which is simply the negation of eq().
function eq ()
{ let {fails, ok, not, eq, neq, isEq, isNeq} = this;

  eq () ; // if both args are undefined they are equal
  fails (_=> eq(1));
  fails (_=> eq(1,2,3));

  eq (1,1);
  eq ("1", "1");
  fails (_=> eq(1,2));
  fails (_=> eq("1", "2"));

  neq (1,2);
  fails(_=> neq(2,2));

  ok ( eq(1,1) === 1);  // returns its first argument

  fails (_=> eq(1,2));
  fails (_=> eq([1], [2]));
  fails (_=> eq([1], 1));


not ([1,2,3] === [1,2,3]);

eq  ([1,2,3], [1,2,3]);
ok  (isEq ([1,2,3], [1,2,3]));

neq (       [1,2,3], [1,2]  );
ok  (isNeq ([1,2,3], [1,2]));

eq  ( [1,[2,[3]] ]
		, [1,[2,[3]] ]
		);

not  ({} == {}      );
eq   ({}    , {}    );
neq  ({}    , {a:{}});
eq   ({a:{}}, {a:{}});

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
 fails (_=> eq (ob,ob3 ));
 fails (_=> eq (ob2,ob3));

 neq (ob,ob3)

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
  user-case of cisf: Writing documentary tests
  for your  API, including the API of cisf itself.

  When you write unit-tests for methods that
  return arrays or objects you typically want
  to use eq eo to check the result is what you
  expect.

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
{ let {ok, not, x, A, Type, fails, is, eq, neq } = this;
  let StringOrNull = Type (String, null);

  let ex = fails (a => a.yah() );

  A     (        [String, Number], "good", 123   );
  fails (_=> A ( [String, Number], "good", "BAD" ));

function myFunk (n)
{ if (  ! (n instanceof Number) &&
        (typeof n !== "number")
     )
  { throw "type-error"
  }
}
function myFunk2 (n)
{ x(n, Number);
}


let see = myFunk2 / 2;

myFunk2 (123);

myFunk (123);
// myFunk( );



function divide (a, b)
{ x (a, Number);
  x (b, Number);
  not (b === 0);

  return a / b;
}

function divideSH (a, b)
{ x (a, 1);  // unboxed numbers strings and booleans
  x (b, 1);  // are shorthands for their constructor
  not (b === 0);

  return a / b;
}

function divideSH2 (a, b)
{ A ([1,1], a, b);
  not (b === 0);

  return a / b;
}


let c = divide (4, 2);
ok (c === 2);
fails (_=> divide (4, 0));
fails (_=> divide ("abc", 2));

c = divideSH (4, 2);
ok (c === 2);

c = divideSH2 (4, 2);
ok (c === 2);


// But JavaScript allows you to calculate
// 2/0, it returns Infinity for that.
// Why not be happy with that? The
// answer tells us why assertions are
// useful in the first place: They
// tells us sooner rather than later
// that something is wrong. Canaries
// die sooner than the miners do,
// that is how they help.
//
// In this example we want to
// be notified sooner rather than later
// if the result is meaningless infinity.
// We want to document that the fact that
// you should only call the function with
// 2nd argument !== 0 because that really
// makes no sense. If instead the function
// returned Infinity that would not cause
// an error and would probably later produce
// more inifiniies and then looking at your
// results you would no they make no sense
// but you would have hard time fioguring
// out where Infinity entered the picture
// in the first place.
//
//  ( 2 / 0  ) + 5 === Infinity



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
  // Above neq() because the 1 has
  // been replaced by Type(Number)
  // in 'types'.

  ok  (types[0].name === "Type(1)" );
    StringOrNull = Type (String, null);

  A ( [1, StringOrNull ]
    , 1,  null
    );

  A ( [1, StringOrNull ]
    , 1   // nulltype accepts undefined
    );

 fails
 ( _=>
   A ( [1, StringOrNull ]
     , 1,  321
     )
 );

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
{ let {Type, A, ok, not, fails, x, is, err, log
      , eq, neq, isEq, isNeq, xNot
      } = this;



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

  ok (A3b.name === "Type([Type([Type([Type(1)])])])" );
  let GetBack     = Type([Type([Type([Type(1)])])]);
  ok (GetBack.name  ===  A3b.name );

/*
What the above shows is that if I have a type like
A3b which only depends on built-in JavaScript classes
I can then send the NAME of the type over the network
and whoever gets it can evaluate it and get the
exactly same type to use in their own applications.
 */

/* ==================================
   TRUTHY TYPE
 */

TruthyType ();

function TruthyType ()
{
let TT = Type (true);

x (-1  , TT)
x ("s" , TT)
x (true, TT)
x ({}  , TT)
x (x   , TT)

fails (_=> x (0    			, TT));
fails (_=> x (""   			, TT));
fails (_=> x (false			, TT));
fails (_=> x (null 			, TT));
fails (_=> x (undefined, TT));

// Because x() converts its
// 2nd arg to type when it's not
// the next will work also:

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
}

/* ==================================
   FALSY TYPE
 */
FalsyType ();

 function FalsyType ()
 {
let FT = Type (false);

x (0    , FT);
x (""   , FT);
x (false, FT);
x (null , FT);
x (undefined, FT);

fails (_=> x (1     , FT));
fails (_=> x ("s"   , FT));
fails (_=> x (true  , FT));
fails (_=> x ({}    , FT));
fails (_=> x (x     , FT));


// Because x() converts its
// 2nd arg to type when it's not
// the next must work also:

x (0    		, false);
x (""   		, false);
x (false		, false);
x (null 		, false);
x (undefined, false);

fails (_=> x (1     , false));
fails (_=> x ("s"   , false));
fails (_=> x (true  , false));
fails (_=> x ({}    , false));
fails (_=> x ([]    , false));
fails (_=> x (x     , false));
 }

/* ==================================
   REGEXP TYPE
   Using a RegExp as a typer-specifier
   creates a type whose members are all the
   strings which match the regexp.
 */
 RegExpType ();

function RegExpType ()
{
let BT = Type (Boolean);   // just checking
x(true, BT);
x(false, BT);
fails(_=> x(1, BT));

//     'a' < 'b'

 let HasA = Type (/A/);

 x ('A'  , HasA);
 x ('bAb', HasA);
 fails(_=> x ('a' , HasA));
 fails(_=> x ('bb', HasA));
 fails(_=> x (''  , HasA));

// Using implicit type-creation:
 x ('A'  , /A/);
 x ('bAb', /A/);
 fails (_=> x ('a' , /A/));
 fails (_=> x ('bb', /A/));
 fails (_=> x (''  , /A/));

// Using RegExp flags:
 x ('A'  , /a/i);

x (5, /\d/);
fails (_=> 5 . match(/\d/));
}



/* ==================================
   BIGGER OR EQUAL TYPE

*/
BiggerOrEqualType ();

function BiggerOrEqualType ()
{
x     ( 0, 0);
x     ( 0.001, 0);
fails (_=> x ( -0.001, 0));


Number(5) >  1;
x (new Number(5), 1) ; // 5 is >= 1

fails(_=> x (new Number(5), 7));
fails(_=> x (5, 7));


x (new Number(5), 5) ;   // 5 is>= 5
x (6, 5) ; // 6 is >= 5
x (5, 5) ; // 5 is >= 5

let smallPositiveReal = 0.0001;

// 0 or bigger:
x (0, 0);
x (smallPositiveReal + 0, 0);

// Positive or Negative numbers?
// Must use combination of booleans
// but that is easy with ok() and
// built-in JavaScript logical operators:

ok ( 0.1 === 0 || 0.1 > 0);
ok ( 0   === 0 || 0   > 0);

}



/* ==================================
   STARTS WITH TYPE

*/

StartsWithType ();
function StartsWithType ()
{
 // next will work because
 // because every string has "" as prefix

  x ("abc", "");
  x ("abc", "a");
  x ("abc", "ab");
  x ("abc", "abc");

  fails (_=> x ("Abc", "a"));
  fails (_=> x ("", "a"));
}



/* ==================================
   CONSTRUCTOR TYPES

   Types which already exist in JavaScript
   are String, Number, Boolean Object, Function.
   They are the buillding blocks of moe complex
   types. But you can easily create your own
   constructors or "classes" which can be
   used as "types" as is.

   What we mean by 'ConstructorType' is really
   a SumType with only one addend.

 */

ConstructorType ();

function ConstructorType ()
{

// JS-SHORTCOMING IS THIS:
not (123   instanceof Number);
not ("abc" instanceof String);

// JS-PROBLEM 2:  'instanceof' easy to mistype

// cisf SOLUTION:
ok (123   instanceof Type(Number));
ok ("abc" instanceof Type(String));

// cisf SOLUTION 2: cisf type-checking Shorthands:
x (123   , Number);
x ("abc" , String);


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

}

/* ==================================
   SUM TYPES
 */

SumType ();

function SumType ()
{
  let ST  = Type (String, Number);
  let ST2 = Type (ST);
  ok (ST === ST2);

  ST2 = Type (ST, ST);
  not (ST === ST2);
}


/* ==================================
   NULL TYPES
 */

 NullType ();

function NullType ()
 {
 let NullT = Type(null);
 x (null, NullT);
 x (undefined, NullT);

/*
NulLType is not very useful by itself.
It is useful as part of a SumType for saying
that IF something is NOT null THEN it mus be
a value of a specific type:
*/

  let StringOrNull         = Type (String, null);
  ok (StringOrNull.name === "Type(String, null)" );

  x (null     , StringOrNull);
  x (undefined, StringOrNull);
  x ("", StringOrNull);

  fails (_=> x(123, StringOrNull));

  }


/* ==================================
   FUNCTION TYPES
 */

// A Type that describes a function which
// take 2 arguments String and Number, and
// returns a Boolean:

FunctionType ();

function FunctionType ()
{
const FunkSNB
= Type ( () => [String, Number, Boolean] );

let funk = (a,b) => true;
x (funk, FunkSNB);

let funk2 = () => false;
x (funk2, FunkSNB);

let funk3 = () => 123 ;
not (is (funk3, FunkSNB));

ok ( (()=> false) instanceof  FunkSNB);


  let ft = new FunkSNB ();
  ft();
  ok (is (ft, FunkSNB) );


  ok (is (ft()     , Boolean));
  ok (is (ft(1,2,3), Boolean));
}



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

PredicateType ();

function PredicateType ()
{


function odd_p (n)
{ if (! arguments.length)
	{ return 7;
	}
	if ( Math.abs (n % 2) === 1 )
	{ return true;
	}
}

let Odd = Type (odd_p);
x   (1     , Odd);
x   (-1    , Odd);
not (is(2  , Odd))
not (is(-2 , Odd))
not (is(0  , Odd))
not (is(1.5, Odd))



  function odd_p2 (n)
  { if (! arguments.length)
    { return example ();
    }
    if ( n % 2 === 1 || n % 2 === -1)
    { return true;
    }

    function example ()
		{ let max    = Math.floor (Number.MAX_SAFE_INTEGER / 2)  ;
		  let bigOdd2 =  max  * 2 - 1 ;

		  let it  = rix (max) * 2 - 1 ;

		  if (rix(9) > 4)
			{ // it is important that edge-cases
			  // get testing in a limited test-run.
				it =  [bigOdd2, 1,3,5,7,9,11,13,15,17] [rix(9)];
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

  let Odd2  = Type (odd_p2);
  ok (Odd2.name === "Type(odd_p2)");

	let anOdd2 = new Odd2 ();   // boxed number
	let value = anOdd2.valueOf();
	ok (value % 2 === 1 || value % 2 === -1 );

	ok  (is (anOdd2, Odd2));
	ok  (is (value, Odd2));

	// BEWARE: It does not make a predicate-type
	// if the argument of Type() is a NAMELESS
	// function. That would create a Function-Type
	// instead.


		fails (_ => Type (n => n % 2 === 1));
		// You can not create predicate functions
		// from nameless functions. And if you
		// want to create a Functon-type then the
		// function you pass as argument must
		// return an array of types to tell the
		// argument- and result-types required
		// of the instances of that Function-type.
}


/* =====================================
   DEPENDENT TYPES
   mean type the members ow of which
   depends on some data expressed outside
   the would-be member.

   But this is most easily accomplished by
   creating an inner function that returns
   a Type whose definition depends on arguments
   passed to the outer function
 */


DependentType  ();

function DependentType  ()
{
function biggerThan ($y=0)
{ return isBigger;

	function isBigger (x)
	{ if (x === undefined )
		{  return $y + 1;
		}
		return x > $y;
	}
}

					 funkUsingDependentType (1, 2);
fails (_=> funkUsingDependentType (1, 1));
fails (_=> funkUsingDependentType (2, 1));


function funkUsingDependentType (a, b)
{ let BiggerThanA = Type (biggerThan(a));
	x (b, BiggerThanA);
}
}


/* ==================================
   OBJECT TYPES

   {} means a type whose members must
   have the same keys as the spec-{}
   from which the type is created,
   and whose values are of the type
   that was used as the value of that
   field in the spec.
 */


ObjectType ();


function ObjectType ()
{

let Person =
Type ({ name: String
      , age : Number
     });

let bob =
{ name:  'Bob'
, age: 3.14
};
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


let XOb = Type ({x: 2});

ok  (is ({x: 777}  , XOb));
x   ({x: 777}      , XOb );

not (is ({x: "abc"}, XOb));
not (is ({x: null} , XOb));
not (is ({Z: 777}  , XOb));

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
    "Type({a: Type({b: Type({c: Type(1)})})})"
   );
x ({a: {b: {c: 77}}}, OB3);

}


/* ==================================
   ARRAY TYPES

   [] specifies a type whose members
   are arrays whose elements are of
   one of the types given as elements
   of the spec-array.

 */

ArrayType ();

function ArrayType ()
{
x ( [1, "A"],  Type ([String, Number]) );
// Note String and Number in the type are alternative
// element types, their order does not matter.

x(123, Type (5));

fails (_=> Type (new Number(5) ));
// Above fails because a boxed number
// is not a legal argument of Type().
// That is because Type recognizes only
// very specific types of objects as its
// argument: {}, [] and specific types
// of Functions. These all are instances
// of Object, so only specific types
// of objuect-instances are allowed.
//
// If any instanceof Object would be
// turned into the type that is its
// constructor  then a {} would be turned
// into Object which is not the same thing
// as the type we create from a {}, which
// checks field-names and value-types of
// its members.

// Also if predicate-functions were turned
// sinmply into the type Function, they would
// not be turned into a PredicateType which
// is not same type as Function.
//


x ( [1, "A"],  [String, Number] );

  const  NArr = Type ([Number]);
  ok  ([1]      instanceof NArr);
  not (["a"]    instanceof NArr);

  ok  ([1,2,3  ] instanceof NArr);
  not ([1,2,"3"] instanceof NArr);
  ok  ([]        instanceof NArr);



  ok (NArr.name = 'Type([Number])');

  const NA2  = Type ([1]);
  ok (NA2.name = 'Type([Number])');


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

}

// MULTI-D ARRAYS:
MultiDArrayType ();

function MultiDArrayType ()
{
let A2 = Type( [ [1] ] ) ;
ok ([[5]] instanceof A2);


let A3 = Type( [[[ 1 ]]] ) ;
ok (A3.name === "Type([Type([Type([Type(1)])])])" );

A3 = Type( [[[ 1, "", false ]]] ) ;

ok (A3.name ===
    "Type([Type([Type([Type(1), Type(``), Type(false)])])])"
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


// TUPLE-TYPES:
// So above is the ArrayType which has
// N alternative element-types What about
// TUP)LE=-types? Well that is a subtype
// of some array-type where each element
// must be a memeber of one of the alternative
// element-types but also they muts be in
// correct order. That could be spcified
// with a predicate-type OR MORE SIMPLY
// we can use the A-api for testing for
// that:

let arr = [1, "abc"];

A ([Number, String],  ... arr);
A ([1, ""],  ... arr);

fails
(_=>
  A ([String, Number],  ... arr)
);

}


// EQUALS TYPE
// Equals-type is something which
// has as its member all values which
// are equal to a specific value.
// NOte equal is not the same as  == or ===.
//
// We dont' create EqualsType as a
// Type of its own because you really
// want to test whether something is
// a memeber of the type or not and
// you can do that with eq(), isEq()
// neq(), isNeq().

EqualsType ();

function EqualsType ()
{
eq  ([1,2,3], [1,2,3]);
neq ([1,2,3], [1,2,3,4]);

ok (isEq  ([1,2,3], [1,2,3  ]));
ok (isNeq ([1,2,3], [1,2,3,4]));
}

/* ==================================
   NON-TYPES

   Calling Type() with no argument creates
   a type which is nobody's type.
   It is not very useful but it is possible
   you might find a use for it.

*/

EmptyType  ();

function EmptyType  ()
{
   let NBT = new Type();
   not (is (123, NBT));   // but we can't test them all
}


/* =====================================
 LEGACY MISC TESTS:
*/

xMiscTypeTests () ;

function xMiscTypeTests ()
{

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


// ------------------- MISC: ----------------------


  // Since 3.1.2 this also works:
  x( 111, 5);
  // but since 4.x it works for a different reason,
  // it works because 111 >= 5
  ok (is( 111, 5));

  ok (is(new Number(111), 5));

  // But not everything can be turned into a type:

   fails (_=> x("".toString, "".toString) );
   // above fails for 2 reasons.
   // 1.  "".toString() is not a predicate function
   //     because it can not be called wiothout argument
   //     to return an example instance of it and
   //  2. And even if it was calling it with itself
   //     as argumewnt woujld not reurn === true.

   let S2 = Type ("abc");
   ok (S2 !== String);
   x (123  , Type(1)); // 123 >= 1

   x ( true, Type(true));
   fails (_=> x ( "a" , "b" ));
   fails (_=> x ( "a" , "A" ));
   x ( "Abc" , "A" );


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
		{ vof = non2.valueOf();
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

}


return;
}

// -----------------------------------------------

function x ()
{
  let x=this.x, ok=this.ok, fails=this.fails;

  // x (123, Object);
  // above would fail and take you to debugger


  // BASICS:
  x (3, Number);
  x ("3", Number, String); // because "3" is a Number OR is a String.

  fails (() => x(null     , Number));
  fails (() => x(undefined, Number));
  fails (() => x("3", Number));  // because "3" is a String



  // New in v. 3.1.2:
  // A number, string or boolean can be used
  // as a shorthand for its constructor as
  // 2nd argument of x(). This is how they
  // behave with Type() too.

  // NO MORE: x (0, 1)
  // The shorthands were confusing
  // 0 is not 1


  // That makes it unnecessary to type Number and
  // String too many times.

  // The next fails because the point is to
  // provide a shorthand and creating a boxed
  // number does not make it shorter but longer:

  fails (_=>  x(123, new Number(5)));


  x (""   , String);
  x (0    , Number);
  // The above can be said shorter this
  // shorthand can be used  only for
  // with atomic strings and numbers
  // as type:
  x (""   , ""   );
  x (0    , 0    );


  // When x() is called with a SINGLE ARGUMENT
  // it succeeds as long as that single argument
  // is not undefined or null:

  x(0); x(1); x(false); x("");
  fails (_=> x(null));
  fails (_=> x(undefined));
  fails (_=> x());

  // null denotes the null-type which includes
  // only null and undefined as its memebers:
  x(null     , null);
	x(undefined, null);
	fails (_=> x(false, null));

  // But note that undefined is nothing,
  // it is not interpreted as a type:
	fails (_=> x(null, undefined));
	fails (_=> x(undefined, undefined));
	fails (_=> x(0, undefined));

  // How we use x() often:
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

function xNot ()
{
  let xNot=this.xNot, x=this.x, ok=this.ok, fails=this.fails
    , is=this.is ;

  xNot (null);
  xNot (undefined);

  xNot ();
  // v. 4.5
  // Does NOT fail because x() would fail.
  // xNot() is the negaiton of x().

  ok (is (null     , null));
  ok (is (undefined, null));

  // null and undefined are the only
  // members of type represented by null:

  x               (null     , null);
  x               (undefined, null);
  // Therefore:
  fails (_=> xNot (null     , null));
  fails (_=> xNot (undefined, null));

  x (null     , String, null);
  x (undefined, String, null);
  fails (_=> xNot (null     , String, null))
  fails (_=> xNot (undefined, String, null))

  xNot (null, 1,2,3);
  x (false);
  fails (_=> xNot (false));

  x (true)
  fails (_=> xNot (true));

  x (0)
  fails (_=> xNot (0));

  x("");
  fails (_=> xNot (""));

}

// -----------------------------------------------

function r ()
{
  let {r, ok ,  not, log
      , path , fs
      , $path, $fs

      }  = this;

  if (! r)
  { log (`cisf/tes.js: There is no 'r()'
    when running in the browser so we won't
    try to test it either, on the browser`);
    return;
	}


// 4.4.0:
  ok ($path === path);
  ok ($fs   === fs);

// Made the exports of cisf have $path and $fs
// as synonyms for path and fs because often you
// want to have a local variable path and it is
// a good idea to mark variables containing
// build-in system imports differently from
// ordinary local variables.

	ok ( r ("path") === require ("path")) ;
	ok ( r ("fs"  ) === require ("fs"))   ;  // etc.

  let cwd = process.cwd();
  ok (r.abs()   === cwd );
  ok (r.abs("") === cwd );
  ok (r.abs(cwd) === cwd );

  let relPath = r.rel(__filename);
  not (path.isAbsolute(relPath));
  ok (r.abs (r.rel (__filename) ) === __filename);


  ok (r (relPath) === require (__filename));

  // Above is the main reason for r(), you can
  // require modules by giving r() their path
  // relative to the cwd, so you don't need
  // to type out the full absolute host-specific path,
  // or use fragile non-portable module-relative
  // upward paths. (you can not copy them elsewhere
  // and expect them to require the same module)

let rel = r.rel ;
let abs = r.abs ;

let pathBelowCwd =  $path.resolve ("./abc");
let pathBelowCwd2 = $path.resolve (rel (pathBelowCwd) );
ok (pathBelowCwd2 === pathBelowCwd) ;

let pathAboveCwd =  $path.resolve ("../abc");
let pathAboveCwd2 = $path.resolve (rel (pathAboveCwd) );
ok (pathAboveCwd2 === pathAboveCwd) ;


cwd = process.cwd();
let somePathAboveCwd = "C:\\Users";
let rel3 = rel (somePathAboveCwd);
let abs3 = abs (rel3);
ok (abs3 === somePathAboveCwd) ;


// ok (abs (rel (abs ("a/b/c/d")))  === abs("a\\b\\c\\d"));
// Above would not be true on linux

let relPathToDiskRoot = rel ("/") ;
let diskRoot          = abs (relPathToDiskRoot);
ok (diskRoot.split($path.sep).length === 2);

relPathToDiskRoot = rel ("\\") ;
diskRoot = abs (relPathToDiskRoot);
ok (diskRoot.split($path.sep).length === 2);


// If 1st arg is relative rel() returns
// is as is, since it is already relative:

ok (rel ( cwd      ) === ".")
ok (rel ("abc"     ) === "abc");
ok (rel ("./abc"   ) === "./abc");
ok (rel ("../abc"  ) === "../abc");
ok (rel ("./../abc") === "./../abc");


// 2nd OPTIONAL ARG CAN SPECIFY A BASE
// FOR CALCULATING THE RELATIVE PATH:

ok ( rel ( cwd     ) === "."); // Using default foir 2nd arg
ok ( rel ( cwd, cwd) === "."); // Passing the default value for 2nd arg explicitly

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

}


	/*
	note:
	$path.resolve() ->
	C:\Output\4_PRODUCE\Dev\ClassCloud

	$path.resolve("abc") ->
	C:\Output\4_PRODUCE\Dev\ClassCloud\abc

	$path.resolve("abc", "efg") ->
  C:\Output\4_PRODUCE\Dev\ClassCloud\abc\efg

   r.abs("abc" ) ->
   C:\Output\4_PRODUCE\Dev\ClassCloud\abc

   So r.abs() is much the same as path.resolve.
   Juts simpler because to understand because it
   takes only one argument. But it also has

   r.rel ("abc")
   -> .\abc

   r.rel ("../../abc")
   -> .\:\Output\4_PRODUCE\abc


	 */

function log()
{ let  ok=this.ok, log=this.log;

  let s = log (`Test-method log() executed`);
  ok (s.match(/Test-method log\(\) executed/));

   let s2 = log (`
   
           Test-method log() executed.
   
   yes
   
           yes2
   `);

/*

##### v. 3.0.4: Better log()

As before log() removes whitespace from the
beginning of NON-empty lines in its argument.
That makes it convenient to format a multi-line
log-message aligned with the code-block it
exists in.

in v.3.0.4 it no longer trims the argument-string
as a whole . Which means you can put empty lines
at the beginning and end of your log-message
if you want to.

This often makes sense as it allows you
to make specific important log-messages
to stand out from the crowd when inspecting
a long log.

 */

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
{ let ok=this.ok, err=this.err, fails=this.fails;

  let e  = fails ( _=> err ('something wrong') );
  let e2 = fails ( _=> err ('wrong type', TypeError) );

  err (null);
  err ();
  err (undefined);

  /*
  In v. 4.3.0 the above 3 no longer
  cause an error at all.

  That is VERY useful when using
  Node.js async APIs because their
  callbacks are called whether there
  was an error or not. So now you can
  write the callback simply with ES6
  arrow-syntax as:

   fs. writeFile
   (path
   , aString
   , e => err(e)
   );

   The callback then does nothing if
   there was no error but throws an
   error if there was one.

   Of course you could easily write
   a similar do-nothing-if-no-error
   -callback yourself, but you would
   have to write it everywhere you
   need it, or require the module where
   you wrote it. If you require("cisf")
   you don't need to do that and get
   all the other APIs of cisf with one
   require. Kill two+ flies with one swat.

   */


  // err ('halts in debugger'); // YES
  // Above would halt, whereas the fails-tests
  // before it do not.




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

/**
 ok() throws an error iff
 it is called with argument
 which is "falsy".
*/


function ok( )
{ let ok = this.ok, is=this.is, not=this.not, fails=this.fails
    , x=this.x, Type=this.Type, isNot=this.isNot;

  ok (true);
  ok ("non-empty string");
  ok (1);
  ok ({});
  ok ([]);

  ok ("non-empty string") ;
  ok (1)   ;

  fails ( _ => ok()          );
  fails ( _ => ok(undefined) );
  fails ( _ => ok(false));
  fails ( _ => ok("") );
  fails ( _ => ok(null) );
  let v = 4;
  let e = fails( e =>  ok(v%2, "v must be odd"));
  x (e , Error);

  ok ( ok instanceof Function);
  ok ( ok instanceof Object);


let e33 =
fails ( _=> "s".noSuch());

ok ( fails ( _=> "s".noSuch())
     instanceof Error
   );

ok (is (2, Number) );
ok (x(2, Number) === 2);

fails(_=>  x("s", Number));


fails (_=> fails ( _=>  123 ));

fails (_=> not (ok  ("")));

ok  (ok);
ok  (is (ok, Function));
not (is (ok, String)  );

ok  (is (is,  Function));
ok  (is (not, Function));

const SorN = Type (String, Number);
not ( is(true, SorN) );

ok (isNot ("s", Number));


const  MaybeError = Type(Error, null);

not ( is (0, MaybeError));
  return;
}


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

// Copyright 2018 Class Cloud LLC
}

