global.mainMenuReDirection = {};
global.mainMenuReDirection.orga = function () {
	var target = 'organization.html';
	if(global.isLogin()){
		var user = global.getUser();
		if(user.userType == 'Personal'){
			if(user.hasCompany){
				target = 'a.html';
			} 
		} else {
			target = 'company.html';
		}
	}
	location.href = target;
}

global.mainMenuDef01 = {
	$wrapper: $(".menu.main-nav"),
	items: [
		new Menuitem({model:{text:"首页", href:"home.html"}}),
		new Menuitem({model:{text:"项目", href:""},
					  sub: new Menu({
						at: "bottom",
						items: [
							new Menuitem({model:{text:"全部项目", href:"allProjects.html"}}),
							new Menuitem({model:{text:"项目专题", href:"seminars.html"}}),
							new Menuitem({model:{text:"创建项目", href:"project.html"}})
						]
					  })
		}),
		new Menuitem({model:{text:"人脉", href:""},
					  sub: new Menu({
						at: "bottom",
						items: [
							new Menuitem({model:{text:"通讯录", href:""}}),
							new Menuitem({model:{text:"关注的动态", href:"dynamicInfo.html"}}),
							new Menuitem({model:{text:"拓展人脉", href:"persons.html"}})
						]
					  })
		}),
		new Menuitem({model:{text:"组织", href:"javascript:global.mainMenuReDirection.orga()"} }),
		new Menuitem({model:{text:"交易", href:"allProducts.html"} })
	]
};
