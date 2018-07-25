let CISF_VERSION = "4.1.0" ;

/* =========================================
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
   USAGE:
   let {ok, x, r, not, fails, log, warn, err, Type, is
       , A, eq, neq, w
       } = require ("cisf");

   Or pick just the functions you need
   for example:
   let {ok, x} = require ("cisf");

   UPDATES-ANNOUNCEMENTS:
   https://twitter.com/ClassCloudLLC
   =============================================
*/

"use strict"


let path, fs, Path, Fs;
if (typeof require === "function") // in the browser it is not
{ path = require ("path");
  Path = path;
	fs   = require ("fs");
	Fs   = fs;
}


// CISF will be global in the browser,
// but not in Node.js. Users need it
// on the browser to access the cisf
// APIs therefore it must be named simply.


const DATA = Symbol('CISF');
var CISF   = CISF_inner ();
CISF.v     = CISF_VERSION;

if (typeof module !== "undefined")  // in the browser it is undefined
{ module.exports =  CISF;
}

// ----------------------------------------


function CISF_inner  ()
{ var C          = _Canary()    ;

  let ok=C.ok, not=C.not, x=C.x, fails=C.fails, is=C.is, r=C.r;

  let isNot=C.isNot ;
  let isEq=C.isEq, isNeq=C.isNeq ;

  let Type = _Type;
  Type[DATA] =  {};

  let $SuperType = _Type ();

  let Xer = _Xer();
  let AssertError = class AssertError extends Error { };


  let api =
  { Type
  , ok, not, x, A, eq, neq, fails
  , is, isNot, isEq, isNeq
  , w,  log, err, r, path, fs
  };

  return api;

 // You dont need w() to get hte 0th element
 // but if you already have it wrapped then
 // you can not use [] so its good to have 'first()'.

	function w (anArray)
	{ return (
		{
		  last() {return anArray[anArray.length - 1]}
    , first() {return anArray[0]}

		, car () {return anArray[0]}
		, cdr () {return anArray.slice(1)}

		, map (... mapArgs )
		  { if (anArray instanceof Array)
			  { return anArray.map (...mapArgs);
			  }
			  if (typeof anArray === "number")
			  {  let  arr = [];
			     for (let j=0; j < anArray; j++)
					 { arr[j] = j;
					 }
			     return arr.map (...mapArgs);
			  }

			  if (typeof anArray === "string")
			  {  let arr = anArray.split("");
			     return arr.map (...mapArgs);
			  }

			  if (typeof anArray === "function")
			  { let first   = mapArgs[0]; // more natural to have the first first
			    let howMany = mapArgs[1];
			    if (! howMany)
					{ howMany = 10;
					}
					if (! first)
					{ first = 0;
					}
					let funk   = anArray;
					let arg    = first;
					let values = [];
          for (let j=0; j<howMany; j++)
					{ let v = funk(arg);
						values.push(v);
						arg = v;
					}
			    return values;
			  }

			  if (   anArray === null ||   anArray === undefined)
			  {
						let array = mapArgs[0];
						let valuesWithProperties = [];
						for (let j=0; j< array.length; j++)
						{ let v = array[j] ;
						  if (v === null)
							{  continue;
							}
							if (v === undefined)
							{  continue;
							}
							valuesWithProperties.push(v);
						}
						return valuesWithProperties;
				}


			  if ( typeof anArray === "boolean")
			  {
					if (anArray === true)
					{
						let array = mapArgs[0];
						let truthyIndexes = [];
						for (let j=0; j< array.length; j++)
						{ if (array[j])
							{  truthyIndexes.push(j);
							}
						}
						return truthyIndexes;
					}
					if (anArray === false)
					{ let array = mapArgs[0];
						let falsyIndexes = [];
						for (let j=0; j<array.length; j++)
						{ if (! array[j])
							{  falsyIndexes.push(j);
							}
						}
						return falsyIndexes;
					}
			  }

			  if ( anArray instanceof RegExp)
			  {



 let see = 'sfAvEhRRihTT7Ai'.match(/[A-Z]+/g) ;
 // Above is a simple way to get all
 // matched strings from the source-string,
 // in order, with duplicates if those exist.
 // What it does NOT give us is the array of
 // all the matches as match-objects which know
 // their position, sub-froups etc. That can be
 // had fopr a SINGLE match by omitting the
 // g-flag but that gives us only a single matche
 let see2 = 'sfAvEhRRihTT7Ai'.match(/[A-Z]+/) ;

 // with the g-flag above produces all matches
 // as an array. But this could seem simpler:
 //         w(/[A-Z]/).map('sfvEhRihTT7Ai')
 // no need
 // to remember to use the flag or know what it means.


let reg    ;
try {
reg = new RegExp (anArray, anArray.flags + 'g');
// Means user does not need to add the g-flag we do.
// Without it the loop below could produce only one match ever.
} catch (e)
{
	console.log(e);
  reg = anArray;
  // Creating a new RegExp with different flags
  // does NOT work on Edge. This just means that
  // when using w() with a regexp you should put the
  // g-flag in there yourself else it will
  // find only one match, on the Edge-browser.
  let e2 = new Error (
`KNOWN ISSUE: Do not use
cisf.w(aRegExp)
on Edge, causes:
${e}  
` );
   throw e2;
   // Better to give a clear error-message.
}


let s       = mapArgs[0];
let matches = [];
let j = 0 ;
while (true)
{ j++;
  if (j > 999)
	{ console.log (`Found more than 999 RegExp matches, returning only 999`);
	  // This happens on Edge.
	  return matches;
	}
  let m =  reg.exec (s);
  if (m)
	{ matches.push(m);
	} else
	{ return matches;
	}
}
/*
 what can this mean?
 w(/abc/).map(  "someString" )

 ANSWER:
 Get all the matches from the string as array.
 note we dont take ina function to map with
 because the result is an array so you can
 easily do that yourself.

  */
			  }


//			let values = Object.entries (anArray)
//					           .map (e => e[1]);
			let keys     = Object.keys (anArray);
    	let mappedOb = keys.map (... mapArgs)

      return   mappedOb
		  }

		}      )
	}


function notXer(v )
{ if (! ( v instanceof Xer))
  { return true;
  }
  return false;
}

function xer(v, p)
{ if (! ( v instanceof Xer))
  { return v;
  }
  let em = `
${ v} 
`;
  err (em);
}

function _Xer()
{ return class
  Xer extends Error
  { constructor (arg)
     { let msg = trimLineBeginnings (arg + "");

       let it = super(msg)
      return it;
     }
  }
}

function trimLineBeginnings (s)
{ let pat = /\n[ \t]+(\S+)/g;
  let s2 =
 (s + "") // .trim()
         .replace (pat, `\n$1`);

  return s2;
}


function _ArrayType (  $elementTypes ) // it muts be a single array
{

  return  class  ArrayType
        extends $SuperType
  {

    constructor (   )         // of ArrayType
    { super( );
      let types =  this.constructor[DATA].elementTypes;

      let it = [];
      let size = rix (40);
      if (rix(9) === 1)
      { size = 0;
      }
      for (var j= 0; j<size; j++)
      { let randTypeIx = rix(types.length);
        let ElemType   = types[randTypeIx];
        let value      = new ElemType();
        it.push(value);
			}

			return it;


	function  rix (leng)
  { let randix =  Math.floor(Math.random() * leng );
        return randix;
  }
    }


   static toString()  // of ArrayType
   {
     let ets = this[DATA].elementTypes;
     if (! ets)
     { return `Incomplete array type`;
       // the name muts be assigned
       // again in the array=-type class  after super.inity() has ocmpletet
		 }
     let etNames = ets.map (e=> e !== null && e !== undefined
                                ? e.name
                                : 'null'
                           ).join (', ');
     let s = `Type([${etNames}])`;
     return s;

     /*
     note how now we dont confuse the alternative
     element-types with the actual elements. We used to
      */
	 }

    static [Symbol.hasInstance] (shouldBeArray)
    {

       if (shouldBeArray && shouldBeArray.constructor === this)
       {  return true;
         // when we create new Odd(3)
         // we want it, the boxed value,
         // to also be instanceof Odd,
         // not juts the unboxed value 3.
			 }
			 // beware:  (! "b"  === false)
			 // therefore next we need 2 levels of parens:
			 if (! (shouldBeArray instanceof Array))
       { return false;
			 }
			 let elemTypes =  this[DATA].elementTypes;

			 for (var e of shouldBeArray)
       { // do not use instacenof here because unboxed numbers
         // are not instanceof Number
         let itsType = elemTypes.find(et => is(e, et) );
         if (! itsType)
         { // argument has an element which is not
           // an instance of any of the element-types.
           return false;
				 }
			 }
			 // found no bad elements so yes the arg-array
			 // is my instance
			 return true;
    }

    static init ()  // of ArrayTyppe
    {
      super.init();
      // we need to store the predicate
      // function and the example unboxed instance
      // so that my instanceof anbd constructor

      let realElemTypes
      = $elementTypes.map (e=> Type(e));

      this[DATA].elementTypes =  realElemTypes;

      let typeName =  this + "" ;
      zet (this, 'name', typeName, "force");

      // note element-types means the alternative
      // types of each element, not types of
      // different elements. This is NOT A TUPLE-TYPE.
      // Tuple-types you must do with p[redicate-types
      // there is no special syntax for them.

      return this;
		}
  } .init()
}


function _ObjectType ($obSpec )
{
 // calling the predicateFunk wihtout arguments
 // gives the example member of the type.


  return  class  ObjectType
        extends $SuperType
  {

    constructor (   )  // of ObjectType
    { super();
      let spec = this.spec ();
      let  ob   = {};
      for (var p in spec)
      { let fieldType = spec[p];
        let fieldValue = (new fieldType()).valueOf() ;
        ob [p] =  fieldValue;
      }
      return ob;
    }

    static [Symbol.hasInstance] (value)  // of ObjectType
    {

       if (value && value.constructor === this)
       {  return true;
         // when we create new Odd(3)
         // we want it, the boxed value,
         // to also be instanceof Odd,
         // not juts the unboxed value 3.
			 }

       let spec = x(this[DATA]. unfoldedSpec);
			 for (var p in  spec )
       { let fieldType  = spec [p];
         // IT MUTS BE A SINGLE TYPE BY NOW
         // but also there is no reason why 1 coudl not be
         // a shorthand for Number etc. Only point is that
         // {x:1} is not shorthand for Object.

				 let fieldValue = value[p];
         if ( is (fieldValue, fieldType))
         { continue;
         }
				 return false;
			 }


			 return true;
    }

   static toString()  // of ObjectType
   {

     let obSpec  = this[DATA].unfoldedSpec ;
     if (! obSpec)
     { return `Incomplete ObjectType`;
       // the name muts be assigned
       // again in the array=-type class  after super.inity() has ocmpletet
		 }


		 let s  = "{" .trim() ;
		 // somehow the minifier added a extra space above
		 let V = CISF.v ;

		 let entries
		 = Object.entries (obSpec)
       . map
       ( ([k, v]) =>
         { return `${k}: ${v.name}`;
				 }
       ) ;
     s +=  entries.join (`, `) + `}`

     let s2 = `Type(${s})`; // so it looks like the code to create it
     return s2;

     /*
     note how now we dont confuse the alternative
     element-types with the actual elements. We used to
      */
	 }

    static init ()          // of ObjectType
    {
      super.init();

// yes get the real types so if a value is []
// it bceoms array type and if it is {}
// it becomes ob ject-type.

      let unfoldedSpec  = {};
      for (var p in $obSpec)
      {
        let TheType = Type ($obSpec[p]) ;
         // The trick is that if it was already
         // a type it remains itself. If it is
         // an Array or Object it becomes Arry or Object type.
         // If it is  atom it becomes its constructor
         // so 1 can be a shorthand for Number and
         // "" shorthand for String.
         unfoldedSpec[p] =  TheType;
      }
      this[DATA].unfoldedSpec =  unfoldedSpec;

      let typeName =  this + "" ;
      zet (this, 'name', typeName, "force");
      return this;
		}

		spec ()
    { return this.constructor[DATA].unfoldedSpec;

		}

  } .init()
}

function _FunkType ($namelessFunk )
{
 // Calling the predicateFunk wihtout arguments
 // must give an example member of the type.



  return  class   FunkType
          extends $SuperType
  {

    constructor ( value )
    {
      super(value); // catches the error of value not undefined
      let ResultType = this.constructor [DATA].resultType;

      let funk =  () => new ResultType();
      return funk;
    }


   static toString()
   { return `Type(${$namelessFunk.name})`;
	 }


    static [Symbol.hasInstance] (value) // of FunkType
    {
      let argTypes   = this [DATA].argTypes  ;
      let ResultType = this [DATA].resultType;
      let argValues  = argTypes.map
      ( ET =>
        { let it = new ET();
          return it;
        }
      );
      let result;
      try
      { result = value (argValues);
        if (is (result, ResultType))
        { return true;
        }
        return false;
			} catch (e)
      { return false;
			}

    }

    static init ()
    { super.init(); // DATA, name,  etc.
			 let argsAndResultType ;

			 try
       { argsAndResultType = $namelessFunk ( );
       } catch (e)
       { debugger
         err
         ( `FunkType -argument-function
           causes an error when called without
           argument. Therefore that function 
           does not specify a valid predicate 
           type:      
           ${$namelessFunk}.
           `
         );
			 }
			  if (! (argsAndResultType instanceof Array))
        {
          err
          (`Function-type's defining function returns
            a non-array. It should return an array of
            the types which are the argument- and 
            result-types of functions that would be 
            instances of the function-type being created.
            
            Bad defining function: ${$namelessFunk}
            `
          )
        }

			 let  argTypes   = argsAndResultType.slice (0, -1);
			 let  resultType = argsAndResultType.slice (-1)[0];

// [1,2,3] [-1]
			 // For the spec to mean that result should be nothing
			 // you must spec null-type as the result-type.

       this[DATA].argTypes   = argTypes;
       this[DATA].resultType = resultType;

       return this;
		}


  } .init()
}

function _PredicateType ($predicateFunk )
{
 // Calling the predicateFunk without arguments
 // must give an example member of the type.

  return  class   PredicateType
          extends $SuperType
  {
    constructor ( value )
    {
      super(value);
      if (value !==  undefined)
      { ok (value instanceof  PredicateType)
      };

      let pf =  this.constructor[DATA].predicateFunk
      let exampleInstance = pf ();

      // Now that predicate function can return
      // many different values it is important
      // that we make sure they are actually
      // instances of the type:

      ok (is (exampleInstance, PredicateType)
         , `The example-instance of a PredicateType
            is not an instance of it:
            ${exampleInstance} 
            !
            `
         );

      if (   exampleInstance === undefined
         )
      { err
        (`Predicate function's member-function
          return undefined. The function:
          ${pf} 
         `) ;
        // This must be an error because
        // constructors can never return
        // undefined so you could never
        // CONSTRUCT such a memeber.
      }

      if ( exampleInstance === null
         )
      { return exampleInstance;
        // because predicate can be arbitrary
        // members can be arbitrary.
      }
      if (typeof exampleInstance === "object")
      { return exampleInstance;
      }
      // constructors can notr return unboxed
      // values  so we must convert it to its
      // boxed version:

      // let obv = new (exampleInstance.constructor)();
      // was wrong. Instead muts fo:
      let obv = new (exampleInstance.constructor)
                     (exampleInstance);

      return obv;

    }

   static toString()
   {
     return `Type(${$predicateFunk.name})`;
	 }

    static [Symbol.hasInstance] (value)       // of PredicateType
    {

      if ( value !== undefined
         && value !== null
         && value.constructor === this
          )
       {  debugger
          return true;
         //  not sure if this is needed but makes
         // sens that if you are constructed by me
         // then you are my instance. But this should
         // really not happen because constructor
         // should return instances of the base-type.
			 }

			 let see;
			 if (value === undefined)
       { // undefined can never be an instacne of predicate types
         // because their constructor could never return it.
         // The error is caught already in the constructor
         // but maybe not because there can be inifnite number
         // of them.
          return false;
       }

       if (value !== null)
       { value =  value.valueOf();
         // because when we give the example instance
         // out from the constructor we muts have made
         // it sure it is boxedf, constructors
         // can not return unboxed values.

			 }
			 try
       { see = $predicateFunk (value);
       } catch (e)
       { debugger
         return false;
			 }
			 // 3.2.1: Predicate functions
			 // must return === true for all
			 // their members. Else you would
			 // too easily have x(Math.random, Math.random)
			 // in other words EVERY lowercased function
			 // which returns non-null zero or false would
			 // grant memebership to all their arguments.

			 if (see === true)
       { return true;
       } else
       { return false;
       }

    }

    static init ()
    { super.init(); // DATA, name,  etc.
			 let exampleInstance ;
			 let pf = $predicateFunk;

			 try
       { exampleInstance = pf ( );
       } catch (e)
       {
         err
         ( `PredicateType -argument-function
           causes an error when called without
           argument. Therefore that function 
           does not specify a valid predicate 
           type:      
           ${$predicateFunk}.
           `
         );

         /*
         We dont store the example instance
         anywhere because we can always call the
         predicate function without arguments
         again. Tha leaves open the possibility
         that the predicate function returns a new
         random or generator-based member each time
         it is called.
          */
			 }
       this[DATA].predicateFunk = pf;
       try
			 { x (exampleInstance, this)
			 } catch (e)
			 {

			 	err
         ( `PredicateType -argument-function
           ${pf} when called without argument 
           returns  a value which is NOT an
           instance of the purported predicate 
           type. In other words the type-definition
           is invalid.
           
           Why is this required? Because we
           want to test that the type-definition
           defines a type with at least one 
           existing instance, we dont know
           what that might be so ytou should
           provide it by reurni8ng it if the
           type-predicate is called without 
           argument.  
           `
         );

			 }



      return this;
		}

  } .init()
}



function _TruthyType (   )
{
  return  class  TruthyType extends $SuperType
  {
    static [Symbol.hasInstance] (value)
    { if (value)
			{ return true;
			}
			return false;
    }


    static init ()  // of TruthyType
    {
      let typeName =  this + "" ;    ;
      zet (this, 'name', typeName, "force");
      return this;
		}

    static toString ()
    {  return `Type(true)`;
		}

  } .init();

  }

function _FalsyType (   )
{
  return  class  FalsyType extends $SuperType
  {
    static [Symbol.hasInstance] (value)  // of  FalsyType
    {
       if (value)
			 { return false;
			 }
			 return true;
    }

    static init ()  // of FalsyType
    {
      let typeName =  this + "" ;
      zet (this, 'name', typeName, "force");
      return this;
		}

    static toString ()
    {  return `Type(false)`;
		}

  } .init();

  }

function _RegType (  $reg  )
{
  return  class  RegType extends $SuperType
  {
    static [Symbol.hasInstance] (value)
    { let reg = $reg;
      value = value + "";

     if (value.match (reg))
			{ return true;
			}
			return false;
    }


    static init ()  // of TruthyType
    { let typeName =  this + "" ;    ;
      zet (this, 'name', typeName, "force");
      return this;
		}

    static toString ()
    { let reg = $reg;
      return `Type(${reg})`;   // ->  Type(/a/) etc.
		}

  } .init();

  }

function _StartsWithType (  $prefix  )
{
  return  class  StartsWithType extends $SuperType
  {
    static [Symbol.hasInstance] (value)
    { let prefix = $prefix;
      value = value + "";
      if (value.match (prefix))
			{ return true;
			}
			return false;
    }

    static init ()  // of TruthyType
    { let prefix   = $prefix;
      let typeName =  this + "" ;    ;
      zet (this, 'name', typeName, "force");
      return this;
		}

    static toString ()
    { let prefix = $prefix;
      if (prefix === "")
			{ prefix = "``"
			}
      let s =  `Type(${prefix})`;   // ->
      return s;
		}

  } .init();

  }

function _BiggerOrEqualType (  $n  )
{
  return  class  BiggerOrEqualType extends $SuperType
  {
    static [Symbol.hasInstance] (value)
    { let n = $n;
     if (value >= n)
			{ return true;
			}
			return false;
    }


    static init ()  // of TruthyType
    { let typeName =  this + "" ;    ;
      zet (this, 'name', typeName, "force");
      return this;
		}

    static toString ()
    { let n = $n;
      let s =  `Type(${n})`;   // ->  Type(/a/) etc.
      return s;

		}

  } .init();

  }

function _AtomicType ( $atomicCtor )
{
    if ( $atomicCtor === true)
		{ return _TruthyType()
		}
    if (  $atomicCtor === false)
		{ return _FalsyType()
		}

    if ( typeof $atomicCtor === "string")
		{ return _StartsWithType($atomicCtor)
		}
    if ( typeof $atomicCtor === "number")
		{ return _BiggerOrEqualType($atomicCtor)
		}

  if (typeof $atomicCtor !== "function")
  { // this should not happens any more?
    // Well we come here when testing
    // fails (()=> Type (undefined));
    err (`Invalid type=-specifier: ${$atomicCtor}`);
	}

  return  class  AtomicType extends $SuperType  // Type
  {
    constructor ( value  )
    {
      super (value);

      let ub;
      let it = new $atomicCtor(); // the default
      if ($atomicCtor === String)
      { ub =  randString ();
			}
			if ($atomicCtor === Number)
      { ub =  randNumber ();
			}
			if ($atomicCtor === Boolean)
      { ub =  randBool();
			}

			it = new $atomicCtor(ub);
			return it;


			function randBool ()
      { if (rix(2) === 0)
        { return false;
        }
        return true;
			}

		function randNumber ()
		{ // let max    = Math.floor (Number.MAX_SAFE_INTEGER / 2)  ;
		  let max    = Number.MAX_SAFE_INTEGER  ;

		  let it  = Math.random() * max   ;

		  if (rix(9) > 4)
			{ // it is important that edge-cases
			  // get testing in a limited test-run.
				it =  [max, 0, 0, 0, 1, 1, 2, 3, 3,4,5,6,7,8,9,11,13,15,17
				      ] [rix(9)];
			}
			if (rix(2) > 0)
			{ it = it  + Math.random();
			}
		  if (rix(2) > 0)
			{ it = it * -1;
			}
      return it;
		}


      function randString ()
      {
        let maxCodePoint = 0xFFFF;
        // Unicode basic multi-lilngiual plane

        let siz = rix (90);
        if (rix(9) === 1)
        { return "";
        }
        if (rix(5) === 1)
        { siz =  rix(12);
        }
        let s = "";
        for (let j = 0; j < siz; j++)
        {
           let codePoint = Math.floor(Math.random()* 299);
           if (rix(9) === 1)
           { codePoint =    Math.floor(Math.random()* maxCodePoint);
					 }
           let randChar  = String.fromCodePoint (codePoint);
           s += randChar;
				}
        return s;
			}

			/**
			 * Rix returns an interger
			 * from 0 to leng-1 so it can
			 * be used as a randomg index to
			 * an array of length leng.
			 * If leng === 0 then it will
			 * always return 0.
 			 */
	  function rix (leng)
		{ let randix =  Math.floor (Math.random() * leng ) ;
			return randix;
    }

    } // end constructor


    static [Symbol.hasInstance] (value)  // of  AtomicType
    {
       if (value && value.constructor === this)
       {  return true;
         // when we create new Odd(3)
         // we want it, the boxed value,
         // to also be instanceof Odd,
         // not juts the unboxed value 3.
			 }
       value = value.valueOf();
			 if (value === undefined)
       { return false;
       }
			 if (value === null)
       { return false;
       }

       if (value instanceof $atomicCtor)
       { return true;
       }
       let C =  value.constructor;
       if (C ===  $atomicCtor)
       { return true;
       }
			 return false;
    }

    static init ()  // of AtomicType
    {
      let typeName =  this + "" ;  //  "Type(null)" ;
      zet (this, 'name', typeName, "force");
      return this;
		}

    static toString ()
    {  return `Type(${$atomicCtor.name})`;
		}

  } .init();

  }

function _NullType ( )
{

  return  class  NullType
  {
    constructor ( value )
    {

    }

    static [Symbol.hasInstance] (value)  // of NullType
    {
       if (value && value.constructor === this)
       {  return true;
         // when we create new Odd(3)
         // we want it, the boxed value,
         // to also be instanceof Odd,
         // not juts the unboxed value 3.
			 }

			 if (value === undefined)
       { return true;
       }
			 if (value === null)
       { return true;
       }
       let vof = value.valueOf();
       // see the functon Null() at the end
       if (vof === null)
       { return true;
       }
       if (vof === undefined)
       { return true;
       }

			 return false;
    }

    static toString ()
    {
    debugger
      return "Type(null)"
		}

    static init ()  // of NullType
    {
      let typeName =   "Type(null)" ;
      zet (this, 'name', typeName, "force");
      return this;
		}

    valueOf ()
    { return null;
     // nulltype must differe from all others
     // in that it has a special valueOf() Why?
     // Well atomic types maybe too
     // But other in general reurn an instance
     // of basetype when call their constructor
     // with NulLT%ype you can not do that.
		}

  } .init();

  }

function _Type (... $compTypes )
{

  return  class SumType
  { // a type is a class
     // we can isnantiate it
     // but if there are components
     // we will insatiate the first one

    constructor ( value )     // of SumType
    {


      let COMPS = this . constructor [DATA] . compTypes ;
      // do nmot realy o9n scpop[e variable which is
      // MODIFIED BY LATER CALLS

      if (value !== undefined)
      { err
        (`Trying to create an instance of   
          a Type from an explicit value.
          There is no need, you use Types
          just to create constraints on 
          actual values.
         `
        );

		}

      if (value !== undefined)
      { ok (value instanceof SumType);
      }

       let len = 0;
       if (COMPS)
       { len =  COMPS.length ;
       }

       if (len >= 1)
       { let ix       = randomIx (len); // should work for 0 as well
         let CompType = COMPS[ix];

         if (CompType === null)
         {
           // here we had an issue because
           // constructors can never return null.
           // Now we instead reurn something whose
           // valueOf() is null. So when testing
           // is a test does not pass we should take
           // the value of.
//         return null;    // Happens for new NumberOrNothing()

           let Null = { valueOf: ()=>null }
           return Null;
             // Happens for new NumberOrNothing() etc.
         }

         let maybeBoxed = new CompType();
         // if the type is String etc. it is better
         // to always try to use unboxeds?
         // YES BUT BIG BUT. If you try to return
         // a non-Object from new your return value
         // is disregarded and the system returns
         // an object instance in stead in our case here
         // it would return an instacne of SumType.
         let ub =  maybeBoxed;  // .valueOf();
         return ub ;
			 }

      if (len)
      {  return new COMPS[0]();
			}
			// below happens for subtypes like PredicateType
			// which have no comp-types.
		  return null;



    }

   static [Symbol.hasInstance] (value)         // of SumType
    {
       if (value && value.constructor === this)
       {  return true;
         // when we create new Odd(3)
         // we want it, the boxed value,
         // to also be instanceof Odd,
         // not juts the unboxed value 3.
			 }

      let gompTypes = this [DATA] . compTypes;
      // use the above to get them in the form in which
      // nulls and predicate have also turned
      //  into functions which can be simply
      // queried with insaceof .

  let ItsType
  = gompTypes.find
    (et =>
     {
       // let b = value instanceof et;
       // above will not work for unboxed numbers strings
       // and booleans. Instead muts use:
       let b = is (value, et);
       return b;
     }
    );
  if (ItsType)
  { return  ItsType;
  }
  // if it is an instance of our type it is also nice
  // to say which subtype it is an instance of.

  return;


}

  static init ()        // of SumType
  {

  // HERE IT IS OK TO USE $compTypes
  // because it was juts written by my caller.

    this [DATA] = {};
    this [DATA] . isType  = true;

    // WRONG: let typeName =  SumType + "" ;
    let typeName =  this + "" ;
    zet (this, 'name', typeName, "force");

    if (! $compTypes.length)
    {
       return this;


      // if there are no component then the
      // type can not represent anything.
      // But we still create such a thing to
      // serve as a superclass of all other
      // types so we can inherit some code.
    }



let readyTypes =
    $compTypes.map
    ( et =>
      {
        if (et === null)
        { let NullType = _NullType ();
          return NullType;

         // not sure if this is going to work
         // or do we loop back here? Maybew we
         // need simply also a parallel class with
         // its own insaceof method. Sounds that
         // is the simples
        }

        if (  et instanceof Function &&
            ! et.name
           )
        { // namesles sfunction including all
          // arrow-functions represent function-types
          // which speicify the arg-types and the result
          // with the arroe returned by tha namesless
          // function when it is called without an argument.

          let FType = _FunkType (et);
          return FType;
        }

        if (  et instanceof Function &&
            ! et.name.match (/^[A-Z]/)
           )
        { let PType = _PredicateType (et);
          return PType;
        }

        if (et === String || et === Number || et === Boolean   )
        { return _AtomicType (et);
        }

        if (et instanceof Function  &&
            et.name.match (/^[A-Z]/)
           )
        { return et;
        }

        if (typeof et !== "object")
        { return _AtomicType (et);
        }

        if (et .constructor === Array)
        { let ArrayType = _ArrayType ( et);
          return ArrayType;
        }
        if (et.constructor === Object)
        { let ObjectType = _ObjectType ( et);
          return ObjectType;
        }

        if (et.constructor === RegExp)
				{ let RegType = _RegType ( et);
          return RegType;
				}


        err
        (`Invalid Type -argument:  
          ${et}. 
          Check the documentaion of 
          cisf.Type() for what can
          be used as its argument.
         `
        );
      }
    );

    if (readyTypes.length === 1)
    {  let OBT  = readyTypes[0];
       if ( OBT  !== Number
         && OBT  !== String
         && OBT  !== Boolean
         )
       { // but this is fine it should be wrapped into atomic type already
          return  OBT;
       }
    }

    this [DATA] . compTypes = readyTypes ; // $compTypes;
    // the aboe is not enough because we still use the scope variable
    // maybe should not but now we do so:

    //    below assignment screw things up BADLY because
    // the value would persist eveyr time this
    // function is called to create different types.

    // $compTypes = readyTypes;


   if ($compTypes[0] === undefined)
    { // why
      debugger
		}

    return this;

      /* NO MORE. Now even if there is o9nly
         one base-type we wrap it into the sumtype
         so that when you call the cosntructor
         of the sumtype it can produce random values
         for the base-types String, Number, Boolean
         thus facilitating random testing.

      Then even FunctionType can be nmade to
      produce random results of the correct type
      and so can array and object-types. Predicate
      types can easily too if they first create
      a Type for their result.

      ---------------------------
         Returning a single base-type directly
         WAS a simplifying trick which makes the
         types more debuggable. Type() CAN take N
         arguments and if N > 1 then we can only create
         a Type with component types. And if the component-
         type is a normal constructor then there is
         no need to call Type() at all juts use the
         constructor, is() and x() can workj with that.
         So Type() was originally created to allow for
         SumTypes, then for NullType the PredicateType.
         But when you create a NullType or PredicateT%ype
         it would be confusing if it was the the only
         component of a wrapper type. Therefore if so
         we not instead juts return that component-type
         above
         */

  }

    static toString ()            // of SumType
    {
       if (! $compTypes.length)
       { return "Type()";
         // but therefore most type-classes
         // like PredicateType better define their own.

			 }
       let typeNames = $compTypes .map
      ( e =>
        { if (typeof e === "function")
          { if (! e.name)
            { return "=>";
					  }
            return `${e.name}`  ;
          }
          if (e === null)
          { return 'null';
          }
          if (e === undefined)
          { return '*';
          }
          if ( e instanceof Array)
          { if (! e.length )
            { return '[]' ;
            }
            return '[ ... ]'
          }
          if (e.constructor === Object)
          { return '{...}'
          }
        }
      );
      let s  = typeNames.join (', ');
      let s2 = `Type(${s})`;
      return s2;

    }



  }.init() ;


}


function _Canary ()
{ assignMethods (Canary);
  return Canary;

  function Canary (memberCheckerFunk)
  { }
}

     function rLinux (path)
		 { return path.replace(/\\/g, "/");
		 }

     function rRelative (path)
		 { let full = this.abs(path);
		   let base = this.abs();
		   let rp   = full.replace(base, "");
		   // Above will start with \ or /
		   // but since my result should not
		   // be interpreted as absolute path
		   // which everything starting with '/'
		   // is on Linux we must not allow that
		   rp = rp.slice(1);
		   rp =  "." + Path.sep + rp;
		   return rp;
		 }

     function cisfRequireResolve (path="")
		 { let cwd = process.cwd();
		   if (Path.isAbsolute (path))
			 { return path;
			 }
		 	 let pp2 = Path.resolve (cwd, path);
		 	 return pp2;
		 }
		  // let pp3 = this.linux(pp2);
		  // no that would make our test comparing it
		  // tpo [rocess.cwd() not work.

function assignMethods (Canary)
{ var C      = Canary;
  if (typeof require !== "undefined" &&  require.main)
  {  // in the browser there is no require.

     cisfRequire.abs   = cisfRequireResolve;
     cisfRequire.rel   = rRelative;
     cisfRequire.linux = rLinux;

     C.r  =  cisfRequire;
  }

  C.ok       = ok    ;
  C.x        = x      ;
  C.fails    = fails  ;
  C.not      = not    ;

  C.log      = log    ;
  C.warn     = warn  ;
  C.err      = err    ;

  C.eq       = eq;
  C.neq      = neq;

  C.is       = is    ;
  C.isNot    = isNot ;
  C.isEq     = isEq  ;
  C.isNeq    = isNeq  ;

  return;


function cisfRequire  (path)
{

	let home     = process.cwd();
  if (path.match (/^\w+$/))
	{ // it is path etc.
	  return require (path);
    // but any ref which does start with
    // a word-char should be found by normal
    // require from node_modules :
	}
	if (path.match (/^\w+[\s\S]*$/))
	{ // as long as it starts with word-char it is something
	  // that should be looked up by normal require
	  // from node_modules
	  return require (path);
  }

  let absPath = Path.resolve (home, path);
  let imports = require(absPath);
  return imports;
}

    function ok (arg)
    { x(arg, true);
    }

    function not (arg)
    { x(arg, false);
    }

function is (value, ... types)
{ let b = false;
	// value instanceof  types[0]

	b = isBasic (value, ... types);
  return b;
}

function isNot (... args)
{ return ! is (... args);

}

function isEq (...args)
{
	let m =  eqMsg (...args) ;
	if (m)
	{ return false;
	}
	return true;
}

function isNeq (...args)
{
	let m =  eqMsg (...args) ;
	if (m)
	{ return true;
	}
	return false;
}

function x (value, ... typesArg)
{ let  types = [... typesArg];
  if (! arguments.length)
  { err (`x() called without arguments.`);
  }

  if (! types.length)
  { // x() called with a single argument, it
    // can be anything except null or undefined.
    if (value === null || value === undefined)
    { err (`x() called with null or undefined as first argument.`);
    }
    return value;
  }
  let e2, r;

  while (types.length)
  { let eType  = types.pop ();
    try
    { e2 = null;
      r = xSingle (value, eType);
      return r;
    } catch (e)
    { e2 = e;
    }
  };

// if none of the types matched
// we did not return above and are here
// and this is an error.

let typeNames =
typesArg.map
( et =>
  { if ((typeof et === "function") && et.name )
    { return et.name;
    }
    return et + ""
  }
). join (', ');

let em =
`x() type-check failed. 
The 1st argument in 
x (${value}, ${typeNames[0]}, ${typeNames[1]} ...)
is not an instance of  
any of the rest.
.
`;
err (em);
}

function isBasic (value, ... typesArg)
{ let  types = [... typesArg];
  if (! arguments.length)
  { return (`x() called without arguments.`);
  }

  if (! types.length)
  { // called with a single argument, it
    // can be anything except null or undefined.
    if (value === null || value === undefined)
    { return false ;
    }
    return true;
  }
  let e2, r;
  let eType  = types.pop ();
  let b =  isSingle (value, eType);
  if (b)
	{ return true;
	}
  if (! types.length)
	{ return false;
	}
  return isBasic (value, ... types);
}


function typeFromSpec (type)
{
	let T =  Type (type);
	return T;
}

  function isSingle (value, type )
  {

     if (type === true || type === false)
		 { // It means the Truthy or Falsy type
		   type = Type (type);
		 }
     if (typeof type === "string"
       || typeof type === "number"
        )
		 { // It means StartsWithType or BiggerOrEqualType
		   type = Type (type);
		 }

    try
    { if (value instanceof type)
      { return true;
      }
    } catch (ee)
    { // type can be something thet does not dupport instanceof
      return false;
     }

     if  (value === undefined || value === null)
     { if (type === null  )
      { return value;
      }
      return false;
  	}
    if (type === null  )
    { if (value === null || value === undefined)
      { return true ;
      }
      return false;
		}
    if (value === null || value === undefined)
    { // since above type was not null if the
      // value is null or undefined it is not
      // an instacne of the type.
       return false;
    }

		let TypeC = type.constructor;
		let typeS = typeof type;

		if ( value !== null &&
		     value !== undefined  &&
		     value.constructor === type
		    )
    { return true;
      // handles unboxed numbers strings and booleans
      // which are not "instanceof" of their constructor.
    }

	 let type2 = typeFromSpec (type);
	 if (value instanceof type2)
   { return true;
   }

   return false;

  }

  function xSingle (value, type )
  {
     if (type === true || type === false)
		 { // It means the Truthy or Falsy type
		   type = Type (type);
		 }
     if (typeof type === "string"
       || typeof type === "number"
        )
		 { // It means StartsWithType or BiggerOrEqualType
		   type = Type (type);
		 }

/*
    if (type === undefined )
		{  throw new Error
		   ('cisf.x() type-error, type === undefined'
		   );
		}
*/
    try
    {
      if (value instanceof type)
      { return value;
      }
    } catch (ee)
    { }

    if  (value === undefined || value === null)
    { if (type === null  )
      { return value;
      }
      throw new Error ('cisf.x() undefined or null value type-error');
		}
    if (type === null  )
    { if (value === null || value === undefined)
      { return value;
      }
      throw new Error ('cisf.x() type-error');
		}
    if (value === null || value === undefined)
    { // since above type was not null the
      // value can not be null or undefined.

     throw new Error ('cisf.x() type-error');

    }

let TypeC = type.constructor;
let typeS = typeof type;
if ( type instanceof Array ||
     TypeC === Object      ||
     typeS === "string"    ||
     typeS === "number"    ||
     typeS === "number"
   )
{
}

		if ( value !== null &&
		     value !== undefined  &&
		     value.constructor === type
		    )
    { return value;
    }


	let type2 = typeFromSpec (type);

	if (value instanceof type2)
  { return value;
  }


		throw new Error ('cisf.x() type-error');
		// does not matter what the error says
		// because there can be many type-args
		// and it is only an error if NONE of
		// them not causes an error

  }

  function checkAndReturn (a, b)
  { if (a && a.valueOf)
    { a = a.valueOf();
    }
    if (b && b.valueOf)
    { b = b.valueOf();
    }
    if (a === b && typeof b !== "function" )
    { return a;
    }
    if (b === null)
    { return a;
    }
    if (typeof b  === "function")
    { let v2 = eq_function(a, b);
      return v2;
    }
     if (b.constructor === Function)
    { return eq_function (a, b);
    }
    if (b instanceof Array && b.length < 2)
    { return eq_array (a, b);
    }
    if (b instanceof Array)
    { return eq_tuple (a, b);
    }
    if (typeof b !== "object")
    { if (typeof a === typeof b)
      { return a;
      }
      let e = new Xer(`
      x(${ a}, ${ b}) FAILED because
      (typeof ${ a} !== ${ typeof b})
      `);
      return e;
    }
    if (b && b.constructor !== Object)
    { return eq_instance (a, b);
    }
    return eq_object (a, b);

    function eq_function (a, b)
    { if (a === b)
      { }
      if (typeof b !== "function")
      { err (`internal error  eq_function should not come here`);
      }
       if (isClass(b))
       { let A;
         if (a !== undefined && a !== null)
         { A = a.constructor;
         }
         if (a instanceof b  || A  ===  b )
         { return a;
         }
         let em = `
x():  eq_function fails: ${ a}, ${ b}. 
         `;

         return new Xer(em);
       }
       if (isPredicate(b))
       { try
      { let bool = b(a);
        if ( bool)
        { return a;
        }
let m = ` 
x(${ a}, ${ b}) failed
because the predicate call
 ${ b} (${ a})
does not return == true. 
`;

        err (m);
      } catch (e)
      { let m2 = ` 
x(${ a}, ${ b}) failed with error:
 ${ e}
       `;

        err (m2);
      }
       }
       if (typeof a === "function")
       { checkFunkType (a, b);

       return a;
       }
       err
       (` 
x(${ a}, ${ b}) failed,
${ a} is not accepted by
the 2nd argument which is
a function.
       `);
       return;

       function checkFunkType (valueFunk, typeFunk)
       { if (valueFunk === typeFunk)
         { return valueFunk;
         }
         let [defaultArgs, defaultResult]
         = getTypeOfFunk (typeFunk);

          try
         { let actualResult;
           actualResult =  valueFunk.apply (null, defaultArgs);

           x (actualResult, defaultResult);

           return valueFunk;
         } catch (e)
         { err
           (` 
x(${ valueFunk.name}, ${ typeFunk.name}) failed,
${ valueFunk.name} is not type-compatible  
with ${ typeFunk.name}. 
           `);
         }
       }
    }

function getTypeOfFunk(funk)
{ let defaultResult;
  try
  { defaultResult = funk();

    return [ [], defaultResult];
  } catch (defaultArgs)
  { if (defaultArgs === undefined)
    { defaultArgs = [];
    }
    if (! (defaultArgs instanceof Array))
    { defaultArgs =  [defaultArgs];
    }
    try
    { defaultResult = funk.apply (null, defaultArgs);
      return [defaultArgs, defaultResult];
    } catch (realError)
    { err
       (` Invalid function-type x(${ funk.name}().  
       `);
    }
  }
}

    function eq_tuple (a, b)
    { if (b.length !== a.length)
      { return new Xer (`
         Can't match tuples  
         of different lengths:
         Value: ${ a}  
         Type:  ${ b}.
         `);
      }
       let resultTuple =
      a.map
      ( (e,j,all) =>
         { let unifiedElem = checkAndReturn(e, b[j]);
           return xer (unifiedElem);
         }
      );
      return resultTuple
    }

    function eq_array (a, b)
    { ok (b.length < 2);
      if (! (a instanceof Array))
      { return new Xer
        (`Failed validating a non-array:
          ${ a} 
          with array:
          ${ b}.
        `);
      };

      if (a.length === 0 )
      { return a;
      }
      let elemType = b[0];
      x(a[0], elemType);
      if (a.length > 1)
      { x(a[a.length-1], elemType);
      }
      return a;
    }

    function eq_instance (value, type)
    { if ( type === undefined || type === null)
       { return false;
       }
       if (value instanceof type.constructor)
       { return value;
       }
       let e = new Xer(`
       x(${ a}, ${ b}) FAILED because
       ! (${ a} instanceof ${ b}.constructor)
      `);
      return e;
    }

    function eq_object (value, type)
    { ok (type.constructor === Object, "in eq_object");

      if (value === null || value === undefined)
      { return new Xer
        (`x(${ value}, ${ type}) failed becase
          ${ value} never matches anything whose
          typeof === "object"
        `);
      }
      if (value.constructor !== Object)
      { return new Xer
        (`x(value, type) failed
          value.constructor = ${ value.constructor.name} 
          type .constructor = ${ type .constructor.name}  .
        `);
      }
      let typeKeys = Object.keys(type) ;

      let typeFieldsCount = typeKeys.length;
      if (typeFieldsCount === 0)
      { return value;
      }
      if (typeFieldsCount === 1 && typeKeys[0] === '_')
      { let [k,v] = Object.entries (type)[0];
         let typen =  v;

         for (let p in value)
         { let compValue = value[p];
            if (is (compValue, typen))
             { continue;
             } else
             { error = `
Field ${ p} type-check
${ typen} failed 
with value-field value
${ compValue}. `
            }
         }
         return value;
      }
     let error;
     let result = { };

     for (let p in type)
     { let typen     = type [p];
       let compValue = value[p];

       if (is (compValue, typen)   )
       { result[p] = compValue;

          continue;
       }
       if (compValue === undefined )
       { result[p] = deepCopy(type[p]);
          continue;
       }
       else
       { error = `
Type-check of field "${ p}" failed.
Default-value: <${ typeof typen}> ${ typen}  
Actual value:  <${ typeof compValue}> ${ compValue}. 
`
       }
     }
      if (error)
     { err (new Error (error));
     }
     return result;
    }
  }

function isClass (v)
{ if (typeof v !== "function")
  { return false;
  }
  if (isPredicate (v))
  { return false;
  }
  if (v.name.match(/^[A-Z]/))
  { return true;
  }
  return false;
}

function isPredicate (v)
{ if (typeof v !== "function")
  { return false;
  }
  let  s = v + "";
  if (s.match(/^function\s/))
  { return false;
  }
  if (s.match(/^class\s/))
  { return false;
  }
  return true;
}

  function fails (funk = x => null )
  { var eMsg, eMsg2, argsArray;

    var originalArgs  = [].slice.call(arguments);
    var theThis       = null;
    try
    { funk.apply(theThis, []);
    } catch (err)
    { return err;
    }
     eMsg2   =  `fails() Did NOT fail 
executing function: 
${ funk} ` ;
    err( eMsg2);
    return;
  }
}

  function getCallingLine  ( extraGoUp = 0)
  { var e = new Error();
    var s = e.stack;
    if (typeof module === `undefined`)
    { return s;
    }
    var matches  = s.match(/\(.*?\)/g);
    var matches2 = matches.slice(2 + extraGoUp);

    var lineForCallingModule = matches2[0];
    if (! lineForCallingModule)
    { return ``;
    }
    var woDrive = 
    lineForCallingModule.replace(/^\([A-Z]:/, "");
    var sep   = require("path").sep;
    var parts = woDrive.split( sep );
    var filePart = parts[parts.length - 1];

    var m = `${ filePart}
(${ woDrive}`
    return m;
  }

function E() { }

function deepCopy (ob, level=0)
{ if (level  > 21)
  { err
    (`deepCopy() caused recursion to go too deep`
    );
  }
  if (typeof ob !== "object")
  { return ob;
  }
  if (ob instanceof Array)
  { let a2 = ob.map
    ( e =>
      { if (e === ob)
        { return ob;
        }
        return deepCopy(e, level+1)
      }
    );
    return a2;
  }
  E.prototype = ob;
  let c       = Object.create(ob) ;
  E.prototype = null;

  for (var p in c)
  { c[p] =  deepCopy(c[p], level + 1);
  }
  return c;
}

  function log (msg = "")
  { if (typeof msg !== "string")
    { msg = "" + msg;
    }

//    msg = msg.replace (/<\w+>/, "");
//    msg = msg.replace (/<\/\w+>/, "");
//
// Above removed html tags. But really let
// the caller do that if they want to, maybe
// they want to outpu html to the log.
// Less sueprises is better

    var s =  trimLineBeginnings (msg + ``); //  .slice(0,2048);

    let date = new Date();
    let ms =  date.getMilliseconds();
    if (ms.length === 1) ms = "00" + ms;
    if (ms.length === 2) ms = "0" + ms;
    let s2 = date. toLocaleTimeString() +   ":"
              + ms  + " "  + s ;
    // news ms is separated by as well
    // so it is more clearly part of the
    // time-stamp, NOT part of the message.

    console.log (s2);
    return s2;
  }

 function warn (errorOrString)
 { let msg = errorOrString;
  if (typeof msg === "object")
  { msg =  " "  + msg
  }
  return log (`WARNING: ${ msg}`);
 }

  function err ( errorOrString = "", ErrorClass = AssertError  )
  {
    let stack;
    // the stack here
    let err =    errorOrString;
    let s   = errorOrString;
    if (typeof s === "string")
    {
      stack =  (new Error ()).stack ;
      s   =  `` + trimLineBeginnings (s + `
`);
     s += `
`;
      err = new ErrorClass ( s );
    } else
    { stack = err.stack;
		}

    Error.stackTraceLimit = Infinity;

    let doNotHalt = stack . match (/fails\s*\(/);

    if ( !  doNotHalt  )
    {
      // err() was called maybe because a type-check
      // failed or maybe err() was called directly by
      // user-code. We have checked above that
      // we are NOT called from fails() which would
      // mean we expect err() to be called to cause
      // an error to be thrown. If that eas the case
      // we dont want to halt into the debugger because
      // what we asserted happened.  But if this is
      // NOT called from fails then we will halt here
      // rtaher than kill the process so if you are
      // debugging you will see the STATE and stack that
      // led to the error. If yo9u are not debugging then
      // debugger -statement does nothing.  So at
      // DEVTIME this is very useful rather than juts seeing
      // an error-message and stack, you jump right into
      // the debugger.

      debugger
      // LEAVER THIS debugger -STATEMENT HERE
      // IT IS HERE ON PURPOSE AND VERY USEFUL.
    }

    throw (err);
   }



function A (typesArray, ... values)
{
  let exampleTypes = typesArray.map
	( ex => Type (ex)
  );

   if (values.length > exampleTypes.length)
	 { debugger
	   err
		 (`cisf.A(typesArray, ...values)
		   -call has fewer elements in typeArray
		   than there are values. Every 
		   value-argument must have its
		   corresponding Type in the 1st
		   argument which must be an Array. `
		 );
	 }
	 if (exampleTypes.length > values.length + 2 )
	 { err
		 (`In cisf.A(typesArray, ...values)
		   -call the typesArray has more than 2
		   more elements than there are values
		   -arguments. 
		  `
		 );
	 }
  values.map
  ( (v, j, all) =>
    { let eType  = exampleTypes[j];
			if (is (v, eType))
      { return; // from map()
			}
      throw [exampleTypes, values] ;
    }
  );
  return [exampleTypes, values];
}



function neq  (a, b)
{
  let m = eqMsg (a, b);
  if (m)
	{ // they are not equal because there was a message
	  // telling which part of them is not equal
    // We can in fact return that message.
    return m;
	}
	err
	(`neq(${a}, ${b}) failed because 
	  eq (${a}, ${b}) did not.
	  `
	);
}



function eq (... args )
{

		if (true)
		{ let m = eqMsg (... args);
			if (! m)
			{ return args[0];
			}
			err (m);
		}

   if (arguments.length < 2)
	 { err
	   (`eq() called with < 2 arguments`
	   );
	 }
	 if (arguments.length > 2)
	 { err
	   (`eq() called with > 2 arguments`
	   );
	 }

   if (! a && ! b)
	 { return a;
	 }
	 if (! a  || ! b) // after previous test
	 { err
	   (`eq(${a}, ${b}) 
	     1st argument is not but 2nd is.`
	   );
	 }

	 /*
	  now we know they both have a constructor
	  BUT we dont compare constructorsd because
	  WE ONLY COMPARE ENUMERABLE PRTOPERTIES,
	  in other words properties that are looped
	  over by the for-in -loop.

	 if ( a.constructor !== b.constructor) // after previous test
	 { err
	   (`eq(${a}, ${b}) 
	     constructors are not the same:
	     ${a.constructor.name} !== ${b.constructor.name}`
	   );
	 }
   */


   if (a instanceof Array)
  { for (var j=0; j <  a.length; j++)
    { eq (a[j], b[j]);
    }
    if (a.length === b.length)
    { return a;
    }
  }


  if (a instanceof Object)
  { if (! (b instanceof Object) )
	  { err
	    (`eq(${a}, ${b}) 
	      ${a} is an instacne of Object 
	      but ${b} is not.
	     `
	   );
	  }

    for (let p in  a)
    { eq (a[p], b[p]);
    }

    for (let p in  b)
    { eq (a[p], b[p]);
    }
    return a;
  }
  if (a === b)
  { return a;
  }
  err
  (`eq() failed: 
    ${ a} !== ${ b}
   `
  );
}


function eqMsg (a, b)
{
   if (a === b)
   { return;
   }

   if (arguments.length < 2)
	 { return  (`eq() called with < 2 arguments`
	   );
	 }
	 if (arguments.length > 2)
	 { return (
	   `eq() called with > 2 arguments`
	   );
	 }

   if ( a === undefined &&  b === undefined)
	 { return;
	 }

	 /*
	  now we know they both have a constructor
	  BUT we dont compare constructorsd because
	  WE ONLY COMPARE ENUMERABLE PRTOPERTIES,
	  in other words properties that are looped
	  over by the for-in -loop.

	 if ( a.constructor !== b.constructor) // after previous test
	 { return (
	   `eq(${a}, ${b})
	     constructors are not the same:
	     ${a.constructor.name} !== ${b.constructor.name}`
	   );
	 }
   */


   if (a instanceof Array)
   {
     if (!  (b instanceof Array))
     { return (
       `Arg 1 of eq() is an Array but 2nd is not`);
	   }

    let maxLeng =  Math.max (a.length, b.length);
    for (var j=0; j < maxLeng; j++)
    { let m =  eqMsg (a[j], b[j]);
      if (m)
			{ return m;
			}
    }
    if (a.length === b.length)
    { return ;
    }


  }


  if (a instanceof Object)
  { if (! (b instanceof Object) )
	  { return (
	     `eq(${a}, ${b}) 
	      ${a} is an instacne of Object 
	      but ${b} is not.
	     `
	   );
	  }

    for (let p in  a)
    { let m =  eqMsg (a[p], b[p]);
      if (m)
			{ return m;
			}
    }

    for (let p in  b)
    { let m =  eqMsg (a[p], b[p]);
      if (m)
			{ return m;
			}
    }
    return;
  }

  return (
	 `eq() failed: 
    ${a} !== ${b}
   `
  );
}


}



function zet(owner, key, value, force)
	{
		if (! owner)
		{ throw "zet() called without owner"
		}

		if (owner.hasOwnProperty(key))
		{
			if (!force)
			{	err
				("Trying to double-bind " + key + ` to ${value}`
				)
				return;
			}
		}

   let temp = 		Object.getOwnPropertyDescriptor(owner, key);
   // Above is how we can read the meta-information.
   // writable is false by default
   // but so is configurable.
   // So unless we set configurable to true
   // we can not change the value again ever.
   // This CHANGED  at some point in Node.js

		Object.defineProperty
		( owner, key
		, { value        : value
		  , enumerable   : false
		  , writable     : false
		  , configurable : true
		  }
		);

		if (owner[key] !== value)
		{	throw `zet() almost silently failed to  set the value to property ${key}.` ;
		   // beware of silent failure with defineProperty
		}
	}

	function randomIx (leng)
  { let randix =  Math.floor(Math.random() * leng );
        return randix;
  }

  function Null () {}
	Null.valueOf = _=> null;