var app = new Backbone.Marionette.Application();
app.addRegions({
	// menu: "#menu",
	content: "#content",
});
app.router = Backbone.Router.extend({
	routes: {
		"*actions": "default"
	}
});
app.routes = new app.router();
app.routes.on("route:default",function(actions){
	// app.menu.show(new menuView);
	app.content.show(new contentView);
});
app.start=function(){
	Backbone.history.start();
}();