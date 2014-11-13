global.scrollingLoader = {
	pageIndex: 0,
	pageSize: 12,
    identify: 0,
    keyWords:'',
    hasNext: true
};
$(function () {
    // load first page
	dataCardLoader();
	
    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() >= $('.data-panel').offset().top + $('.data-panel').height() ) { 

            if (global.scrollingLoader.identify >= $(window).scrollTop()-100 && global.scrollingLoader.identify <= $(window).scrollTop()+100 ) {

            } else {
            	if(global.scrollingLoader.hasNext){
            		global.scrollingLoader.identify = $(window).scrollTop();
                    global.scrollingLoader.pageIndex ++;
                    dataCardLoader();
            	}
            }
        }
    });
    
    $('#q').on('keydown', function (e) {
        if (e.keyCode == 13) {
        	do_person_search();
        }
    });
    
    $(".search-bar-button").click(function(){
    	do_person_search();
    });
    
    var do_person_search = function(){
    	$(".data-panel").html("");
    	var keyword = $('#q').val();
    	global.scrollingLoader = {
			pageIndex: 0,
			pageSize: 12,
		    identify: 0,
		    keyWords:keyword,
		    hasNext: true
		};
    	dataCardLoader();
    }
    
});

var dataCardLoader = function() {
	this.container = $(".data-panel");
	var makePersonCards = function(datas) {
		
		var _this = this;
		var card = function (data) {
            var el = $('<div class="person-card"> \
            				<div class="btn"><div class="off"></div></div> \
		            		<div class="person-head"> \
            					<img src="" /> \
			                </div> \
            				<p id="realName">&nbsp;</p> \
            				<p id="duties">&nbsp;</p> \
            				<p>&nbsp;</p> \
            				<p id="city">&nbsp;</p> \
                        </div>');
            el.find(".person-head img").attr("src", data.avatarUrl);
            el.find('#realName').text(data.userName);
            el.find('#duties').text(data.duties);
            el.find('#city').text(data.city);
            
            if(data.isFocused){
            	el.find('.btn div').attr("class",'on');
            }
            
            el.attr({'ref': data.userId});
            
            el.find('.btn').on('click', function () {
            	var userId = $(el).attr("ref");
            	var dest = $(this).find("div");
            	if(global.isLogin()){
            		if(dest.hasClass("on")){
            			cancelFocus(el, dest);
                	} else {
                		addFocus(el, dest);
                	}
            	}
                return false;
            });
            el.click(function(){
            	return false;
            })
            return el;
        };
        var cancelFocus = function(el, dest){
        	var data = {
				focusId : $(el).attr("ref"),
				UserId : global.getUserId()
			};
        	var url = '/networking/DeleteFocus';
        	$.post(global.serviceUrl + url, data, function(msg){
        		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
        			dest.attr("class", "off");
        		}
        	});
        };
        var addFocus = function(el, dest){
        	var url = '/networking/addUserFocus';
        	var userType = global.getUser() != 'Company'?'Personal':'Company';
        	var userId = $(el).attr("ref");
        	var data = {
				"userId" : global.getUserId(),
				"focusId" : userId,
				"FocusType" : "Personal",
				"UserType" : userType
			};
			$.post(global.serviceUrl + url, data, function(msg) {
				if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
					dest.attr("class", "on");
				}
			});
        };
        
        var rows = datas.data.length;
        
        if(rows < global.scrollingLoader.pageSize){
        	global.scrollingLoader.hasNext = false;
        } 
        
    	var pageCount = Math.round(datas.status.totalCount / global.scrollingLoader.pageSize);
        var pageRecordStartAt = global.scrollingLoader.pageIndex * global.scrollingLoader.pageSize + 1;
        var pageRecordEndAt = (global.scrollingLoader.pageIndex+1) * global.scrollingLoader.pageSize;
        pageRecordEndAt = pageRecordEndAt > datas.status.totalCount ? datas.status.totalCount : pageRecordEndAt;
        console.log( "第["+(global.scrollingLoader.pageIndex+1)+"]页，共["+pageCount+"]页，第["+pageRecordStartAt+"]-["+pageRecordEndAt+"]条，共["+datas.status.totalCount+"]条" );
        $(datas.data).each(function(i, j) {
        	_this.container.append(card(j));
        });
	};

	if(global.scrollingLoader.hasNext){
		var url = '/networking/search';
		console.log(global.serviceUrl + url);
		$.get(global.serviceUrl + url, global.scrollingLoader, function(msg) {
			if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
				makePersonCards(msg.d);
			}
		});
	}
};