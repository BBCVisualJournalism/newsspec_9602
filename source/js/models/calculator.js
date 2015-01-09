define(['backbone'], function (Backbone) {
    return Backbone.Model.extend({
		initialize: function () {
			throw new Error('This model should not be initialised, as all methods are class methods.');
		}
	}, {
		/* BELOW ARE CLASS METHODS (STATIC) */
		staticMethod: function () {
			alert('Hello');
		}
	});
});