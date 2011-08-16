/**
 * A very simple property binding class.
 * Allows for child-classes to have their properties bound to target
 * objects/classes.
 */
VariableBinding = new Class({

  /**
   * A place to store all bound objects.
   * @type {object}
   */
  _bound: {},

  /**
   * A place to store all class properties.
   * We use class property instead of `this` as the datastore so child classes
   * can control where properties are set/get. This is very useful when you
   * specifically *dont* want properties on `this`. But if you do, simply pass
   * `this` into the initialize method.
   * @type {object}
   */
  _store: {},

  initialize: function(store) {
    // Initialize the data store. Child classes can override where properties
    // are set/get by calling this.parent(obj) in their initialize method.
    // To use the class instance as the store pass `this` as the `store` param.
    this._store = (store) ? store : this._store;
  },

  /**
   * Bind a property of the instance to a target Object/Class.
   * Pass true as the last parameter (either 3rd or 4th) to create a two-way
   * binding between `this` and the target object.
   *
   * @param {string} key The property name to bind.
   * @param {(Object|Class)} target The target to update on changes.
   * @param {(string=|boolean=)} opt_c If a string, it overrides the key for the
   *    target obj. If a boolean === true then requests two-way binding.
   */
  bindVar: function(key, target, opt_c) {

    // If we have a custom key defined in opt_c, use it as the target's key.
    var targetKey = (typeOf(opt_c) === 'string') ? opt_c : key;

    // If the last argument passed into this method is a boolean then the user
    // is telling if they want to bind two-ways.
    var twoWay = (arguments[arguments.length - 1] === true);

    if (!this._bound[key]) {
      this._bound[key] = [];
    }

    // bind this.key to target.targetKey
    this._bound[key].push({
      target: target,
      key: targetKey
    });

    // Are we binding two-ways?
    if (twoWay && typeOf(target.bindVar) === 'function') {
      // bind target.targetKey to this.key
      target.bindVar(targetKey, this, key);
    }

    return this;

  },

  /**
   * Remove a target from the binding.
   * Pass true as the last parameter (either 3rd or 4th) to create a two-way
   * unbinding between `this` and the target object.
   *
   * @param {string} key The property name to bind.
   * @param {(Object|Class)} target The target to update on changes.
   * @param {(string=|boolean=)} opt_c If a string, it overrides the key for the
   *    target obj. If a boolean === true then requests two-way unbinding.
   */
  unbindVar: function(key, target, opt_c) {

    // If we have a custom key defined in opt_c, use it as the target's key.
    var targetKey = (typeOf(opt_c) === 'string') ? opt_c : key;

    // If the last argument passed into this method is a boolean then the user
    // is telling if they want to bind two-ways.
    var twoWay = (arguments[arguments.length - 1] === true);

    // If no items bound to the key we have nothing to do here.
    if (!this._bound[key]) { return this; }

    // If we have a specific target defined, only remove the target.
    if (target) {

      // Loop thru each bound target. If the target & key match, remove it.
      this._bound[key].some(function(item, index, array) {
        if (item.target === target && item.key === targetKey) {

          // Is this a two-way unbinding?
          if (twoWay && typeOf(target.unbindVar) === 'function') {
            target.unbindVar(targetKey, this, key);
          }

          delete array[index];
          return true;
        }
      }.bind(this));
    }
    // Otherwise, with no target defined, remove all targets bound to the key.
    else {
      // TODO: should be perform two-way unbinding here?
      delete this._bound[key];
    }

    return this;
  },

  set: function(key, value) {
    if (this._store[key] !== value) {
      this._store[key] = value;
      this._notify(key, value);
    }
    return this;
  },

  get: function(key) {
    return this._store[key];
  },

  /**
   * Notify all targets bound to a property when the prop changes.
   *
   * @protected
   * @param {string} key The property name.
   * @param {mixed} value The property value.
   */
  _notify: function(key, value) {

    if (!this._bound[key]) { return; }

    Array.each(this._bound[key], function(item) {
      // If it's a function, call it.
      if (item.target instanceof Function) {
        item.target(item.key, value);
      }
      // Otherwise if it's got a setter, use it.
      else if (item.target.set && item.target.set instanceof Function) {
        item.target.set(item.key, value);
      }
      // Otherwise just set the property directly.
      else {
        // If you always bind to/from classes inheriting or extending this class
        // then your code should never get here since it'll always use the
        // custom set method of this class.
        item.target[item.key] = value;
      }
    });
  }.protect() // only accessible to internal methods, not publicly.

});

