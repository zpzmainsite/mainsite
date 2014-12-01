var AdvanceSearch = function(){
	
	this.init = function(){
		var container = $(".condition-data");
		var _this = this;
		var url = '/Projects/SearchConditions';
		container.html("");
		$.get(global.serviceUrl + url, function(msg) {
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				var data = msg.d.data;
				if(data.length > 0){
					$.each(data, function(i, j){
						container.append(_this.convert(j));
					});
				}
			}
		});
	};
	
	this.convert = function(data){
		var _this = this;
		var getCondition = function(data){
			var result = new Array();
			var a = data.split(",");
			$.each(a,function(i, j){
				if(j != ''){
					var b = j.split("+");
					$.each(b,function(k, l){
						if(l != ''){
							result.push(l);
						}
					});
				}
			});
			return result;
		};
		
		var delCondition = function(el){
			var url = '/Projects/DeleteSearchConditions';
			var id = el.attr("ref");
			var data = {"id":id};
			$.post(global.serviceUrl + url, data, function(msg) {
				if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
					el.remove();
				}
			});
		}
			
		var el = $('<div class="item"> \
        		<div class="searchName"></div> \
        		<div class="searchConditions"> \
        		</div> \
				<div class="del_opt"><span class="del_icon"></span></div> \
				<div class="space"></div> \
        	</div>');
		el.attr("ref", data.id);
		el.data("condition", data.searchConditions);
		el.find(".searchName").text(data.searchName);
		var condition = getCondition(data.searchConditions);
		var c = el.find(".searchConditions");
		$.each(condition,function(k, l){
			c.append("<span>" + l + "</span>");
			if(k < condition.length - 1){
				c.append("+");
			}
		});
		el.click(function(){
			_this.doSearch(el.data("condition"));
			return false;
		});
		el.find(".del_opt").click(function(){
			delCondition(el);
			return false;
		});
		
		return el;
	};
	
	this.init();
	
	
};
AdvanceSearch.prototype.searchData = function(data){
	var _this = this;
	alert(data);
};


AdvanceSearch.prototype.doSearch = function(data){
	var _this = this;

	var searchData = function(data) {
		var result = {};
		var obj = data.split(",");
		var tmp = obj[0];
		if(tmp != ''){
			result.keywords = tmp;
		}
		tmp = obj[1];
		if(tmp != ''){
			result.ProjectCompany = tmp;
		}
		tmp = obj[4];
		if(tmp != ''){
			var stages = tmp.split("+");
			result.ProjectStage = stages.join(",");
		}
		tmp = obj[5];
		if(tmp != ''){
			var categorys = tmp.split("+");
			result.ProjectCategory = categorys.join(",");
		}
		return result;
	}
	var result = searchData(data);
	
	

	$.removeCookie("myproject");
	$.cookie("advance", JSON.stringify(result));
	location.href = 'allProjects.html';
};

AdvanceSearch.prototype.getCondition = function(){
	var _this = this;
	if(_this.validate()){
		var keywords = $("#q").val();
		var projectCompany = '';//相关公司
		var landDistrict = '';//区域
		var landProvince = '';//省份
		var projectStage = new Array();//项目阶段
		var stages = $("#ProjectStage").multiselect('getChecked');
		$.each(stages,function(i,j){
			projectStage.push(j.value);
		});
		var projectCategory = new Array();//项目类别
		var categorys = $("#ProjectCategory").multiselect('getChecked');
		$.each(categorys,function(i,j){
			projectCategory.push(j.value);
		});
		
		var conditions = new Array();
		conditions.push(keywords);
		conditions.push(projectCompany);
		
		conditions.push(landDistrict);
		conditions.push(landProvince);
		
		conditions.push(projectStage.join("+"));
		conditions.push(projectCategory.join("+"));
		
		var searchConditions = conditions.join(",");
		return searchConditions;
	} else {
		return null;
	}
};
AdvanceSearch.prototype.validate = function(){
	var flag = true;
	var keywords = $("#q").val();
	if(keywords == ''){
		flag = false;
		alert("请填写搜索关键词");
	}
	return flag;
};
AdvanceSearch.prototype.refresh = function(){
	var _this = this;
	_this.init();
};
AdvanceSearch.prototype.clear = function(){
	var _this = this;
	$("#q").val("");
	$("#condition-name").val("");
	$("#ProjectStage").multiselect('uncheckAll');
	$("#ProjectCategory").multiselect('uncheckAll');
};

$(function(){
	
	var ProjectStageList = ['土地信息阶段','主体设计阶段','主体施工阶段','装修阶段'];
	var ProjectCategoryList = ['工业','酒店及餐饮','商务办公','住宅/经济适用房','公用事业设施（教育、医疗、科研、基础建设等）','其他'];

	$.each(ProjectStageList,function(i, j){
		var opt = $('<option />', {
			value: j,
			text: j
		});
		opt.appendTo( $("#ProjectStage") );
	});
	
	$.each(ProjectCategoryList,function(i, j){
		var opt = $('<option />', {
			value: j,
			text: j
		});
		opt.appendTo( $("#ProjectCategory") );
	});
	
	$("#ProjectStage").multiselect({
		header: false,
		noneSelectedText : '请选择',
		selectedText: function(numChecked, numTotal, checkedItems){
			var items = new Array();
			$.each(checkedItems,function(i,j){
				items.push(j.value);
			});
			if(items.length > 0){
				return items.join("+");
			} else {
				return "请选择";
			}
	   }
	});
	
	$("#ProjectCategory").multiselect({
		header: false,
		noneSelectedText : '请选择',
		selectedText: function(numChecked, numTotal, checkedItems){
			var items = new Array();
			$.each(checkedItems,function(i,j){
				items.push(j.value);
			});
			if(items.length > 0){
				return items.join("+");
			} else {
				return "请选择";
			}
	   }
	});
	
	var advance = new AdvanceSearch();
	
	$(".save-bar-button").click(function(){
		if(global.isLogin()){
			var searchConditions = advance.getCondition();
			if(searchConditions != null){
				var searchName = $("#condition-name").val();
				if(searchName != ''){
					var url = '/Projects/SearchCondition';
					var data = {
						"searchName" : searchName,
						"searchConditions" : searchConditions,
						"createBy" : global.getUserId()
					};
					$.post(global.serviceUrl + url, data, function(msg) {
						if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
							advance.refresh();
							alert("保存成功");
							advance.clear();
						}
					});
				} else {
					alert("请填写搜索名称");
				}
			}
		} else {
			global.remindLogin();
		}
	});
	
	$(".search-bar-button").click(function(){
		var searchConditions = advance.getCondition();
		if(searchConditions != null){
			advance.doSearch(searchConditions);
		}
		
	});
	
	
});