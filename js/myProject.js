global.scrollingLoader = {
    index: 0,
    pageSize: 12,
    identify: 0,
    q: global.QueryString.q
};

$(function () {

    // load first page
    projectCardLoader(global.scrollingLoader);

//    $(window).scroll(function () {
//        if ($(window).scrollTop() + $(window).height() >= 
//            $('.content').offset().top + $('.content').height() ) { 
//
//            if ( global.scrollingLoader.identify >= $(window).scrollTop()-100 && global.scrollingLoader.identify <= $(window).scrollTop()+100 ) {
//
//            } else {
//                global.scrollingLoader.identify = $(window).scrollTop();
//
//                global.scrollingLoader.index ++;
//                projectCardLoader(global.scrollingLoader);
//            }
//        }
//    });

//    $('#q').on('keydown', function (e) {
//        if (e.keyCode == 13) {
//            console.log($(this).val());
//            location.href="?q=" + $(this).val();
//            $(this).select();
//        }
//    }).on('click', function () {
//        $(this).select();
//    }).focus().val(decodeURIComponent(global.QueryString.q || ''));

});

var projectCardLoader = function (opt) {

    var makeProjectCards = function (datas) {
        var dataToDate = function (data) {
            if (!data) return "";
            var date = new Date(data);
            return date.getFullYear() + '-' + (date.getMonth()*1+1) + '-' + date.getDate();
        }
        var card = function (data) {
            var el = $('<dd class="porject-card"> \
                            <div class="fakemap" id="map"> \
                                <img src="images/fakemap.png" /> \
                            </div> \
                            <p class="gray" id="projectName"></p> \
                            <p class="" id="projectProgress"> \
                                <img src="images/projectCardSection1.png" id="projectSection" /> \
                            </p> \
                            <p class="" id="mapicon"></p> \
                            <p class="blue" id="investment-title">投资额</p> \
                            <p class="gray" id="investment"></p> \
                            <p class="blue" id="areaOfStructure-title">建筑面积</p> \
                            <p class="gray" id="areaOfStructure"></p> \
                            <p class="gray" id="expectedStartTime"></p> \
                            <p class="orange" id="expectedFinishTime"></p> \
                            <div class="mappoint" id=""></div> \
                            <p class="blue" id="district"></p> \
                            <p class="gray" id="province_city"></p> \
                            <div class="focus"><div class="off"></div></div> \
                        </dd>');
            el.find('#projectName').text(
                data.projectName ?
                ( data.projectName.length < 10 ? data.projectName : (data.projectName.substring(0, 9) + '...') ) : ''
            );
            el.find('#province_city').text(
                data.landAddress ?
                ( data.landAddress.length < 10 ? data.landAddress : (data.landAddress.substring(0, 9) + '...') ) : ''
            );
            el.find('#district').text(
                data.landProvince ?
                ( data.landProvince.length < 5 ? data.landProvince : (data.landProvince.substring(0, 4) + '...') ) + ' - ' : ''
            );

            el.find('#investment').text('￥' + (data.investment || "").toLocaleString());
            el.find('#areaOfStructure').text((data.landArea || "").toLocaleString() + '㎡');
            el.find('#expectedStartTime').text(dataToDate(data.expectedStartTime));
            el.find('#expectedFinishTime').text(dataToDate(data.expectedFinishTime));

            el.attr({'ref': data.id});
            
            if(data.isFocused){
            	el.find(".focus div").attr("class", "on");
            }
            
            el.on('click', function () {
                var surl = 'projectView.html?projectId=' + $(this).attr('ref');
                location.href = surl;
            });
            el.find('.focus div').on('click', function () {
            	if(global.isLogin()){
            		var dest = $(this);
                	if(dest.hasClass("on")){
                		cancelFocus(el, dest);
                	} else {
                		addFocus(el, dest);
                	}
            	}
                return false;
            });
            return el;
        };
        
        var cancelFocus = function(el, dest){
        	var url = '/Projects/DeleteFocusProjects';
        	var projectId = $(el).attr('ref');
    		$.post(global.serviceUrl + url, {"userId":global.getUserId(),"DeletedBy":global.getUserId(),"projectId":projectId}, function(msg){
        		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
        			dest.attr("class", "off");
        		}
        	});
        };
        
        var addFocus = function(el, dest){
        	var projectId = $(el).attr('ref');
        	var url = '/Projects/AddProjectFocus';
        	$.post(global.serviceUrl + url, {"UserId":global.getUserId(),"ProjectId":projectId}, function(msg){
        		if (msg && msg.d && msg.d.status && msg.d.status.statusCode == global.status.success) {
        			dest.attr("class", "on");
        		}
        	});
        };

        var pageCount = Math.round(datas.status.totalCount / global.scrollingLoader.pageSize);
        var pageRecordStartAt = global.scrollingLoader.index * global.scrollingLoader.pageSize + 1;
        var pageRecordEndAt = (global.scrollingLoader.index+1) * global.scrollingLoader.pageSize;
        pageRecordEndAt = pageRecordEndAt > datas.status.totalCount ? datas.status.totalCount : pageRecordEndAt;
        console.log( "第["+(global.scrollingLoader.index+1)+"]页，共["+pageCount+"]页，\
第["+pageRecordStartAt+"]-["+pageRecordEndAt+"]条，共["+datas.status.totalCount+"]条" );
        
        // $('.content dl dd').remove();
        $(datas.data).each(function () {
            $('.content dl').append(card(this));
        });
        
        $('.endOfPage').show();
    }

    var url = '/Projects/MyProjects?userId=' + global.getUserId();

    console.log(global.serviceUrl + url);

    $.get(global.serviceUrl + url, function (msg) {
        makeProjectCards(msg.d);
    });

};
