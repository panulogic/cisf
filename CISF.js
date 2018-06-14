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
       } = require ("cisf");

   Or pick just the functions you need
   for example:
   let {ok, x} = require ("cisf");

   UPDATES-ANNOUNCEMENTS:
   https://twitter.com/ClassCloudLLC
   =============================================
*/

"use strict"

let CISF = CISF_inner ();

if (typeof module !== "undefined")
{ module.exports =  CISF;
}

function CISF_inner  ()
{ var C          = _Canary()    ;
  let ok=C.ok, not=C.not, x=C.x, fails=C.fails, is=C.is, r=C.r;
  let Type = _Type  ;
  let Xer = _Xer();
  let AssertError = class AssertError extends Error { };

  let api =  { ok, x, is, not, Type, fails, log, err, r }
  return api

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
 (s + "").trim()
         .replace (pat, `\n$1`);

  return s2;
}

function _Type (... functions )
{ let AType = class AType
  { static [Symbol.hasInstance] (value)
    { for (let funk of functions)
       { if (funk === null)
         { if (value === null || value === undefined)
           { return true;
           } else
           { continue;
           }
         }
         if (funk === undefined)
         { continue;
         }
         if ( value instanceof funk)
         { return true;
         }
         if ( value && value.constructor === funk)
         { return true;
         }
          if ( value === null || value === undefined)
          { if (funk === null)
            { return true;
            }
          }
          let isConstructor
          =  funk.name
          && (funk.name[0].match(/[A-Z]/));

          if (isConstructor )
          { continue;
          }
          try
          { let  b = funk (value);
            if (b)
            { return true;
            }
          } catch (e)
          { }
       }
      return false;
    }
    static toString ()
    { let typeNames = functions .map
      ( e =>
        { if (typeof e === "function")
          { if (! e.name)
            { return "=>";
            }
            return e.name[0].toUpperCase() + e.name.slice(1);
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
      let s = typeNames.join (' | ');
      return s;
    }
    constructor (  )
    { err(`
Trying to construct an instance 
of the Type ${ this}.
Types can not be instantiated.      
`      );
    }
  };
  zet (AType, 'name', AType + "", "force");
  return AType;
}

function _TypeCombo ()
{ return class  TypeCreator
  { [Symbol.hasInstance] (value)
    { let compTypes = this._compTypes;
       for (let ct of compTypes)
       { if (is (value, ct))
          { return true;
          }
       }
      return;
    }
    constructor (... $CompTypes)
    { if ($CompTypes[0] === null)
      { }
      class TYPE
      { static [Symbol.hasInstance] (value)
        { let compTypes = $CompTypes ;
           for (let ct of compTypes)
           { if (is (value, ct))
             { return true;
             }
           }
           return;
        }
      static new  ()
      { let T0 = $CompTypes [0];
        if (T0 === null  || T0 === undefined)
        { return T0;
        }
        try
        { if (typeof T0 !== "function")
          { let maybeNumber = deepCopy (T0);

            if (typeof T0 === "object")
            { }
            let isNumber    = maybeNumber instanceof Number;
            let newV        = maybeNumber .valueOf() ;

            return newV;
          }
          let itA = new T0 () ;
          return itA .valueOf();
        } catch (e)
        { err
          ( `Type -constructor failed  trying to
             instantiate the first alternative  
             type without argument:
             ${ e}.
             `
          );
        }
    }
  }
      TYPE.toString   = TYPEtoString ;
      this._compTypes = $CompTypes;
      TYPE._compTypes = $CompTypes;

      let temp = TYPE + "";
      return TYPE;

      function TYPEtoString ()
      { let typeNames = $CompTypes .map
        ( e =>
          { if (typeof e === "function")
            { return e.name;
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
        let s = typeNames.join (' | ');
        return s;
      }
    }
  }
}

function _Canary ()
{ assignMethods (Canary);
  return Canary;

  function Canary (memberCheckerFunk)
  { }
}

function assignMethods (Canary)
{ var C      = Canary;
  if (typeof require !== "undefined" &&  require.main)
  { C.r  = require.main.require;
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
is not an instance of any 
of the remaining arguments.
.
`;

err (em);
throw em;

 if (typeof this === "number")
 { debugger
 }
  if (this)
  { let m = "x() error: " + this + `
` + e2.stack ;
    err (m);
  } else
  { err ( e2 );
  }
}

  function xSingle (value, type )
  { try
    { if (value instanceof type)
      { return value;
      }
    } catch (ee)
    { }
    if (value  && value.constructor === type)
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
    var s =  trimLineBeginnings (msg + ``) .slice(0,2048);

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
      s   =  `
` + trimLineBeginnings (s + `
`);
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
      if (! doNotHalt)
      { }
    }
if (this === "no stack")
{ err = err.message;
}
    throw (err);
   }

function eq (a, b)
{ if (a instanceof Array)
  { for (var j=0; j <  a.length; j++)
    { eq (a[j], b[j]);
    }
    if (a.length === b.length)
    { return;
    }
  }
  if (a instanceof Object)
  { for (let p in  a)
    { eq (a[p], b[p]);
    }
    for (let p in  b)
    { eq (a[p], b[p]);
    }
    return;
  }
  if (a === b)
  { return true;
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