var tmp = { obj: {} };

var readMultipleFiles = function (evt) {
    //Retrieve all the files from the FileList object
    var files = evt.target.files; 
    		
    if (files) {
        for (var i = 0; i < files.length; i++) {
        	if (files[i].type != 'image/jpeg') {
		        var pop = new PopingView();
		        pop.show({ text: files[i].name+" 文件类型错误，请上传JPG格式的文件！", parent: '.wrapper', view: "errorView", timeout: 4000, css: {top: '60px'} });
        		continue;
        	}
        	if (files[i].size > 200000) {
		        var pop = new PopingView();
		        pop.show({ text: files[i].name+" 文件过大，请上传200K以内的文件！", parent: '.wrapper', view: "errorView", timeout: 4000, css: {top: '60px'} });
        		continue;
        	}
            (function (i) {
                var reader = new FileReader();
                reader.onload = function (event) {
                    tmp.obj = {
                        "imgContent": event.target.result,
                        "file": files[i]
                    };
                    trends.image = tmp.obj;
                };
                reader.readAsDataURL(files[i]);
            })(i);
        }
    } else {
		console.log("Failed to load files"); 
    }
};

var trends = {
	image : null,
	sendActives : function(opt){
		var content = $(".message-content").val();
		var category = $("div[class='trends_tab active']").attr('tag');
		var data = {
			"EntityID"	: global.getUserId(),
			"Category" : category,
			"ActiveText" : content
		};
		if(trends.image != null){
			data.PictureStrings = trends.image.imgContent.replace('data:image/jpeg;base64,','');
			data.ActivePicture = trends.image.file.name;
		}
		if(content != ''){
			if(global.isLogin()){
				trends.postData(data);
			}
		}
	},
	postData : function(data){
		var url = "/ActiveCenter/SendActives";
		$.ajax({
			type : "post",
			url : global.serviceUrl + url,
			data : data,
			dataType : "json",
			success : function(msg) {
				if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
		            alert("cheng gong");
		        }
			}
		});
	}
};


$(function(){
	$('.attach').hover(function () {
        $(this).find('.cmps').addClass('cmps-hover');
    }, function () {
        $(this).find('.cmps').removeClass('cmps-hover');
    }).on('click', function () {
		var trigger = $(this).find('input:file')[0];
		trigger.addEventListener('change', readMultipleFiles, false);
        trigger.click();
    });
});