var personCenter = function(opt){
	this.opt = opt;
	var _this = this;
	
	this.init = function(){
		var url ='/networking/UserDetails';
		var _this = this;
		$.get(global.serviceUrl + url,{"userId":_this.opt}, function (msg) {
    		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
    			var baseInformation = msg.d.data.baseInformation;
    			_this.fillData(baseInformation);
    		}
        });
	};
	this.fillData = function(data){
		this.container = $(".info-tips");
		this.container.find(".user_head img").attr("src",global.server + data.userImage.imageLocation);
		this.container.find(".nick_name").text(data.userName);
		this.container.find(".real_name").text(data.fullName);
		this.container.find(".cell_phone").text(data.cellPhone);
		this.container.find(".email").text(data.email);
		console.log(data);
	};
	
	this.init();
	
};

$(function(){
	new personCenter(global.getUserId());
});