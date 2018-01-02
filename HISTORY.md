# Release Notes for CISF.js

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
  fields in the value but their types muts be all
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
First Release.
 

