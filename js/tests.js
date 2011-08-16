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

function testOneWayVariableUnbinding() {

  var cat = new MyClass();
  var copycat = new MyOtherClass();

  cat.bindVar('favorite_activity', copycat);
  cat.set('favorite_activity', 'napping');

  assertEquals('Expect properties to equal', cat.get('favorite_activity'), 'napping');
  assertEquals('Expect properties to equal', cat.get('favorite_activity'), copycat.get('favorite_activity'));

  // Now that they are bound and we have verified this...unbind the var.

  cat.unbindVar('favorite_activity', copycat);
  cat.set('favorite_activity', 'ignoring copycat');

  assertEquals('Expect properties to equal', cat.get('favorite_activity'), 'ignoring copycat');
  assertEquals('Expect properties to equal', copycat.get('favorite_activity'), 'napping');
  assertNotEquals('Expect properties to not equal', cat.get('favorite_activity'), copycat.get('favorite_activity'));

}


function testOneWayVariableBinding() {

  var cat = new MyClass();
  var copycat = new MyOtherClass();

  cat.set('favorite_food', 'mice');
  copycat.set('favorite_food', 'corn');

  assertEquals('Expect properties to equal', cat.get('favorite_food'), 'mice');
  assertEquals('Expect properties to equal', copycat.get('favorite_food'), 'corn');
  assertNotEquals('Expect properties to not equal', cat.get('favorite_food'), copycat.get('favorite_food'));

  // Now copycat begins to get annoying.
  // Copy Cat want's to know about all the changes to its friend.
  cat.bindVar('favorite_food', copycat);

  // Our main cat decides he/she has a new favorite food.
  cat.set('favorite_food', 'bananas');

  assertEquals('Expect properties to equal', cat.get('favorite_food'), 'bananas');
  assertEquals('Expect properties to equal', cat.get('favorite_food'), copycat.get('favorite_food'));

}

function testTwoWayVariableBinding() {

  var cat = new MyClass();
  var copycat = new MyOtherClass();

  cat.bindVar('instinct', copycat, true);
  cat.set('instinct', 'killer');

  assertEquals('Expect properties to equal', cat.get('instinct'), 'killer');
  assertEquals('Expect properties to equal', cat.get('instinct'), copycat.get('instinct'));

  copycat.set('instinct', 'napping');
  
  assertEquals('Expect properties to equal', copycat.get('instinct'), 'napping');
  assertEquals('Expect properties to equal', cat.get('instinct'), copycat.get('instinct'));

}

function testTwoWayVariableUnbinding() {

  var cat = new MyClass();
  var copycat = new MyOtherClass();

  cat.bindVar('instinct', copycat, true);
  cat.set('instinct', 'killer');

  // Now the two cat's have matching `instinct`s.

  copycat.unbindVar('instinct', cat, true);

  cat.set('instinct', 'killer');
  copycat.set('instinct', 'micing');

  assertEquals('Expect properties to equal', cat.get('instinct'), 'killer');
  assertEquals('Expect properties to equal', copycat.get('instinct'), 'micing');
  assertNotEquals('Expect properties to equal', cat.get('instinct'), copycat.get('instinct'));


}

function testBindingNonexistentProperty() {

  var cat = new MyClass();
  var copycat = new MyOtherClass();

  // Can we bind a property that does not yet exists?

  cat.bindVar('favorite_activity', copycat);
  cat.set('favorite_activity', 'napping');

  assertEquals('Expect properties to equal', cat.get('favorite_activity'), 'napping');
  assertEquals('Expect properties to equal', cat.get('favorite_activity'), copycat.get('favorite_activity'));

}

function testProtectedNotifyMethod() {

  var copycat = new MyOtherClass();

  // Let's prove that copycat's _notify method is really protected.
  assertThrows('Expect an error', function() {
    copycat._notify('favorite_food', 'tasty oats');
  });

}

