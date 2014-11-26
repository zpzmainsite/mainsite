$("<input type='hidden' id='_temp_location'/>").val(location.href).appendTo($("body"));


if(global.getUserId()){
	
	console.log('authorization: [' + global.getUserId() + ':' + global.getToken() + ']');
	
	
	$.ajaxSetup({
	    headers: {
	        'Authorization': global.getUserId() + ':' + global.getToken()
	    }
	});
}

$.ajaxSetup({
	error : function(xhr, status, e) {
		if(xhr.status == 403){
			var msg = xhr.responseText;
			var xhrobj = eval("(" + msg + ")");
			var statusCode = xhrobj.d.status.statusCode;
			if(statusCode == 1318){
				$.removeCookie("user");
			}
		}
	},
	complete : function(){
		$('img.user-check-error').each(function(){
	        var error = false;
	        if (!this.complete) {
	            error = true;
	        }

	        if (typeof this.naturalWidth != "undefined" && this.naturalWidth == 0) {
	            error = true;
	        }

	        if(error){
	            $(this).bind('error.replaceSrc',function(){
	                this.src = "http://192.168.222.95:801/Pictures/CompanyImages/2e7f8c39-46d1-470e-b0a3-c4cb4461697c.png";
	                $(this).unbind('error.replaceSrc');
	            }).trigger('load');
	        }
	    });
	}
});

