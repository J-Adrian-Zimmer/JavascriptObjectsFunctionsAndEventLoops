Javascript: Objects, Functions, and Event Loops
---------------------------

The utilities and examples here are companions to the ebook of the same name.

If you have come here without reading the ebook, your interest is probably in `JavascriptEventLoopTools.js` which contains

1. `hesitating` which takes a value `v` and a number of microsecs `msecs` and returns a promise which waits `msecs` before becoming fulfilled with value `v`.
1. `asPromise` which takes a Node.js style function with arguments that requires a callback and returns a promise that has executed the function and awaits a response.
3. `installQer` which installs a function `youNameIt` in `Function.prototype` that makes it possible to delay execution of any function `f` with `f.youNameIt(`*args*`)`.

##### Here's more information about each function.

For even more information together with simple test examples read "Javascript: Objects, Functions, and Event Loops".

**`hesitating( msecs, promise_val )`**

> Returns a promise that fulfills with promise value `promise_val` after `msecs` microseconds.   If run with no arguments `msecs` will be 0 and `promise_val` will be `undefined`.


**`asPromise( f`** *, argsf* **`)`** 
> `f` must be a Node.js style callback requiring function, invoked like this 
> > `f(` *argsf,* ` cb)`

> where `cb` is expected to be invoked like this

> > `cb(err,` *argscb* `)`
> 
> Here *argsf* consists of zero or more arguments and *argscb* consists of one or more arguments.  Notice you do not pass `cb` to `asPromise`.  Instead `asPromise` creates `cb` and returns a promise `p` that will execute `f` and become fulfilled when `cb` is called with undefined `err` and rejected when `cb` is called with defined `err`.

**`installQer(method_name,msecs)`**

> Adds a method to `Function.prototype` whose name is `method_name`.  Reports on the console what it has done. Assuming `method_name` is "que", the installed method allows delayed execution of any function `f` this way

> > `f.que(` *args* `)`

> The effect is to place this task

> > `function () { f(` *args* `) }`

> on the macrotask queue after a delay of `msecs` microseconds.  If missings, `msecs` is assumed to be 0.


