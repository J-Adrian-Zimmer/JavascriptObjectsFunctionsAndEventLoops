"use strict";

// JascriptEventLoopUtils.js
//   version: 0.9    (beta)
//   copyright: 2017
//   by J Adrian Zimmer, jazimmer.net
//   MIT License

// Contains factory methods for making promises:
//   hesitating (creates a promise that will hesitate
//               before becoming settled)
//   asPromise  (converts function, with Nodejs style 
//               callback to a promise)

// Also contains  
//     installQer (installs a method in Function.prototype)
// The installed function lets you write 
//     f.<your choice of function name>(...)
// to put a function f on the event queue (i.e. the macrotask queue) 
// with specified arguments;  event queue placement will be
// after a delay that you specify when you run installQer

// Find more documentation in two places 
//
//  https://github.com/J-Adrian-Zimmer/JavascriptObjectsFunctionsAndEventLoops/README.md
//
//  in the ebook
//    "Javscript: Objects, Functions, and Event Loops"

// The ebook is available in Kindle form from Amazon and 
// in epub form from other sources and it contains usage 
// examples.
       
function hesitating(
   micros,       // number of microseconds for the
                 // returned promise to hesitate
                 // before becoming settled
                 // 0 if omitted
   promise_val   // promise value of returned promise
                 // undefined if omitted
) {
  // returns a promise that hesitates for the given 
  // number of microseconds before resolving with
  // the given promise value 
  micros = micros || 0;

  return new Promise(
    function(resolve) {
       setTimeout( 
          ()=>resolve(promise_val), 
          micros 
       )
    }
  );
}

function asPromise() {
   // usage:
   //   asPromise(f,...)
   // returns a promise
   
   // f should work this way
   //    f(...,cb)
   // where cb is a callback that
   // works this way
   //    cb(err, ... )
   // i.e. the way Node.js does error handling


   var args1 = Array.from(arguments),
       f     = args1.shift();
   
   return new Promise(
      function (resolve,reject) {
        function callback() {
           var args2 = Array.from(arguments),
               err = args2.shift();
           if(err)  {
              reject(err);
           } else if( args2.length<=1 ) {
              resolve(args2[0]);
           } else { 
              resolve(args2);
           }
        }
        
        args1.push(callback);
        f.apply( {}, args1 );
     }
  );

}

function installQer(desired_name,delay) {
   // Installs a function desired_name in Function.prototype
   // Then f.desired_name(...) will create a task that executes
   // f with the given parameters and place it on the event queue
   // (i.e. the macrotask queue) after delay seconds has lapsed 

   desired_name = desired_name || 'que'; 
   delay = delay || 0;
   Object.defineProperty( Function.prototype, desired_name, {
      enumerable: false,
      value: function() {
        var that = this,
            args = Array.from(arguments);
        setTimeout( ()=>that.apply({},args), delay ) 
      }
   } );
   console.log(
       desired_name + 
       " has been added to Function.prototype."
   )
}

try {  // except as noted all these functions
       // will work in a browser or with Node.js 
   exports.asPromise = asPromise;
   exports.hesitating = hesitating;
   exports.fetching = fetching;
           // works only with Node.js
   exports.installQer = installQer;
} catch(e) { }


