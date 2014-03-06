var Singleton = App.Singleton = {
  getInstance: function () {
    if (this._instance === undefined) {
      this._instance = new this();
    }
    return this._instance;
  }
};

var View = App.View = function(options){
  this.cid = _.uniqueId('view');
  _.extend(this, options);
  this.initialize();
  this.render();
  this.delegateEvents();
  this.afterCreate();
};

var delegateEventSplitter = /^(\S+)\s*(.*)$/;

_.extend(View.prototype, {
  initialize: function(){
    if (!this.template && !this.id && !this.tagName) {
      console.log("element not specified");
      return;
    }
    if (this.template && !JST[this.template] && !this.id && !this.tagName) {
      console.log("template not exists or template name is wrong");
      return;
    }
    if (this.id) {
      this.$el = $("#"+this.id);
      console.log("get element from DOM, id is", this.id);
    }
    if (!this.$el || !this.$el.length) {
      if (this.template) {
        this.$el = $(JST[this.template](this));
        console.log("get element from template", this.template);
      } else if (this.tagName) {
        this.$el = $('<'+this.tagName+'>');
      }
      if (this.id) this.$el.attr("id", this.id);
    }
    if (this.$el) this.el = this.$el[0];
  },
  $: function(selector) {
    return this.$el.find(selector);
  },
  render: function(){},
  delegateEvents: function(){},
  afterCreate: function(){},
  // Set callbacks, where `this.events` is a hash of
  //
  // *{"event selector": "callback"}*
  //
  //     {
  //       'mousedown .title':  'edit',
  //       'click .button':     'save',
  //       'click .open':       function(e) { ... }
  //     }
  //
  // pairs. Callbacks will be bound to the view, with `this` set properly.
  // Uses event delegation for efficiency.
  // Omitting the selector binds the event to `this.el`.
  // This only works for delegate-able events: not `focus`, `blur`, and
  // not `change`, `submit`, and `reset` in Internet Explorer.
  delegateEvents: function(events) {
    if (!(events || (events = _.result(this, 'events')))) return this;
    this.undelegateEvents();
    for (var key in events) {
      var method = events[key];
      if (!_.isFunction(method)) method = this[events[key]];
      if (!method) continue;

      var match = key.match(delegateEventSplitter);
      var eventName = match[1], selector = match[2];
      method = _.bind(method, this);
      eventName += '.delegateEvents' + this.cid;
      if (selector === '') {
        this.$el.on(eventName, method);
      } else {
        this.$el.on(eventName, selector, method);
      }
    }
    return this;
  },
  undelegateEvents: function() {
    this.$el.off('.delegateEvents' + this.cid);
    return this;
  }
});

var extend = function(protoProps, staticProps) {
  var parent = this;
  var child;

  // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your `extend` definition), or defaulted
  // by us to simply call the parent's constructor.
  if (protoProps && _.has(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = function(){ return parent.apply(this, arguments); };
  }

  // Add static properties to the constructor function, if supplied.
  _.extend(child, parent, staticProps);

  // Set the prototype chain to inherit from `parent`, without calling
  // `parent`'s constructor function.
  var Surrogate = function(){ this.constructor = child; };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate;

  // Add prototype properties (instance properties) to the subclass,
  // if supplied.
  if (protoProps) _.extend(child.prototype, protoProps);

  // Set a convenience property in case the parent's prototype is needed
  // later.
  child.__super__ = parent.prototype;

  return child;
};

View.extend = extend;