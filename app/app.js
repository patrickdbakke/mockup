var app = new Backbone.Marionette.Application();
app.addRegions({
	content: "#content",
});
app.router = Backbone.Router.extend({
	routes: {
		"*actions": "default"
	}
});
app.routes = new app.router();
app.routes.on("route:default",function(actions){
	var content=new contentView();
	app.content.show(content);
	$(window).resize(function(){
		content.resize();
	});
});
app.start=function(){
	Backbone.history.start();
}();