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
	}
});

