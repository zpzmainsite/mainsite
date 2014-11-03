var personCenter = function(opt){
	this.opt = opt;
	var _this = this;
	
	this.init = function(){
		var url ='/networking/UserDetails';
		var _this = this;
		$.get(global.serviceUrl + url,{"userId":_this.opt}, function (msg) {
    		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
    			var baseInformation = msg.d.data.baseInformation;
    			var userParticulars = baseInformation.userParticulars;
    			_this.fillData(baseInformation);
    			_this.fillParticular(userParticulars);
    		}
        });
	};
	this.fillData = function(data){
		this.container = $(".info-tips");
		this.container.find(".user_head img").attr("src",global.server + data.userImage);
		this.container.find(".nick_name").text(data.userName);
		this.container.find(".real_name").text(data.fullName);
		this.container.find(".cell_phone").text(data.cellphone);
		this.container.find(".email").text(data.email);
	};
	
	this.fillParticular = function(data){
		console.log(data);
	};
	
	this.init();
	
};

$(function(){
	new personCenter(global.getUserId());
});