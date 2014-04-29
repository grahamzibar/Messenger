(function MessengerModule() {
	// Insert Receive class
	
	// Insert Send class
	
	// Modify this... we should be creating listener OBJECTS,
	// which can subscribe to multiple messages if desired.
	// This way, clean-up is simple.
	
	// Senders should send to specific modules?  Or is it
	// a blind dispatch??
	var SERIAL = 0;
	Function.prototype.MESS_ID = {};
	// Bubbling is interesting too....
	window.Dispatcher = function Messenger(_parent) {
		var _id = SERIAL++;
		var _events = {};

		this.subscribe = function() {
			var eventLen = arguments.length - 1;
			var callback = arguments[eventLen];
			for (var i = 0, event; i < eventLen; i++) {
				event = arguments[i];
				var rry = _events[event];
				if (!rry)
					rry = _events[event] = new Array();
				callback.Dispatcher_ID[_id] = rry.length;
				rry[callback.Dispatcher_ID[_id]] = callback;
			}
		};

		this.unsubscribe = function(event, callback) {
			var _idee = _id;
			var eventLen = arguments.length - 1;
			var callback = arguments[eventLen];
			for (var i = 0, rry, id, event, length; i < eventLen; i++) {
				event = arguments[i];
				rry = _events[event];
				id = callback.Dispatcher_ID[_idee];
				if (!rry || (!id && id !== 0))
					return;
				if (!rry[id])
					return;

				rry.splice(id, 1);

				length = rry.length;
				if (!length) {
					delete _events[event];
					delete callback.Dispatcher_ID[_idee];
					return;
				}
				for (var j = 0; j < length; j++)
					rry[j].Dispatcher_ID[_idee] = j;
			}
		};

		this.send = function(event, data, bubble) {
			var rry = _events[event];
			if (!rry)
				return;
			var length = rry.length;
			for (var i = 0; i < length; i++)
				rry[i](data);
			if (_parent && (bubble === null || bubble))
				_parent.dispatch(event, data, true);
		};

		this.cancel = function(event) {
			if (event)
				delete _events[event];
			else
				_events = {};
		};
	};
})();