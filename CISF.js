/* =========================================
   Copyright 2017 Panu Viljamaa

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
   FILE: CISF.js
   USAGE:   const {ok, not, x, fails, x, log, err} = require ("CISF");
   =========================================== */

"use strict"

let CISF = CISF_inner ();
if (typeof module !== "undefined")
{ module.exports =  CISF;
}

function CISF_inner  ()
{ var C          = _Canary()    ;
  const ok=C.ok, not=C.not, x=C.x, fails=C.fails, is=C.is;
  let Type = _Type();
  const Xer = _Xer();
  const AssertError = class AssertError extends Error { };

  return { ok, not, x, fails, is, Type, log, warn, err};

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
{ let s2 =
 (s + "").trim()
         .replace(/\n\s*/g, `\n`);

  return s2;
}

function _Type ()
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
    { class TYPE
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
        { return T0;
        }
        let itA = new T0 () ;

        return itA .valueOf();
      } catch (e)
      { debugger

        err
        ( `Type -constructor failed  trying to
           instantiate the first alternative  
           type without argument:
           ${ e}.
           `
        );
      }
    }
      }
      this._compTypes = $CompTypes;
      TYPE._compTypes = $CompTypes;
      return TYPE;
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
{ var C = Canary;
  C.ok      = ok    ;
  C.not      = not    ;
  C.x        = x      ;
  C.fails    = fails  ;
  C.is       = is    ;

  C.log     = log    ;
  C.warn     = warn  ;
  C.err     = err    ;

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
      { var loc = getCallingLine();
         var m = `not(): ${ msg}) 
         at: ${ loc}
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

function x (value, ... types)
{ if (! arguments.length)
  { err (`x() called without arguments.`);
  }
  if (! types.length)
  { if (value === null || value === undefined)
    { err (`x() called with ${ value} as only argument.`);
     }
    return xSingle (value);
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

  if (this)
  { let m = this + `: 
` + e2.stack ;
    err (m);
  } else
  { err ( e2 );
  }
}

  function xSingle (value, type )
  { if (value === type)
    { return value;
    }
    if (type === null)
    { if (value === null || value === undefined)
      { return value;
      }
      let em = `
      x(value, ... null) called with
      value which is not null nor undefined `;
      err (em);
    }
    try
    { if (value instanceof type)
      { return value;
      }
     } catch(e)
    { }
    if (arguments.length ===  2)
    { if (type === undefined)
      { return value;
      }
    }
    if (arguments.length ===  0)
    { if   (value !== undefined && value !== null)
      { return value;
      }
      let em = `
      x()  called without argument      `;
      err (em);
    };

    if ( arguments.length ===  1
      || arguments[1] === undefined
       )
    { if (value !== undefined && value !== null)
      { return value;
      }
      let em = `
        x()  called with 1 argument
        which is either null or undefined:
        ${ value} 
      `;
       err (em);
    };

    if (type === null)
    { if ( value === undefined )
      { let em = `
      x(${ value}, null) 
      fails.  null used as type
      accpets everything EXCEPT undefined.
      `;
       err(em);
      }
      return value;
    }
    if (value === undefined || value === null)
    { if ( isClass(type) )
      { let em = `
        x(${ value}, ${ type}) 
        fails.  'undefined'  is not valid
        first argument if 2nd argument is 
        a class.
        `;
        err(em);
      }
    }
    let  simple, wasError = true;
    simple = checkAndReturn (value, type   );
    if (notXer (simple))
    { return simple;
    }
xer (simple );

       simple = checkAndReturn (value, type );
       if (simple)
      { return value;
      }
        let em = `
        x() caused error:
        ${ e}
        Arguments were: 
        ${ value}, ${ type}, ${ type}, ...'
      `;
       err (em);
  }

  function checkAndReturn (a, b)
  { if (a && a.valueOf)
    { a = a.valueOf();
    }
    if (b && b.valueOf)
    { b = b.valueOf();
    }
    if (a === b)
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
      { return a;
      }
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
if ((b + "" ).match(/xtype/))
{ b(a);
}
        err
       (` 
x(${ a}, ${ b}) failed
because the predicate call
 ${ b} (${ a})
does not return == true. 
       `);
      } catch (e)
      { err
       (` 
x(${ a}, ${ b}) failed with error:
 ${ e}
       `);
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
      let typeFieldsCount = Object.keys(type).length;
      if (typeFieldsCount === 0)
      { return value;
      }
      if (typeFieldsCount === 1)
      { let [k,v] = Object.entries (type)[0];
         let typen =  v;

         for (let p in value)
         { let compValue = value[p];
            if (is (compValue, typen))
             { continue;
             } else
             { error = `Field ${ p} type-check
                   ${ typen} failed 
                   with value-field value
                   ${ compValue}. `
            }
         }
         return value;
      }
     let error;
     for (let p in type)
     { let typen     = type [p];
       let compValue = value[p];
       if (is (compValue, typen))
       { continue;
       } else
       { error = `Field ${ p} type-check
                   ${ typen} failed 
                   with value-field value
                   ${ compValue}. `
       }
     }
      if (error)
     { err (new Error (error));
     }
     for (let p in value)
     { if (type[p] === undefined)
       { error = `Field '${ p}' in the value does not exist in the type.`
          debugger

         break;
       }
       x (value[p], type[p]);
     }
      if (error)
     { err (new Error (error));
     }
     return value;
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

  function fails (funk = x => null.error )
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
    lineForCallingModule.replace(/^\([A-Z]\:/, "");
    var sep = require("path").sep;
    var parts = woDrive.split( sep );
    var filePart = parts[parts.length - 1];
    var m = `${ filePart}
(${ woDrive}`
    return m;
  }

  function log (msg = "The String to log")
  { var s = "" + msg + "";
    let date = new Date();
    let ms =  date.getMilliseconds();
    if (ms.length === 1) ms = "00" + ms;
    if (ms.length === 2) ms = "0" + ms;
    let s2 = date. toLocaleTimeString() +   " "
              + ms  + " "  + s ;
    console.log (s2);

    return s2;
  }

 function warn (msg)
 { return log (`
   WARNING:
   ${ msg}
   `);
 }

  function err ( s = "", ErrorClass = AssertError )
  { s   =  s + ``;
     var err = new ErrorClass ( s );

    if (  (  new Error ()).stack  . match (/fails\s*\(/)   )
    { } else
    { }
    throw (err);
   }
}