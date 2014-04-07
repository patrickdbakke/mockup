var bob;
var contentView = Marionette.ItemView.extend({
	template : "#contentTemplate",
	events:{
		"change #bgFileUpload":"bgUpload",
		"change #overlayFileUpload":"overlayUpload",
		"click #bgFileButton":"bgButton",
		"click #overlayFileButton":"overlayButton",
		"click #downloadButton":"downloadButton",
		"click #canv":"positionOverlay",
		"drop #canv":"dragDrop",
		"dragover #canv":"dragOver"
	},
    initialize: function() { },
	dragOver: function(e) {
		e.stopPropagation();
		e.preventDefault();
	},
	dragDrop:function(e){
		e.preventDefault();
		e.stopPropagation();
		console.debug(e.originalEvent);
		if(e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files.length>0){
			console.debug(this.inside([e.originalEvent.offsetX,e.originalEvent.offsetY],this.clickSpots),[e.originalEvent.offsetX,e.originalEvent.offsetY],this.clickSpots);
			if($("#overlayFileButton").hasClass("disabled") || !this.inside([e.originalEvent.offsetX,e.originalEvent.offsetY],this.clickSpots)){
				this.loadImageToDiv(e.originalEvent.dataTransfer.files[0],"bg");
			}else{
				this.loadImageToDiv(e.originalEvent.dataTransfer.files[0],"overlay");
			}
		}
	},
	inside:function (p, vs) {
		var ret = false;
		for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
			if (((vs[i][1] > p[1]) != (vs[j][1] > p[1]))
				&& (p[0] < (vs[j][0] - vs[i][0]) * (p[1] - vs[i][1]) / (vs[j][1] - vs[i][1]) + vs[i][0]))
				ret = !ret;
		}
		return ret;
	},
	bgButton:function(e){$("#bgFileUpload").click();},
	overlayButton:function(e){
		if($(e.target).hasClass("disabled")){
			e.preventDefault();
		}else{
			$("#overlayFileUpload").click();
		}
	},
	downloadButton:function(e){
		if($(e.srcElement).hasClass("disabled")){
			e.preventDefault();
			e.stopPropagation();
		}
	},
	onShow: function(){
		bob=this;
		var that=this;
		this.canvas = document.getElementById("canv");
		if(this.canvas){
			this.context = this.canvas.getContext("2d");
			this.canvas.width=this.canvas.offsetWidth;
			this.canvas.height=this.canvas.offsetHeight;
		}
	},
	bgUpload:function(e){
		var file=$(e.target).get(0).files[0];
		this.loadImageToDiv(file,"bg");
	},
	positionOverlay:function(e){
		if($("#overlayButton").hasClass("disableClick"))
			return false;
		var that=this;
		var c=$("#canv"),
			o=$("#overlay"),
			clickNum=this.clickNum%4,
			clickSpots=this.clickSpots;
		this.clickSpots[clickNum]=[e.offsetX,e.offsetY];
		if(clickNum==3){
			var width=o.width(),
				height=o.height(),
				scaleX=1,
				scaleY=1,
				scaleZ=1,
				thetaX=0,
				thetaY=0,
				thetaZ=0,
				cX=(clickSpots[0][0] + clickSpots[1][0] + clickSpots[2][0] + clickSpots[3][0])/4,
				cY=(clickSpots[0][1] + clickSpots[1][1] + clickSpots[2][1] + clickSpots[3][1])/4;
			var corners=[];
				corners.push({x:clickSpots[0][0],y:clickSpots[0][1],u:0,v:0});
				corners.push({x:clickSpots[1][0],y:clickSpots[1][1],u:width,v:0});
				corners.push({x:clickSpots[2][0],y:clickSpots[2][1],u:width,v:height});
				corners.push({x:clickSpots[3][0],y:clickSpots[3][1],u:0,v:height});
			this.corners=corners;
			this.draw(corners);
			$(".menuButton").removeClass("active");
			$("#downloadButton").addClass("active");
		}
		var angle=45+90*(this.clickNum+1);
		$("#pointer").css({
			"-webkit-transform":"rotate("+angle+"deg)"
		});
		this.clickNum++;
	},
	drawCorners:function(corners){
		var corner, i;
		this.context.lineWidth = 3;
		this.context.strokeStyle = "red";
		this.context.beginPath();
		for (i = 0; i < corners.length; i++){
			corner = corners[i];
			this.context.moveTo(corner.x, corner.y);
			corner = corners[(i + 1) % corners.length];
			this.context.lineTo(corner.x, corner.y);
		}
		this.context.stroke();
		this.context.closePath();
		this.context.strokeStyle = "green";
		this.context.strokeRect(corners[0].x - 2, corners[0].y - 2, 4, 4);
    },
	resize:function(){
		var that=this;
			that.canvas.width=parseInt($(".content").width());
			that.canvas.height=parseInt($(".content").height());
			that.draw();
	},
	draw:function(){
		var bg=document.getElementById("bg");
		var ratio=$("#bg").width()/$("#bg").height();
		var w=Math.min(parseInt($("#bg").width()), this.canvas.width);
		if(w/ratio>this.canvas.height){
			console.debug("here!");
			w=this.canvas.height*ratio;
		}
		var h=w/ratio;
		this.canvas.width=w;
		this.canvas.height=h;
		this.canvas.style.width=w+"px";
		this.canvas.style.height=h+"px";
		this.context.drawImage(bg, 0, 0,w,h);
		if(this.corners && this.corners.length){
			this.drawScreen(document.getElementById("canv").getContext("2d"),document.getElementById("overlay"),this.corners);
		}
		var data=this.canvas.toDataURL("image/png");
		$("#downloadButton").attr("href",data.replace("image/png", "image/octet-stream"));
	},
	drawScreen: function (ctx, texture, pts) {
		var tris = [[0, 1, 2], [2, 3, 0]];
		for (var t=0; t<2; t++) {
			var pp = tris[t];
			var x0 = pts[pp[0]].x, x1 = pts[pp[1]].x, x2 = pts[pp[2]].x;
			var y0 = pts[pp[0]].y, y1 = pts[pp[1]].y, y2 = pts[pp[2]].y;
			var u0 = pts[pp[0]].u, u1 = pts[pp[1]].u, u2 = pts[pp[2]].u;
			var v0 = pts[pp[0]].v, v1 = pts[pp[1]].v, v2 = pts[pp[2]].v;
			ctx.save(); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
			ctx.lineTo(x2, y2); ctx.closePath(); ctx.clip();
			var delta = u0*v1 + v0*u2 + u1*v2 - v1*u2 - v0*u1 - u0*v2;
			var delta_a = x0*v1 + v0*x2 + x1*v2 - v1*x2 - v0*x1 - x0*v2;
			var delta_b = u0*x1 + x0*u2 + u1*x2 - x1*u2 - x0*u1 - u0*x2;
			var delta_c = u0*v1*x2 + v0*x1*u2 + x0*u1*v2 - x0*v1*u2
						  - v0*u1*x2 - u0*x1*v2;
			var delta_d = y0*v1 + v0*y2 + y1*v2 - v1*y2 - v0*y1 - y0*v2;
			var delta_e = u0*y1 + y0*u2 + u1*y2 - y1*u2 - y0*u1 - u0*y2;
			var delta_f = u0*v1*y2 + v0*y1*u2 + y0*u1*v2 - y0*v1*u2
						  - v0*u1*y2 - u0*y1*v2;
			ctx.transform(delta_a/delta, delta_d/delta,
						  delta_b/delta, delta_e/delta,
						  delta_c/delta, delta_f/delta);
			ctx.drawImage(texture, 0, 0);
			ctx.restore();
		}
	},
	clickNum:0,
	clickSpots:[[0,0],[0,0],[0,0],[0,0]],
	overlayUpload:function(e){
		var file=$(e.target).get(0).files[0];
		this.loadImageToDiv(file,"overlay");
	},
	loadImageToDiv:function(file,id){
		var that=this;
		var fr=new FileReader();
		var $div=$("#"+id);
		var div=document.getElementById(id);
			div.onload=_.bind(this.draw,this);
		fr.onload=function(e){
			$div.attr("src",e.target.result);
			if(id=="bg"){
				that.canvas.width=parseInt($(".content").width());
				that.canvas.height=parseInt($(".content").height());
				$("#blur").attr("src",e.target.result);
				$(".menuButton").removeClass("active");
				$("#overlayFileButton").addClass("active").removeClass("disabled");
			}else if(id=="overlay"){
				$("#pointer").show();
				$("#overlayFileButton").removeClass("disableClick");
			}else{
				$(".menuButton").removeClass("active");
			}
		}
		fr.readAsDataURL(file);
	}
});