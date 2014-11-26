var BannerImages = function(){
	
	this.init = function(){
		var _this = this;
		var url = '/BannerImages/BannerImages';
		$.get(global.serviceUrl + url, function(msg) {
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				_this.fillData(msg.d.data);
			}
		}).done(function(msg){
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				var data = msg.d.data;
				if(data.length > 0){
					$(".slideBox").slide({
					    mainCell: ".bd ul",
					    effect: "leftLoop",
					    autoPlay: true,
					    trigger: "click",
					    delayTime: 1000,
					    easing: "easeOutCirc"
					});
				}
			}
		});
	};
	
	this.fillData = function(data){
		var _this = this;
		if(data.length > 0){
			_this.initPoint(data);
			_this.initPic(data);
		}
	};
	this.initPic = function(data){
		var _this = this;
		var container = $("#slideBox .bd ul");
		$.each(data,function(i, j){
			var imageUrl = global.imageUrl + j.imageUrl;
			container.append('<li><a href="###"><img src="' + imageUrl + '" /></a></li>');
		});
	};
	this.initPoint = function(data){
		var _this = this;
		var container = $("#slideBox .hd ul");
		$.each(data,function(i, j){
			container.append("<li></li>");
		});
	};
	
	this.init();
}



$(function(){
	new BannerImages();
});