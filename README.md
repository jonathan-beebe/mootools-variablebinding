Description
===========

Provides one and two-way data binding of variables between Mootools Classes and Elements.

The Project
===========

You'll mainly be concerned with two files `js/classes/VariableBinding.js` and
`js/classes/Element.js`.

The rest of the project is for testing. You'll see it includes Mootools and other
scripts to make sure everything works right.

Submodules
----------

This project includes google's closure library in the `vendors` folder. It's
only used for the unit testing. Overkill? Yes. But it's what I'm used to. If
you have a simpler suggestion I'm all ears.

Examples
========

Let's say you have two classes defined as follows:

``` javascript

// Create a test class implementing VariableBinding.
// Our class will adopt the methods of VariableBinding.
MyClass = new Class({
  Implements: VariableBinding
});

// Create a test class extending VariableBinding.
// Our class is extending, so it can customize the constructor behavior.
MyOtherClass = new Class({
  Extends: VariableBinding,
  initialize: function(params) {
	// Set the datastore to be this instance.
	// Thus using instance.key === instance.get('key').
	// If you don't pass `this` into parent it'll use the default _store.
	this.parent(this);
  }
});

```

Bind them together as follows:

``` javascript

// Like cats?
var cat = new MyClass();

// Like copycats?
var copycat = new MyOtherClass();

cat.set('favorite_food', 'mice');
copycat.set('favorite_food', 'corn');

// Each cat has unique tastes.
console.log(cat.get('favorite_food')); // 'mice'
console.log(copycat.get('favorite_food')); // 'corn

// Now copycat begins to get annoying.
// Copy Cat want's to know about all the changes to its friend.
cat.bindVar('favorite_food', copycat);

// Our main cat decides he/she has a new favorite food.
cat.set('favorite_food', 'bananas');

// Now they will both be the same value.
console.log(cat.get('favorite_food')); // 'bananas'
console.log(copycat.get('favorite_food')); // 'bananas'

```

Simple, eh? How about undoing the binding?

``` javascript

cat.bindVar('favorite_activity', copycat);
cat.set('favorite_activity', 'napping');

// Now both cat's have the same favorite_activity: 'napping'.

// Cat's had enough of this!
cat.unbindVar('favorite_activity', copycat);
cat.set('favorite_activity', 'ignoring copycat');

console.log(cat.get('favorite_activity')); // 'ignoring copycat'
console.log(copycat.get('favorite_activity')); // 'napping'

```

Nice. But you're bound to need something a bit more flexible.
How about when you want to bind to variables, but they aren't the same key?

``` javascript

// Copy cat decides the game's over...now it's time for opposites!
// Let's bind cat's favorite_activity to copycat's least_favorite_activity.
cat.bindVar('favorite_activity', copycat, 'least_favorite_activity');

cat.set('favorite_activity', 'climbing trees');

console.log(cat.get('favorite_activity')); // 'climbing trees'
console.log(copycat.get('favorite_activity')); // 'napping'
console.log(copycat.get('least_favorite_activity')); // 'climbing trees'

```

Well, two can play at this game. Cat decides to copy copycat...

``` javascript

// Bind the `instinct` property two-ways.
cat.bindVar('instinct', copycat, true);

// Set cat's instinct:
cat.set('instinct', 'killer');

// Now they both share the same instinct:
console.log(cat.get('instinct')); // 'killer'
console.log(copycat.get('instinct')); // 'killer'

// Set copycat's instinct:
copycat.set('instinct', 'napping');

// They're still the same value!
console.log(cat.get('instinct')); // 'napping'
console.log(copycat.get('instinct')); // 'napping'

```

And unbindbing works two-ways as well:

``` javascript

// You can unbind from either cat, and the other will also be un-bound.
copycat.unbindVar('instinct', cat, true);

// Both cat's get their identity back
cat.set('instinct', 'killer');
copycat.set('instinct', 'micing');

console.log(cat.get('instinct')); // 'killer'
console.log(copycat.get('instinct')); // 'micing'

```
