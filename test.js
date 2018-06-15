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
{  cisf = CISF; // for the browser
}

path              .bind 	(cisf) ();
fs                .bind 	(cisf) ();

Type              .bind 	(cisf) ();
x             	  .bind 	(cisf) ();
r           	    .bind 	(cisf) ();

ok              	.bind 	(cisf) ();
not             	.bind 	(cisf) ();
fails           	.bind 	(cisf) ();

log             	.bind 	(cisf) ();
err             	.bind 	(cisf) ();

msg ("cisf.js 2.1 all tests passed. ");

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

function path ()
{
  let {path, x} = this;
  if (! path)
  { return;  // in the browser
	}
  x(path.join, Function);
  x(path.resolve, Function);
}

function fs ()
{
  let {fs, x} = this;
  if (! fs)
  { return;  // in the browser
	}
	x (fs.readFile, Function);
}



function Type ()
{ let {Type, ok, not, fails, x, is} = this;

  let Odd             = Type (odd);
  let Even            = Type (even);

  // Non-title-cased functions like odd() and even()
  // will be CALLED with the prospective type-member
  // and the result indicates by being truthy or not
  // whether membership is true. In contrast
  // title-cased functions are assumed to be
  // constructors and they will never be called,
  // instead we use only the instanceof test with them.
  // But instanceof is first also used with
  // non-title-cased functions just in case YOU
  // use them as constructors and use 'new' to
  // create instances of them.

  ok (is (3, Odd ));
  x  (3, Odd);
  ok (is (2, Even));
  x  (2, Even);

  ok  (is (new odd  (), Odd));
  ok  (is (new even (), Even));
  not (is (new odd  (), Even));
  not (is (new even (), Odd));

  fails (()=>  new Odd() );
  // You can not instantiate Types.
  // Types are NOT constructors.


  not (is(2, Odd ));
  not (is(3, Even));
fails (()=> x(2, Odd));
fails (()=> x(3, Even));

  let OddOrEven = Type (odd, even);
  ok  (is (2    , OddOrEven));
  ok  (is (3    , OddOrEven));
  not (is (3.5  , OddOrEven));
  not (is ("abc", OddOrEven));
  not (is (true , OddOrEven));

  // It does not matter whetrher you
  // construct a type out of multiple
  // functions or already constructed
  // types, the end -result should be
  // in most if not all cases the same:

  OddOrEven = Type (Odd, Even);
  ok  (is (2    , OddOrEven));
  ok  (is (3    , OddOrEven));
  not (is (3.5  , OddOrEven));
  not (is ("abc", OddOrEven));
  not (is (true , OddOrEven));

  let NumberOrString  = Type (Number, String);
  let NumberOrNothing = Type (Number, null);

  ok  (is (2        , NumberOrString));
  ok  (is ("2"      , NumberOrString));

  not (is (null     , NumberOrString));
  not (is (undefined, NumberOrString));
  not (is (true     , NumberOrString));
  not (is (false    , NumberOrString));

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

  const Odd2 = Type (n => n % 2 === 1);
  x (123, Odd2);

  const Even2 = Type (n => n % 2 === 0);
  x (22, Even2);

return;

  function odd (n)
  { if (n === undefined)
    { return false
    }
    x (n, Number);
    return n % 2 === 1;
	}

  function even (n)
  { if (n === undefined)
    { return false
    }
    x (n, Number);
    return n % 2 === 0;
	}


}

// -----------------------------------------------

function x ()
{
  let x=this.x, ok=this.ok, fails=this.fails;

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
  let r = this.r,  ok = this.ok, log = this.log ;

  if (! r)
  { log (`cisf/tes.js: There is no 'r()'
    when running in the browser so we won't
    test it, that is what you expect.`);
    return;
	}

  let Path = require("path");
  // 'r' is just a useful short alias
  // which hitches a ride on the cisf.

  ok (r === require.main.require);

  let cisfP = Path.join( __dirname , "cisf.js");
  // assumes test.js must be in the same
  // directory like it is.

  let cisf  = r (cisfP);
  ok (cisf.ok);
  ok (cisf.r); // etc.

  /*
  Not much testing here when you know
  r === require.main.require
  then r does what require.main.require
  does, which is part of the official
  Node.js documentation I believe.
   */
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
