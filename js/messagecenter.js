var MessageCenter = function(){
	var showData = function(data){
		var container = $(".content-right");
		$.each(data.data, function(i, j){
			var el = item(j);
			if(el != null){
				container.append(el);
			}
		});
	};
	
	var formatTime = function(time){
		var v = time.split('T');
	    return new Date(v[0]).Format('MM月dd日');
	};
	
	var item = function(row){
		var el = $('<div class="content-item"> \
			<div class="left"></div> \
			<img class="image" src=""/> \
			<div class="text"> \
				<div class="title"></div> \
				<div class="tips"></div> \
			</div> \
			<div class="right"> \
				<div class="time"></div> \
				<div class="del"></div> \
			</div> \
		</div>');
		var model = getModel(row);
		if(model != null){
			el.find(".title").text(model.title);
			el.find(".tips").text(model.tips);
			el.find(".time").text(model.time);
			if(model.image !== undefined && model.image != null){
				el.find(".image").attr("src", model.image);
			} else {
				el.find(".image").remove();
			}
			el.attr("ref", model.id);
			el.find(".del").click(function(){
				removeItem(el);
				return false;
			});
			return el;
		} else {
			return null;
		}
	};
	
	var removeItem = function(el){
		var id = el.attr("ref");
		var url = '/AcPersonalActiveCenter/DeletePersonalActives';
		var data = {id:id,DeletedBy:global.getUserId()};
		
		$.ajax({
			type : "post",
			url : global.serviceUrl + url,
			data : data,
			async : false,
			dataType : "json",
			success : function(msg) {
				console.log(msg);
				if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
					el.remove();
		        } 
			}
		});
	}
	
	
	var getModel = function(row){
		var category = row.category;
		if(category == 'Personal'){
			return {
				'id' : row.id,
				'title' : row.content,
				'tips' : '我发布的个人动态有新评论',
				'time' : formatTime(row.createdTime),
				'image' : row.imageLocation
			};
		} else if(category == 'Product'){
			return {
				'id' : row.id,
				'title' : row.content,
				'tips' : '我发布的产品有新评论',
				'time' : formatTime(row.createdTime),
				'image' : row.imageLocation
			};
		} else if (category == 'Project'){
			return {
				'id' : row.id,
				'title' : row.entityName,
				'tips' : '我发布的项目有新评论',
				'time' : formatTime(row.createdTime)
			};
		}
		return null;
	};
	
	var init = function(){
		var _this = this;
		var url = '/AcPersonalActiveCenter/PersonalActive';
		$.get(global.serviceUrl + url,{"UserId":global.getUserId()}, function (msg) {
    		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
    			showData(msg.d);
    		}
        });
	};
	
	
	
	init();
}





$(function(){
	$(".content-left .content-item").click(function(){
		console.log($(this).offset().top - 87);
	});
	
	
	new MessageCenter();
});




