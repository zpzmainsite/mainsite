var Setting = function(){
	
	var init = function(){
		var url = '/UserInformation/GetSysUserConfig';
		var data = {userId : global.getUserId()};
		$.get(global.serviceUrl + url, data, function(msg) {
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				console.log(msg);
			}
		});
		
	}
	
	init();
}



$(function(){
	$(".btn.check-btn i.check").on('click',function(){
		$(this).toggleClass("checked");
	});
	
	new Setting();
});