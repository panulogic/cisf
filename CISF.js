/* =========================================
   cisf.js v. 3.1.1

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

let CISF_VERSION = "3.1.1" ;

let path, fs, Path, Fs;
if (typeof require === "function")
{ path = require ("path");
  Path = path;
  fs   = require ("fs");
  Fs   = fs;
}
const DATA = Symbol('CISF');
var CISF   = CISF_inner ();
CISF.v     = CISF_VERSION;

if (typeof module !== "undefined")
{ module.exports =  CISF;
}

function CISF_inner  ()
{ var C          = _Canary()    ;
  let ok=C.ok, not=C.not, x=C.x, fails=C.fails, is=C.is, r=C.r;

  let Type = _Type;
  Type[DATA] =  { };

  let $SuperType = _Type ();

  let Xer = _Xer();
  let AssertError = class AssertError extends Error { };

  let api =
  { ok, x, is, not, Type, fails, log, err, r
  , path, fs, A, eq, neq, w
  }
  return api;

  function w (anArray)
  { return (
    { last() { return anArray[anArray.length - 1]}
    , first() { return anArray[0]}
    , car () { return anArray[0]}
    , cdr () { return anArray.slice(1)}
    , map (... mapArgs )
      { if (anArray instanceof Array)
        { return anArray.map (...mapArgs);
        }
        if (typeof anArray === "number")
        { let  arr = [];
           for (let j=0; j < anArray; j++)
           { arr[j] = j;
           }
           return arr.map (...mapArgs);
        }
        if (typeof anArray === "string")
        { let arr = anArray.split("");
           return arr.map (...mapArgs);
        }
        if (typeof anArray === "function")
        { let first   = mapArgs[0];
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
        { let array = mapArgs[0];
            let valuesWithProperties = [];
            for (let j=0; j< array.length; j++)
            { let v = array[j] ;
              if (v === null)
              { continue;
              }
              if (v === undefined)
              { continue;
              }
              valuesWithProperties.push(v);
            }
            return valuesWithProperties;
        }
        if ( typeof anArray === "boolean")
        { if (anArray === true)
          { let array = mapArgs[0];
            let truthyIndexes = [];
            for (let j=0; j< array.length; j++)
            { if (array[j])
              { truthyIndexes.push(j);
              }
            }
            return truthyIndexes;
          }
          if (anArray === false)
          { let array = mapArgs[0];
            let falsyIndexes = [];
            for (let j=0; j<array.length; j++)
            { if (! array[j])
              { falsyIndexes.push(j);
              }
            }
            return falsyIndexes;
          }
        }
        if ( anArray instanceof RegExp)
        { let see = 'sfAvEhRRihTT7Ai'.match(/[A-Z]+/g) ;

 let see2 = 'sfAvEhRRihTT7Ai'.match(/[A-Z]+/) ;

let reg     = new RegExp (anArray, anArray.flags + 'g');

let s       = mapArgs[0];
let matches = [];

while (true)
{ let m =  reg.exec (s);
  if (m)
  { matches.push(m);
  } else
  { return matches;
  }
}
        }
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
 (s + "")
         .replace (pat, `\n$1`);

  return s2;
}

function _ArrayType (  $elementTypes )
{ return  class  ArrayType
        extends $SuperType
  { constructor (   )
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

  function rix (leng)
  { let randix =  Math.floor(Math.random() * leng );
        return randix;
  }
    }
   static toString()
   { let ets = this[DATA].elementTypes;
     if (! ets)
     { return `Incomplete array type`;
     }
     let etNames = ets.map (e=> e !== null && e !== undefined
                                ? e.name
                                : 'null'
                           ).join (', ');
     let s = `Type([${ etNames}])`;
     return s;
   }
    static [Symbol.hasInstance] (shouldBeArray)
    { if (shouldBeArray && shouldBeArray.constructor === this)
       { return true;
       }
       if (! (shouldBeArray instanceof Array))
       { return false;
       }
       let elemTypes =  this[DATA].elementTypes;

       for (var e of shouldBeArray)
       { let itsType = elemTypes.find(et => is(e, et) );
         if (! itsType)
         { return false;
         }
       }
       return true;
    }
    static init ()
    { super.init();

      let realElemTypes
      = $elementTypes.map (e=> Type(e));

      this[DATA].elementTypes =  realElemTypes;

      let typeName =  this + "" ;
      zet (this, 'name', typeName, "force");

      return this;
    }
  } .init()
}

function _ObjectType ($obSpec )
{ return  class  ObjectType
        extends $SuperType
  { constructor (   )
    { super();
      let spec = this.spec ();
      let  ob   = { };
      for (var p in spec)
      { let fieldType = spec[p];
        let fieldValue = (new fieldType()).valueOf() ;
        ob [p] =  fieldValue;
      }
      return ob;
    }
    static [Symbol.hasInstance] (value)
    { if (value && value.constructor === this)
       { return true;
       }
       let spec = x(this[DATA]. unfoldedSpec);
       for (var p in  spec )
       { let fieldType  = spec [p];

         let fieldValue = value[p];
         if ( is (fieldValue, fieldType))
         { continue;
         }
         return false;
       }
       return true;
    }
   static toString()
   { let obSpec  = this[DATA].unfoldedSpec ;
     if (! obSpec)
     { return `Incomplete ObjectType`;
     }
     let s  = "{ " .trim() ;
     let V = CISF.v ;

     let entries
     = Object.entries (obSpec)
       . map
       ( ([k, v]) =>
         { return `${ k}: ${ v.name}`;
         }
       ) ;
     s +=  entries.join (`, `) + `}`

     let s2 = `Type(${ s})`;
     return s2;
   }
    static init ()
    { super.init();

      let unfoldedSpec  = { };
      for (var p in $obSpec)
      { let TheType = Type ($obSpec[p]) ;

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
{ return  class   FunkType
          extends $SuperType
  { constructor ( value )
    { super(value);
      let ResultType = this.constructor [DATA].resultType;

      let funk =  () => new ResultType();
      return funk;
    }
   static toString()
   { return `Type(${ $namelessFunk.name})`;
   }
    static [Symbol.hasInstance] (value)
    { let argTypes   = this [DATA].argTypes  ;
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
    { super.init();
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
           ${ $namelessFunk}.
           `
         );
       }
        if (! (argsAndResultType instanceof Array))
        { err
          (`Function-type's defining function returns
            a non-array. It should return an array of
            the types which are the argument- and 
            result-types of functions that would be 
            instances of the function-type being created.

            Bad defining function: ${ $namelessFunk}
            `
          )
        }
       let  argTypes   = argsAndResultType.slice (0, -1);
       let  resultType = argsAndResultType.slice (-1)[0];

       this[DATA].argTypes   = argTypes;
       this[DATA].resultType = resultType;

       return this;
    }
  } .init()
}

function _PredicateType ($predicateFunk )
{ return  class   PredicateType
          extends $SuperType
  { constructor ( value )
    { super(value);
      if (value !==  undefined)
      { ok (value instanceof  PredicateType)
      };

      let pf =  this.constructor[DATA].predicateFunk
      let exampleInstance = pf ();

      ok (is (exampleInstance, PredicateType)
         , `The example-instance of a PredicateType
            is not an instance of it:
            ${ exampleInstance} 
            !
            `
         );

      if (   exampleInstance === undefined
         )
      { err
        (`Predicate function's member-function
          return undefined. The function:
          ${ pf} 
         `) ;
      }
      if ( exampleInstance === null
         )
      { return exampleInstance;
      }
      if (typeof exampleInstance === "object")
      { return exampleInstance;
      }
      let obv = new (exampleInstance.constructor)
                     (exampleInstance);

      return obv;
    }
   static toString()
   { return `Type(${ $predicateFunk.name})`;
   }
    static [Symbol.hasInstance] (value)
    { if ( value !== undefined
         && value !== null
         && value.constructor === this
          )
       { debugger
          return true;
       }
       let see;
       if (value === undefined)
       { return false;
       }
       if (value !== null)
       { value =  value.valueOf();
       }
       try
       { see = $predicateFunk (value);
       } catch (e)
       { debugger
         return false;
       }
       if (see)
       { return true;
       } else
       { return false;
       }
    }
    static init ()
    { super.init();
       let see;
       try
       { see = $predicateFunk ( );
       } catch (e)
       { debugger
         err
         ( `PredicateType -argument-function
           causes an error when called without
           argument. Therefore that function 
           does not specify a valid predicate 
           type:      
           ${ $predicateFunk}.
           `
         );
       }
       this[DATA].predicateFunk = $predicateFunk;
      return this;
    }
  } .init()
}

function _AtomicType ( $atomicCtor )
{ if (  $atomicCtor === null || $atomicCtor === undefined  )
  { }
  x ($atomicCtor);
  if (typeof $atomicCtor !== "function")
  { $atomicCtor = $atomicCtor.constructor;
  }
  return  class  AtomicType extends $SuperType
  { constructor ( value  )
    { super (value);

      let ub;
      let it = new $atomicCtor();
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
    { let max    = Number.MAX_SAFE_INTEGER  ;

      let it  = Math.random() * max   ;

      if (rix(9) > 4)
      { it =  [max, 0, 0, 0, 1, 1, 2, 3, 3,4,5,6,7,8,9,11,13,15,17
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
      { let maxCodePoint = 0xFFFF;

        let siz = rix (90);
        if (rix(9) === 1)
        { return "";
        }
        if (rix(5) === 1)
        { siz =  rix(12);
        }
        let s = "";
        for (let j = 0; j < siz; j++)
        { let codePoint = Math.floor(Math.random()* 299);
           if (rix(9) === 1)
           { codePoint =    Math.floor(Math.random()* maxCodePoint);
           }
           let randChar  = String.fromCodePoint (codePoint);
           s += randChar;
        }
        return s;
      }

    function rix (leng)
    { let randix =  Math.floor (Math.random() * leng ) ;
      return randix;
    }
    }
    static [Symbol.hasInstance] (value)
    { if (value && value.constructor === this)
       { return true;
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
    static init ()
    { let typeName =  this + "" ;
      zet (this, 'name', typeName, "force");
      return this;
    }
    static toString ()
    { return `Type(${ $atomicCtor.name})`;
    }
  } .init();
  }

function _NullType ( )
{ return  class  NullType
  { constructor ( value )
    { }
    static [Symbol.hasInstance] (value)
    { if (value && value.constructor === this)
       { return true;
       }
       if (value === undefined)
       { return true;
       }
       if (value === null)
       { return true;
       }
       let vof = value.valueOf();
       if (vof === null)
       { return true;
       }
       if (vof === undefined)
       { return true;
       }
       return false;
    }
    static toString ()
    { debugger
      return "Type(null)"
    }
    static init ()
    { let typeName =   "Type(null)" ;
      zet (this, 'name', typeName, "force");
      return this;
    }
    valueOf ()
    { return null;
    }
  } .init();
  }

function _Type (... $compTypes )
{ return  class SumType
  { constructor ( value )
    { if (! (this.constructor [DATA])  )
{ debugger
}
      let COMPS = this . constructor [DATA] . compTypes ;

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
       { let ix       = randomIx (len);
         let CompType = COMPS[ix];

         if (CompType === null)
         { let Null = { valueOf: ()=>null }
           return Null;
         }
         let maybeBoxed = new CompType();

         let ub =  maybeBoxed;
         return ub ;
       }
      if (len)
      { return new COMPS[0]();
      }
      return null;
    }
   static [Symbol.hasInstance] (value)
    { if (value && value.constructor === this)
       { return true;
       }
      let gompTypes = this [DATA] . compTypes;

  let ItsType
  = gompTypes.find
    (et =>
     { let b = is (value, et);
       return b;
     }
    );
  if (ItsType)
  { return  ItsType;
  }
  return;
}
  static init ()
  { this [DATA] = { };
    this [DATA] . isType  = true;
    let typeName =  this + "" ;
    zet (this, 'name', typeName, "force");

    if (! $compTypes.length)
    { return this;
    }
let readyTypes =
    $compTypes.map
    ( et =>
      { if (et === 1)
        { }
        if (et === null)
        { let NullType = _NullType ();
          return NullType;
        }
        if (  et instanceof Function &&
            ! et.name
           )
        { let FType = _FunkType (et);
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
        if (et .constructor === Object)
        { let ObjectType = _ObjectType ( et);
          return ObjectType;
        }
        err
        (`In valid Type -argument:  
          ${ et}. 
          Check the documetnation of 
          cisf.Type() for what can be
          its valid arguments.
         `
        );
      }
    );

    if (readyTypes.length === 1)
    { let OBT  = readyTypes[0];
       if ( OBT  !== Number
         && OBT  !== String
         && OBT  !== Boolean
         )
       { return  OBT;
       }
    }
    this [DATA] . compTypes = readyTypes ;

   if ($compTypes[0] === undefined)
    { debugger
    }
    return this;
  }
    static toString ()
    { if (! $compTypes.length)
       { return "Type()";
       }
       let typeNames = $compTypes .map
      ( e =>
        { if (typeof e === "function")
          { if (! e.name)
            { return "=>";
            }
            return `${ e.name}`  ;
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
          { return '{ ...}'
          }
        }
      );
      let s  = typeNames.join (', ');
      let s2 = `Type(${ s})`;
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

function assignMethods (Canary)
{ var C      = Canary;
  if (typeof require !== "undefined" &&  require.main)
  { cisfRequire.abs   = cisfRequireResolve;
     cisfRequire.rel   = rRelative;
     cisfRequire.linux = rLinux;

     C.r  =  cisfRequire;
  }
  C.ok       = ok    ;
  C.x        = x      ;
  C.fails    = fails  ;
  C.is       = is    ;
  C.not      = not    ;

  C.log      = log    ;
  C.warn     = warn  ;
  C.err      = err    ;

  C.eq       = eq;

  return;

function cisfRequire  (path)
{ let home     = process.cwd();
  if (path.match (/^\w+$/))
  { return require (path);
  }
  if (path.match (/^\w+[\s\S]*$/))
  { return require (path);
  }
  let absPath = Path.resolve (home, path);
  let imports = require(absPath);
  return imports;
}

  function ok
  ( aBoolean=false, msg="ok() failed"
  )
  { if (aBoolean)
   { return true;
   }
     var loc = new Error("ok() failed").stack ;

    var em   = `
    ok() failed  
    Message: ${ msg}
    At: ${ loc}
    `;
    err   (em);
  }

  function not  (aBoolean=false, msg )
  { if (aBoolean)
      { var m = `not(): ${ msg}) 
`;
        err   (m);
      }
    return true;
  }

  function is (value, ... types)
  { let b = false;
    try
    { x (value, ... types);
      return true;
    } catch (e)
    { return false;
    }
  }

function x (value, ... typesArg)
{ let  types = [... typesArg];
  if (! arguments.length)
  { err (`x() called without arguments.`);
  }
  if (! types.length)
  { if (value === null || value === undefined)
    { err (`x() called with null or undefined as the its argument.`);
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
x (${ value}, ${ typeNames})
is not an instance of  
any of the rest.
.
`;

err (em);
throw em;
}

  function xSingle (value, type )
  { try
    { if (value instanceof type)
      { return value;
      }
    } catch (ee)
    { }
    if  (value === undefined || value === null)
    { if (type === null)
      { return value;
      }
      throw new Error ('cisf.x() undefined or null value type-error');
    }
    if ( value !== null &&
         value !== undefined  &&
         value.constructor === type
        )
    { return value;
    }
    if (type === null)
    { if (value === null || value === undefined)
      { return value;
      }
    }
    throw new Error ('cisf.x() type-error');
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
    msg = msg.replace (/<\w+>/, "");
    msg = msg.replace (/<\/\w+>/, "");
    var s =  trimLineBeginnings (msg + ``);

    let date = new Date();
    let ms =  date.getMilliseconds();
    if (ms.length === 1) ms = "00" + ms;
    if (ms.length === 2) ms = "0" + ms;
    let s2 = date. toLocaleTimeString() +   " "
              + ms  + " "  + s ;
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
  { let stack;
    let err =    errorOrString;
    let s = errorOrString;
    if (typeof s === "string")
    { stack =  (new Error ()).stack ;
      s   =  `` + trimLineBeginnings (s + `
`);
     s += `
`;
      err = new ErrorClass ( s );
    } else
    { stack = err.stack;
    }
    Error.stackTraceLimit = Infinity;

    if ( stack . match (/fails\s*\(/)   )
    { } else
    { let stack = (new Error()).stack;

      let doNotHalt
      = stack.match (/ xSingle /) ||
        stack.match (/ is /) ;
    }
    if (this === "no stack")
    { err = err.message;
    }
    throw (err);
   }

function A (typesArray, ... values)
{ let exampleTypes = typesArray.map
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
   { debugger
     err
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
      { return;
      }
      throw [exampleTypes, values] ;
    }
  );

  return [exampleTypes, values];
}

function neq  (a,b)
{ try
  { eq (a,b)
  } catch (e)
  { return e;
  }
  err
  (`neq(${ a}, ${ b}) failed because 
    eq (${ a}, ${ b}) did not.
    `
  )
}

function eq (a, b)
{ if (arguments.length < 2)
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
   if (! a  || ! b)
   { err
     (`eq(${ a}, ${ b}) 
       1st argument is not but 2nd is.`
     );
   }
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
      (`eq(${ a}, ${ b}) 
        ${ a} is an instacne of Object 
        but ${ b} is not.
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
}

function zet(owner, key, value, force)
  { if (! owner)
    { throw "zet() called without owner"
    }
    if (owner.hasOwnProperty(key))
    { if (!force)
      { err
        ("Trying to double-bind " + key + ` to ${ value}`
        )
        return;
      }
    }
   let temp =     Object.getOwnPropertyDescriptor(owner, key);

    Object.defineProperty
    ( owner, key
    , { value        : value
      , enumerable   : false
      , writable     : false
      , configurable : true
      }
    );

    if (owner[key] !== value)
    { throw `zet() almost silently failed to  set the value to property ${ key}.` ;
    }
  }

  function randomIx (leng)
  { let randix =  Math.floor(Math.random() * leng );
        return randix;
  }

  function Null () { }
  Null.valueOf = _=> null;