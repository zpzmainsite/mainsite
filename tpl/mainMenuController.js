var Mainmenu = function(){
	this.container = $('.main-menu');
	
	this.tpl = '<div class="avatar"> \
		<img src="" class="avatar-image"> \
	    <button class="login modal-login-show md-trigger" data-modal="modal-login">登录</button> \
	    <button class="logout">登出</button> \
	</div> \
	<ul class="main-menu-buttons"> \
	    <li><a href="#" class="main-menu-button">通知中心</a></li> \
	    <li><a href="#" class="main-menu-button">通知中心</a></li> \
	    <li><a href="#" class="main-menu-button">通知中心</a></li> \
	    <li class="separate"></li> \
	    <li><a href="setAccount.html" class="main-menu-button">账户设置</a></li> \
	    <li><a href="#" class="main-menu-button">通知中心</a></li> \
	    <li><a href="#" class="main-menu-button trigger-of-main-menu">关闭</a></li> \
	</ul>';
	
	this.init = function(){
		var _this = this;
		this.container.html(this.tpl);
		this.hide();
		this.container.find(".logout").click(function(){
			_this.doLoginOut();
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
				global.login(msg.d.data[0]);
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
	}
	_this.reload();
};

Mainmenu.prototype.hide = function(){
	var _this = this;
	_this.container.hide();
};

Mainmenu.prototype.refresh = function(){
	var _this = this;
	var user = global.getUser();
	if(user.userToken){
		_this.container.find(".logout").show();
		_this.container.find(".login").hide();
		
		var url = "/account/UserImages?userId=" + user.userId;
		$.get(global.serviceUrl + url, function (msg) {
            if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
                var data = msg.d.data;
                
                var head = global.server + data.imageLocation;
                _this.container.find(".avatar-image").attr("src", head);
            }
        });
		
		
    } else {
    	_this.container.find(".login").show();
    	_this.container.find(".logout").hide();
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