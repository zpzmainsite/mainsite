var Mainmenu = function(){
	this.container = $('.main-menu');
	
	this.anon = '<div class="avatar"> \
		<img src="" class="avatar-image"> \
	    <button class="login modal-login-show md-trigger" data-modal="modal-login">登录</button> \
	</div> \
	<ul class="main-menu-buttons"> \
		<li class="separate"></li> \
	    <li><a href="#" class="main-menu-button message-center"><i class="disabled"></i>消息中心</a></li> \
	    <li><a href="#" class="main-menu-button my-project"><i class="disabled"></i>发布的项目</a></li> \
	    <li><a href="#" class="main-menu-button my-trends"><i class="disabled"></i>发布的动态</a></li> \
	    <li class="separate"></li> \
	    <li><a href="setAccount.html" class="main-menu-button account-setting"><i class="disabled"></i>账户设置</a></li> \
	    <li><a href="#" class="main-menu-button help-center"><i class="disabled"></i>帮助中心</a></li> \
		<li><a href="#" class="main-menu-button trigger-of-main-menu logout"><i class="disabled"></i>退出登录</a></li> \
		<li class="separate"></li> \
	</ul>';
	
	this.company = '<div class="avatar"> \
		<img src="" class="avatar-image"> \
	</div> \
	<ul class="main-menu-buttons"> \
		<li class="separate"></li> \
		<li><a href="#" class="main-menu-button message-center"><i class="enabled"></i>消息中心</a></li> \
	    <li><a href="#" class="main-menu-button my-project"><i class="enabled"></i>发布的项目</a></li> \
	    <li class="separate"></li> \
	    <li><a href="setAccount.html" class="main-menu-button account-setting"><i class="enabled"></i>账户设置</a></li> \
	    <li><a href="#" class="main-menu-button help-center"><i class="enabled"></i>帮助中心</a></li> \
		<li><a href="#" class="main-menu-button trigger-of-main-menu logout"><i class="enabled"></i>退出登录</a></li> \
		<li class="separate"></li> \
	</ul>';
	
	this.user = '<div class="avatar"> \
		<img src="" class="avatar-image"> \
	</div> \
	<ul class="main-menu-buttons"> \
		<li class="separate"></li> \
		<li><a href="#" class="main-menu-button message-center"><i class="enabled"></i>消息中心</a></li> \
	    <li><a href="#" class="main-menu-button my-project"><i class="enabled"></i>发布的项目</a></li> \
	    <li><a href="#" class="main-menu-button my-trends"><i class="enabled"></i>发布的动态</a></li> \
	    <li class="separate"></li> \
	    <li><a href="setAccount.html" class="main-menu-button account-setting"><i class="enabled"></i>账户设置</a></li> \
	    <li><a href="#" class="main-menu-button help-center"><i class="enabled"></i>帮助中心</a></li> \
		<li><a href="#" class="main-menu-button trigger-of-main-menu logout"><i class="enabled"></i>退出登录</a></li> \
		<li class="separate"></li> \
	</ul>';
	
	
	this.init = function(){
		var _this = this;
		
		var type = global.getUserType();
		
		if(type == 'Auth' || type == 'Personal'){
			this.container.html(this.user);
		} else if(type == 'Company'){
			this.container.html(this.company);
		} else {
			this.container.html(this.anon);
		}
		
		this.hide();
		this.container.find(".logout").click(function(){
			_this.doLoginOut();
		});
		
		this.container.find(".avatar-image").click(function(){
			if(global.isLogin()){
				var user = global.getUser();
				if(user.userType == 'Company'){
					location.href = 'companycenter.html';
				} else {
					location.href = 'personcenter.html';
				}
			}
		});
		
		this.container.find(".my-trends").click(function(){
			if(global.isLogin()){
				$.cookie("mytrends", true);
				location.href = 'dynamicInfo.html';
			}
		});
		
		this.container.find(".my-project").click(function(){
			if(global.isLogin()){
				location.href = 'myProject.html';
			}
		});
		
		this.container.find(".message-center").click(function(){
			if(global.isLogin()){
				alert("message");
			}
		});
		
	};
	
	this.init();
	
};

Mainmenu.prototype.doLogin = function(username, password){
	var _this = this;
	var url = "/account/login";
	var data = {};
//	data.cellPhone = username;
	data.username = username;
	data.password = $.md5_16(password);
//	data.password = password;
	data.deviceType = 'web';
	$.ajax({
		type : "post",
		url : global.serviceUrl + url,
		data : data,
		async : false,
		dataType : "json",
		success : function(msg) {
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				var user = msg.d.data[0];
				global.login(user);
	        } else {
	        	alert("用户名或密码错误，请重新输入。");
	        }
		}
	});
	_this.reload();
};
Mainmenu.prototype.doLoginOut = function(){
	var _this = this;
	var url = "/Account/LogOut";
	var user = global.getUser();
	
	if(user.userToken){
		var data = {};
		data.userId = user.userId;
		data.userToken = user.userToken;
		data.deviceType = 'web';
		
		$.ajax({
			type : "post",
			url : global.serviceUrl + url,
			data : data,
			async : false,
			dataType : "json",
			success : function(msg) {
				if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
					
		        }
			}
		});
		
		$.removeCookie("user");
		location.href = 'home.html';
	}
	
};

Mainmenu.prototype.hide = function(){
	var _this = this;
	_this.container.hide();
};

Mainmenu.prototype.refresh = function(){
	var _this = this;
	var user = global.getUser();
	if(global.isLogin()){
		//_this.container.find(".logout").show();
		//_this.container.find(".login").hide();
		_this.container.find(".avatar-image").attr("src", user.imageLocation);
    } else {
    	//_this.container.find(".login").show();
    	//_this.container.find(".logout").hide();
    	_this.container.find(".avatar-image").attr("src", "");
    }
};

Mainmenu.prototype.reload = function(){
	location.href = location.href;
};


var mainmenu = null;

(function MainMenuController () {
	mainmenu = new Mainmenu();
    this.$self = $('.main-menu');
    this.width = this.$self.width();
    this.$trigger = $('.trigger-of-main-menu');
    this.menu_x = $('.navicon-button.x');
    this.isOpen = false;
    this.speed = 400;
    this.limit = 105;
    var _this = this;

    this.toggle = function () {
        var _self = _this.$self;
        if (_this.isOpen) {
           _self.animate({ textIndent: _this.limit }, {
                step: function(now, fx) {
                    _self.css('transform', "translate3d(" + now + "%, 0, 0)");
                },
                duration: _this.speed
            }, 'easeOutExpo');
           _self.hide();
        } else {
        	_self.show();
            this.$self.css({
                'height': $('body').height() - $('.site-nav').height() - $('.header').height() - $('.footer').height(),
            });
           _self.animate({ textIndent: 0 }, {
                step: function(now, fx) {
                    _self.css('transform', "translate3d(" + now + "%, 0, 0)");
                },
                duration: _this.speed
            }, 'easeOutExpo');

        }
        _this.menu_x.toggleClass('open');
        _this.isOpen = !_this.isOpen;
        return false;
    };

    this.init = function () {
        this.$self.css({
            'transform': "translate3d(" + this.limit + "%, 0, 0)",
            'textIndent': this.limit
        });
        this.$trigger.on('click', function () { _this.toggle() });

        var _self = this.$self;
        mainmenu.refresh();
    };
    
    this.init();
})();