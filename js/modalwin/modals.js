var login_function = {};
login_function.to_changepass = function(){
	var container = $("#modal-changepass");
	var oldpassword = container.find(".oldpassword").val();
	var password = container.find(".password").val();
	var repassword = container.find(".repassword").val();
	if(oldpassword == ''){
		alert("请输入当前密码");
		return false;
	}
	if(password == ''){
		alert("请输入新密码");
		return false;
	}
	if(password != repassword){
		alert("两次输入的密码不相同，请重新输入。");
		return false;
	}
	
	var oldpassword = $.md5_16(oldpassword);
	var password = $.md5_16(password);
	var data = {
		userId : global.getUserId(),
		password : password,
		oldPassword : oldpassword
	};
	var url = '/account/ChangePassword';
	var flag = false;
	$.ajax({
		type : "post",
		url : global.serviceUrl + url,
		data : data,
		async : false,
		dataType : "json",
		success : function(msg) {
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				alert("密码修改成功。");
				flag = true;
	        } else {
	        	alert("当前密码错误，修改密码失败。");
	        }
		}
	});
	return flag;
};
login_function.forgetpass = function(){
	
	return true;
}



var modals = {
    'login': '<div class="md-modal md-effect-3 form-login from-dropdown" id="modal-login"> \
            <div class="md-content"> \
                <h3>登&nbsp;录</h3> \
                <div> \
                    <fieldset class="fieldset-username margin-bottom-30"> \
                        <label>用户名</label> \
                        <input type="text" maxlength="11" class="login-input username"> \
                    </fieldset> \
                    <fieldset class="fieldset-password"> \
                        <label>密码</label> \
                        <input type="password" class="login-input password"> \
                    </fieldset> \
                    <div class="login-function"> \
                        <div class="remember-me-input"> \
                            <input type="checkbox" class="remember-me" name="remember-me"> \
                        </div> \
                        <label for="remember-me" class="remember-me-label">记住我</label> \
                        <a class="md-close forget-password-label md-trigger" data-modal="modal-forgetpass" href="###"><i></i>密码找回</a> \
                    </div> \
                </div> \
                <button class="md-close sign-up md-trigger button button-rounded button-flat-caution" data-modal="modal-signup">注&nbsp;册</button> \
                <button class="do-login button button-rounded button-flat-action">登&nbsp;录</button> \
            </div> \
        </div> ',
    'forgetpass' : '<div class="md-modal md-effect-2 form-forgetpass from-dropdown" id="modal-forgetpass"> \
	        <div class="md-content"> \
		        <h3>密码找回</h3> \
		        <div> \
		            <fieldset class="fieldset-username margin-bottom-30"> \
		                <label>通过绑定的手机号帮助您找回密码</label> \
		                <input type="text" maxlength="11" class="forget-input username" placeholder="请输入注册的手机号" /> \
		            </fieldset> \
			    	<fieldset class="fieldset-barcode margin-bottom-10"> \
				        <label>验证码</label> \
				        <input type="text" class="forget-input-half barcode" placeholder="请输入验证码" /> \
				        <div class="button button-rounded button-flat-action do-resend-barcode">获取验证码</div> \
				    </fieldset> \
		        </div> \
    			<span class="forget-tips">公司账户请联系客服</span> \
		        <button class="md-close do-resetpass md-trigger button button-rounded button-flat-action" data-modal="modal-resetpass" before="login_function.forgetpass">下一步</button> \
	    	</div> \
		</div>',
	'resetpass' : '<div class="md-modal md-effect-4 form-resetpass from-dropdown" id="modal-resetpass"> \
	        <div class="md-content"> \
	        <h3>密码重置</h3> \
	        <div> \
	            <fieldset class="fieldset-username margin-bottom-30"> \
	                <label>修改密码</label> \
	                <input type="password" class="reset-input password" placeholder="请输入新密码"/> \
	            </fieldset> \
	            <fieldset class="fieldset-password"> \
	                <label>重复密码</label> \
	                <input type="password" class="reset-input repassword" placeholder="请再次输入新密码"/> \
	            </fieldset> \
	        </div> \
		<button class="md-close do-relogin md-trigger button button-rounded button-flat-action" data-modal="modal-login">确定</button> \
	    </div> \
	</div>',
	'changepass' : '<div class="md-modal md-effect-4 form-changepass from-dropdown" id="modal-changepass"> \
	        <div class="md-content"> \
	        <h3>修改密码</h3> \
	        <div> \
				<fieldset class="fieldset-username margin-bottom-30"> \
			        <label>当前密码</label> \
			        <input type="password" class="change-input oldpassword" placeholder="请输入当前密码"/> \
			    </fieldset> \
	            <fieldset class="fieldset-username margin-bottom-30"> \
	                <label>新密码</label> \
	                <input type="password" class="change-input password" placeholder="请输入新密码"/> \
	            </fieldset> \
	            <fieldset class="fieldset-password"> \
	                <label>重复密码</label> \
	                <input type="password" class="change-input repassword" placeholder="请再次输入新密码"/> \
	            </fieldset> \
	        </div> \
		<button class="md-close do-changepass md-trigger button button-rounded button-flat-action" before="login_function.to_changepass">确定</button> \
	    </div> \
	</div>',
    'signup': '<div class="md-modal md-effect-1 form-signup from-dropdown" id="modal-signup"> \
            <div class="md-content"> \
                <h3>注&nbsp;册</h3> \
                <div> \
                    <fieldset class="fieldset-cellphone margin-bottom-10"> \
                        <label>手机号</label> \
                        <input type="text" class="login-input cellphone"> \
                    </fieldset> \
                    <fieldset class="fieldset-barcode margin-bottom-10"> \
                        <label>手机验证</label> \
                        <input type="text" class="login-input-half barcode"> \
                        <div class="button button-rounded button-flat-action do-resend-barcode">获取验证码</div> \
                    </fieldset> \
                    <fieldset class="fieldset-username margin-bottom-10"> \
                        <label>用户名</label> \
                        <input type="text" class="login-input username"> \
                    </fieldset> \
                    <fieldset class="fieldset-password margin-bottom-10"> \
                        <label>密码</label> \
                        <input type="password" class="login-input-half password"> \
                    </fieldset> \
                    <fieldset class="fieldset-confirm-password"> \
                        <label>重复密码</label> \
                        <input type="password" class="login-input-half confirm-password"> \
                    </fieldset> \
                    <div class="signup-function"> \
                        <div class="agreement-input"> \
                            <input checked="checked" type="checkbox" class="agreement" name="agreement" id="_register_agree"> \
                        </div> \
                        <label for="_register_agree" class="agreement-label">我已经阅读并同意条款</label> \
                    </div> \
                </div> \
                <button class="md-close md-trigger do-cancel button button-rounded button-flat">取&nbsp;消</button> \
                <button class="do-signup-next button button-rounded button-flat-caution">下一步</button> \
            </div> \
        </div>',
    'overlay': '<div class="md-overlay"></div>',
    'use': function () {
        var modalWrapper = $('.modals');
        if (modalWrapper.length == 0) return;

        for (var i=0; i<arguments.length; i++) {
            modalWrapper.append( this[ arguments[i] ] );
        }
        modalWrapper.append(this.overlay);

        // init icheck
        $('input').iCheck({
            checkboxClass: 'icheckbox_polaris',
            radioClass: 'iradio_polaris',
            increaseArea: '-10%' // optional
        });
        
        $(".do-login.button").click(function(){
        	var username = $(".login-input.username").val();
        	var password = $(".login-input.password").val();
			mainmenu.doLogin(username, password);
			return false;
        });
        
        $("input[name='agreement']").on('ifChecked', function(event){
        	$("#modal-signup").find(".do-signup-next.button").removeClass("disabled");
		});
        
        $("input[name='agreement']").on('ifUnchecked', function(event){
        	$("#modal-signup").find(".do-signup-next.button").addClass("disabled");
        });
        
        $("#modal-signup").find(".do-signup-next.button").click(function(){
        	if($(this).hasClass("disabled")){
        		
        	} else {
        		var _dialog = $("#modal-signup");
            	var pass1 = _dialog.find(".login-input-half.password").val();
            	var pass2 = _dialog.find(".login-input-half.confirm-password").val();
            	if(pass1 == pass2 && pass1 != ""){
            		modals.doregister();
            	} else {
            		alert("两次输入的密码不同，请重新确认。");
            	}
        	}
        	return false;
        });
        
        
        $("#modal-signup").find('.do-resend-barcode.button').click(function(){
        	var cellphone = $("#modal-signup").find(".cellphone").val();
        	if(cellphone == ''){
        		alert('请填写手机号');
        		return false;
        	} else {
        		var validate = modals.checkexists(null, cellphone);
        		if(validate){
        			alert("验证码已发，请注意查收。");
        		} else {
        			alert("该手机号已被注册");
        		}
        	}
        	return false;
        });
        $("#modal-signup").find(".login-input.username").blur(function(){
        	var username = $(this).val();
        	if(username != ""){
        		var validate = modals.checkexists(username, null);
        		if(validate){
        			
        		} else {
        			alert("该用户名已存在");
        		}
        	}
        });
    },
    'checkexists' : function(userName, cellphone){
    	var url = '/account/IsExist';
    	var data = {};
    	if(userName != null){
    		data.userName = userName;
    	}
    	if(cellphone != null){
    		data.cellphone = cellphone;
    	}
    	var validate = false;
    	$.ajax({
    		type : "get",
    		url : global.serviceUrl + url,
    		data : data,
    		async : false,
    		dataType : "json",
    		success : function(msg) {
    			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
    				validate =  true;
    	        } else {
    	        	validate = false;
    	        }
    		}
    	});
    	return validate;
    },
    "doregister" : function (){
    	var _dialog = $("#modal-signup");
    	var cellPhone = _dialog.find(".login-input.cellphone").val();
    	var userName = _dialog.find(".login-input.username").val();
    	var pass = _dialog.find(".login-input-half.password").val();
    	var password = $.md5_16(pass);
    	var barCode = _dialog.find(".login-input-half.barcode").val();
    	var deviceType = 'web';
    	var data = {
    			cellPhone : cellPhone,
    			userName : userName,
    			password : password,
    			barCode : barCode,
    			deviceType : deviceType
    	};
		var url = '/account/register2';
    	$.ajax({
    		type : "post",
    		url : global.serviceUrl + url,
    		data : data,
    		async : false,
    		dataType : "json",
    		success : function(msg) {
    			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
    				global.login(msg.d.data[0]);
    				location.href = location.href;
    	        } else {
    	        	alert("账号已存在");
    	        }
    		}
    	});
    },
    "close" : function(){
    	$("#modal-login input").val("");
    	$("#modal-signup input").val("");
    	$("#modal-forgetpass input").val("");
    	$("#modal-changepass input").val("");
    	$("input[name='agreement']").iCheck('check');
    }
};


