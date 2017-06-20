"use strict";

// JascriptEventLoopUtils.js
//   version: 0.9    (beta)
//   copyright: 2017
//   by J Adrian Zimmer, jazimmer.net
//   MIT License
//
// Contains a factory method for making promises:
//   hesitating 
// which creates a promise that will hesitate before 
// becoming fulfilled.
//
// Also contains an installer
//     installQer 
// which installs a method in Function.prototype that
// lets you write
//     f.<your choice of function name>(...)
// to put a function f on the event queue (i.e. the macrotask queue) 
//
// Find more documentation in two places 
//
//  https://github.com/J-Adrian-Zimmer/JavascriptObjectsFunctionsAndEventLoops/README.md
//
//  in the ebook
//    "Javscript: Objects, Functions, and Event Loops"
//
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


