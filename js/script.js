// A basic to-string method to help us debug our objects.
// using `console.log(obj)` with an object literal will not guarentee an
// accurate representation of that object at that instant. Thus we render
// it to a string to get an accurate snapshot.
Object.implement({

  toString: function(target) {
    target = target || this;
    return JSON.encode(this);
  }

});

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
    this.parent(this);
  },
  // We have a custom setter here just to prove that the parent's _notify
  // method is protected; we can accesses it internally, but not externally.
  set: function(key, value) {
    this[key] = value;
    this._notify(key, value);
  }
});

/*

// Create our test instances

// Like cats? Yes.
var cat = new MyClass();

// Like copycats? No.
var copycat = new MyOtherClass();

cat.set('favorite_food', 'mice');
copycat.set('favorite_food', 'corn');

// Each cat has unique tastes.
console.log('cat.favorite_food = ' + cat.get('favorite_food'));
console.log('copycat.favorite_food = ' + copycat.get('favorite_food'));

// Now copycat begins to get annoying.
// Copy Cat want's to know about all the changes to its friend.
cat.bindVar('favorite_food', copycat);

// Our main cat decides he/she has a new favorite food.
cat.set('favorite_food', 'bananas');

// Now they will both be the same value.
console.log('cat.favorite_food = ' + cat.get('favorite_food'));
console.log('copycat.favorite_food = ' + copycat.get('favorite_food'));

console.log('------------------');

// Can we bind a property that does not yet exists?

cat.bindVar('favorite_activity', copycat);
cat.set('favorite_activity', 'napping');

// Looks like we can. Our annoying friend happens to have the same favorite activity.
console.log('cat.favorite_activity = ' + cat.get('favorite_activity'));
console.log('copycat.favorite_activity = ' + copycat.get('favorite_activity'));

cat.unbindVar('favorite_activity', copycat);

cat.set('favorite_activity', 'ignoringy copycat');

console.log('cat.favorite_activity = ' + cat.get('favorite_activity'));
console.log('copycat.favorite_activity = ' + copycat.get('favorite_activity'));

console.log('------------------');

cat.bindVar('favorite_activity', copycat, 'least_favorite_activity');

cat.set('favorite_activity', 'climbing trees');

console.log('cat.favorite_activity = ' + cat.get('favorite_activity'));
console.log('copycat.favorite_activity = ' + copycat.get('favorite_activity'));
console.log('copycat.least_favorite_activity = ' + copycat.get('least_favorite_activity'));

console.log('------------------');

cat.unbindVar('favorite_activity', copycat, 'least_favorite_activity');

cat.set('favorite_activity', 'runing from dogs');

console.log('cat.favorite_activity = ' + cat.get('favorite_activity'));
console.log('copycat.favorite_activity = ' + copycat.get('favorite_activity'));
console.log('copycat.least_favorite_activity = ' + copycat.get('least_favorite_activity'));

console.log('------------------');

cat.bindVar('instinct', copycat, true);
cat.set('instinct', 'killer');
console.log('cat.instinct', cat.get('instinct'));
console.log('copycat.instinct', copycat.get('instinct'));
copycat.set('instinct', 'napping');
console.log('cat.instinct', cat.get('instinct'));
console.log('copycat.instinct', copycat.get('instinct'));

// Try unbinding both ways.
//cat.unbindVar('instinct', copycat, true);
copycat.unbindVar('instinct', cat, true);

cat.set('instinct', 'killer');
copycat.set('instinct', 'micing');
console.log('cat.instinct', cat.get('instinct'));
console.log('copycat.instinct', copycat.get('instinct'));

*/











window.addEvent('domready', function() {

  // Create an Element from our paragraph element.
  p = $('test');

  // Create a new class to bind with.
  t = new MyClass();

  // One-way binding of 'text' to instance `t`.
  p.bindVar('text', t);

  // Two-way binding of p.data-id to t.id.
  p.bindVar('data-id', t, 'id', true);

  p.set('text', 'monkeys love bananas');
  p.set('data-id', 'crizazzle');

  // Now try these in your console:
  //
  // t.get('data-id'); // crizazzle
  //
  // t.set('id', 'monkey');
  // p.get('data-id'); // monkey

  // Grab the input and make an Element out of it.
  i = $('myInput');

  // Create a class to bind to our input.
  it = new MyClass();

  // Create a two-way binding between i.value and it.value
  i.bindVar('value', it, true);
  i.set('value', 'monkeys');

  // Now try these in your console:
  //
  // it.get('value'); // monkeys
  // it.set('value', 'bananas'); // input now shows 'bananas'

  i.unbindVar('value', it);

  // Create a checkbox and bind it's value to an object and a paragraph
  // Demonstrates using a class to watch the changes in a checkbox input
  // and using bindings to update the text value of a gui element.
  c = $('myCheck');
  ct = new MyClass();

  c.bindVar('checked', ct, true);

  c.bindVar('checked', function(key, value) {
    console.log('calling custom callback on P with ' + key + ' = ' + value);
    this.set('text', "You've opted " + ((value) ? 'in' : 'out'));
  }.bind(p));

});

