
function getSpecificParking(ob){
	$("#parking_single_heading")[0].innerHTML = ob.CCMC;
	$('#parking_single_image')[0].setAttribute('src', ob.CCTP);
	var data = $('#parking_single_data')[0];
	data.innerHTML = "";//ui-first-child
	if(ob.YYKSSJ && ob.YYJSSJ){
		data.appendChild(createParkingNewData("Opening Time", ob.YYKSSJ + " - " +ob.YYJSSJ));
	}
	if(ob.CCDZ){data.appendChild(createParkingNewData("Address", ob.CCDZ));}
	if(ob.QYCS){data.appendChild(createParkingNewData("City", ob.QYCS));}
	if(ob.SFKF){data.appendChild(createParkingNewData("Status", ob.QYCS==0?"不开放":"开放"));}
	if(ob.KCW){data.appendChild(createParkingNewData("Empty Space", ob.KCW));}
	if(ob.ZCW){data.appendChild(createParkingNewData("Total Space", ob.ZCW));}
	if(ob.CCLX){data.appendChild(createParkingNewData("Parking Type", ob.CCLX==1?"平面自走式":ob.CCLX==2?"机械式":"立体自动车库"));}
	if(ob.CCFL){data.appendChild(createParkingNewData("Parking Type", ob.CCFL==1?"占道停车场":ob.CCFL==2?"路外露天停车场":ob.CCFL==3?"非露天地上停车场":"非露天地下停车场"));}
	if(ob.BTTCJG){data.appendChild(createParkingNewData("白天停车价格", ob.BTTCJG));}
	if(ob.WSTCJG){data.appendChild(createParkingNewData("晚上停车价格", ob.WSTCJG));}
	data.firstChild.setAttribute("class", "ui-li ui-li-static ui-btn-up-c ui-first-child");
}
//<li><p style="float:left;"><b>hehe</b></p><p style="float:left;">fsd</p></li>
function createParkingNewData(key, value){
	var para1 = document.createElement("p");
	var bold = document.createElement("b");
	bold.innerText = key+" : ";
	
	para1.appendChild(bold);
	para1.setAttribute("class", "ui-li-desc");
	para1.style.float = "left";
	
	var para2 = document.createElement("p");
	para2.style.float = "left";
	para2.setAttribute("class", "ui-li-desc");
	para2.innerText = value;
	var lis = document.createElement("li");
	lis.appendChild(para1);
	lis.appendChild(para2);
	lis.style.overflow = "hidden";
	lis.setAttribute("class", "ui-li ui-li-static ui-btn-up-c");
	return lis;
	
}
function getParkingAround(){
	$('#parking_options')[0].style.display = "none";
	$('#parking_home')[0].style.display = "none";
	$('#parking_back')[0].style.display = "block";
	$('#parking_heading')[0].innerText = "Looking Around";
	$('#parking_around_map')[0].style.display = "block";
	var distance = 2000;
	var url = "http://api2.juheapi.com/park/query?key=8e0bd249eb17749e082217d107f72b05&lx=1&skip=0&limit=20&wlyc=false&distance="+distance;
	getCurrentLatLng(true);
	
	/*
	var latlng;
	if(window.localStorage.getItem("latitude")){
		latlng = {"lat": window.localStorage.getItem("latitude"), "lng": window.localStorage.getItem("longitude")};
	}
	else{
		latlng = {"lat": 31.210485, "lng": 121.43101};
	}
	//*/
	var latlng = {"lat": 31.210485, "lng": 121.43101};
	url += "&lat="+latlng.lat+"&lon="+latlng.lng;
	var ob_map = new GMaps({
		el: '#parking_around_map',
		lat: latlng.lat,
		lng: latlng.lng,
		zoomControl: true,
		zoomControlOpt: {
			style: 'SMALL',
			position: 'TOP_LEFT'
		},
		panControl: false,
		streetViewControl: false,
		mapTypeControl: false,
		overviewMapControl: false
	});
	$('#parking_around_map')[0].style.height = window.innerHeight-100;
	$('#parking_around_map')[0].style.width = window.innerWidth;
	$.get(url, function(data) {
    	var results = data.result;
    	console.log("Total Around Data: " + data.total);
    	if(results){
    		for(result in results){
    			putInParkingMap(ob_map, results[result]);
    		}
    	}
	});
}
function searchParkingPlaces(){
	$('#parking_options')[0].style.display = "none";
	$('#parking_home')[0].style.display = "none";
	$('#parking_back')[0].style.display = "block";
	$('#parking_heading')[0].innerText = "Searching Around";
	$('#parking_around_map')[0].style.display = "block";
	var distance = 2000;
	var value= $('#parking_search_box')[0].value;
	if(!value){return;}
	var url = "http://api2.juheapi.com/park/query?key=8e0bd249eb17749e082217d107f72b05&lx=1&skip=0&limit=20&wlyc=false&kw="+value;
	/*
	var latlng;
	if(window.localStorage.getItem("latitude")){
		latlng = {"lat": window.localStorage.getItem("latitude"), "lng": window.localStorage.getItem("longitude")};
	}
	else{
		latlng = {"lat": 31.196550664378933, "lng": 121.60733329902534};
	} //*/
	var latlng = {"lat": 31.210485, "lng": 121.43101};
	console.log(url);
	var ob_map = new GMaps({
		el: '#parking_around_map',
		lat: latlng.lat,
		lng: latlng.lng,
		zoom: 5,
		zoomControl: true,
		zoomControlOpt: {
			style: 'SMALL',
			position: 'TOP_LEFT'
		},
		panControl: false,
		streetViewControl: false,
		mapTypeControl: false,
		overviewMapControl: false
	});
	$('#parking_around_map')[0].style.height = window.innerHeight-100;
	$('#parking_around_map')[0].style.width = window.innerWidth;
	$.get(url, function(data) {
    	var results = data.result;
    	console.log("Total Search Data: " +data.total);
    	if(results){
    		for(result in results){
    			putInParkingMap(ob_map, results[result]);
    		}
    	}
	});
}
function onCurrentLatLngSuccess(position){
	//window.localStorage.setItem("latitude", position.coords.latitude);
	window.localStorage.setItem("longitude", position.coords.longitude);
}
function onCurrentLatLngError(){
	
}
function getCurrentLatLng(isMob){
	if(isMob){
		navigator.geolocation.getCurrentPosition(onCurrentLatLngSuccess, onCurrentLatLngError);
	}else{
		GMaps.geolocate({success: onCurrentLatLngSuccess, error: onCurrentLatLngError});
	}
}
function putInParkingMap(map, ob){
	map.addMarker({
		lat: ob.LOC.lat,
		lng: ob.LOC.lon,
		title: ob.CCMC,
		click: function(event){getSpecificParking(ob);window.location.href = "#parking_single_view";}
	});
}
function showParkingTabs(){
	
}
function showParkingMain(){
	$('#parking_options')[0].style.display = "block";
	$('#parking_home')[0].style.display = "block";
	$('#parking_back')[0].style.display = "none";
	$('#parking_heading')[0].innerText = "在车上...";
	$('#parking_around_map')[0].innerHTML = "";
	$('#parking_around_map')[0].style.display = "none";
}
function searchFootball(){
	$("#football_search_error")[0].innerText = "";
	var text = $("#football_search").val();
	if(!text){
		$("#football_search_error")[0].innerText = "       Value missing.";
		return;
	}
	//openFootballLeague(2);
	//openFootballTeam(1);
	///*
	var radio = $("#football_league")[0];
	
	if(radio.checked){
		var url = "http://op.juhe.cn/onebox/football/league?key=0961263eed5588588e5a02ae41e61799&league="+text;
		checkFootballViews(url);
	}
	radio = $("#football_team")[0];
	if(radio.checked){
		url = "http://op.juhe.cn/onebox/football/team?key=0961263eed5588588e5a02ae41e61799&team="+text;
		checkFootballList(url);
	}
	//*/
	return false;
}
function checkFootballList(url){
	console.log(url);
	$.get(url, function(data){
		if(data.reason == "查询成功"){
			putFootballList(data.result);
		}
		else{
			$("#football_search_error")[0].innerText = "     Content not found.";
		}
	});
}
function checkFootballViews(url){
	console.log(url);
	$.get(url, function(data){
		if(data.reason == "查询成功"){
			putFootballViews(data.result);
		}else{
			$("#football_search_error")[0].innerText = "     Content not found.";
		}
	});
}
function putFootballViews(result){
	var div = $("#football_search_values")[0];
	div.innerHTML = "";
	for(i in result.tabs){
		alert("1");
		if(i.includes("saicheng") && result.tabs[i]){
			var h2 = document.createElement("h2");
			h2.innerText = result.tabs[i];
			alert("2");
			
			var ul = document.createElement("ul");
			ul.setAttribute("class", "ui-listview ui-listview-inset ui-corner-all ui-shadow");
			ul.setAttribute("data-role", "listview");
			ul.setAttribute("data-insert", "true");
			for(j in result.views[i]){
				if(j ==0){alert("3");}
				var item = result.views[i][j];
				if(item['c4T1'] && item['c4T2']){
				if(j ==0){alert("4");}
					var lis = document.createElement("li");
					lis.style.overflow = "hidden";
					lis.setAttribute("data-iconpos", "right");
					lis.setAttribute("data-wrapperels", "div");
					lis.setAttribute("data-iconshadow", "true");
					lis.setAttribute("data-shadow", "false");
					lis.setAttribute("data-corners", "false");
					lis.setAttribute("class", "ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-first-child ui-last-child ui-btn-up-c");
					lis.setAttribute("data-theme", "c");
					
					var divf = document.createElement("div");
					divf.setAttribute("class", "ui-btn-inner ui-li");
					
					
					var divs = document.createElement("div");
					divs.setAttribute("class", "ui-btn-text");
					
					var spanarr = document.createElement("span");
					spanarr.setAttribute("class", "ui-icon ui-icon-arrow-r ui-icon-shadow");
					spanarr.innerText = " ";
					
					var atag = document.createElement("a");
					atag.setAttribute("class", "ui-link-inherit");
					for(o in item){
						atag[o] = item[o];
					}
					atag.onclick = function(e){openFootballLeague(this);window.location.href = "#football_single_live";}
					
					
					var h2in = document.createElement("h2");
					h2in.setAttribute("h2", "ui-li-heading");
					h2in.innerText = item["c4T1"] + " VS " + item["c4T2"];
					
					var pin = document.createElement("p");
					pin.setAttribute("class", "ui-li-desc");
					pin.innerText = item["c2"] + " - " + item["c3"] + " : " + item["c4R"];
					
					atag.appendChild(h2in);
					atag.appendChild(pin);
					
					divs.appendChild(atag);
					
					divf.appendChild(divs);
					divf.appendChild(spanarr);
					
					lis.appendChild(divf);
					ul.appendChild(lis);
				}
			}
			if(ul.hasChildNodes()){
				alert("4");
				div.appendChild(h2);
				div.appendChild(ul);
			}
			
		}
	}
}
function putFootballList(result){
	var div = $("#football_search_values")[0];
	div.innerHTML = "";
	var h2 = document.createElement("h2");
	h2.innerText = result.key;
			
			
	var ul = document.createElement("ul");
	ul.setAttribute("class", "ui-listview ui-listview-inset ui-corner-all ui-shadow");
	ul.setAttribute("data-role", "listview");
	ul.setAttribute("data-insert", "true");
	if(result){
		alert("1");
		if(result.list){
			alert("2");
			for(j in result.list){
				if(j ==0){alert("3");}
				var item = result.list[j];
				if(item['c4T1'] && item['c4T2']){
				if(j ==0){alert("4");}
					var lis = document.createElement("li");
					lis.style.overflow = "hidden";
					lis.setAttribute("data-iconpos", "right");
					lis.setAttribute("data-wrapperels", "div");
					lis.setAttribute("data-iconshadow", "true");
					lis.setAttribute("data-shadow", "false");
					lis.setAttribute("data-corners", "false");
					lis.setAttribute("class", "ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-first-child ui-last-child ui-btn-up-c");
					lis.setAttribute("data-theme", "c");
					
					var divf = document.createElement("div");
					divf.setAttribute("class", "ui-btn-inner ui-li");
					
					
					var divs = document.createElement("div");
					divs.setAttribute("class", "ui-btn-text");
					
					var spanarr = document.createElement("span");
					spanarr.setAttribute("class", "ui-icon ui-icon-arrow-r ui-icon-shadow");
					spanarr.innerText = " ";
					
					var atag = document.createElement("a");
					atag.addAttribute("class", "ui-link-inherit");
					for(o in item){
						atag[o] = item[o];
					}
					atag.onclick = function(d){openFootballTeam(this);window.location.href="#football_single_live";}
					
					
					var h2in = document.createElement("h2");
					h2in.setAttribute("h2", "ui-li-heading");
					h2in.innerText = item["c1"] + "| " + item["c4T1"] + " VS " + item["c4T2"];
					
					var pin = document.createElement("p");
					pin.setAttribute("class", "ui-li-desc");
					pin.innerHTML = item["c2"] + " - " + item["c3"] + " : <b>" + item["c4R"] + "</b>";
					
					atag.appendChild(h2in);
					atag.appendChild(pin);
					
					divs.appendChild(atag);
					
					divf.appendChild(divs);
					divf.appendChild(spanarr);
					
					lis.appendChild(divf);
					ul.appendChild(lis);
					alert(j+" dfs");
				}
			}
			if(ul.hasChildNodes()){
				alert("here");
				div.appendChild(h2);
				div.appendChild(ul);
			}
		}
	}
}
function openFootballLeague(item){
	alert("haa");
	console.log(item);
	//item = {"c1": "未开赛","c2": "12-06周六","c3": "03:30","c4R": "VS","c4T1": "图卢兹","c4T1URL": "http://match.sports.sina.com.cn/football/team.php?id=486","c4T2": "摩纳哥","c4T2URL": "http://match.sports.sina.com.cn/football/team.php?id=317","c51": "视频暂无","c51Link": "http:\/\/sports.sina.com.cn\/g\/laliga\/2015-05-03\/02497595119.shtml","c52": "图文直播","c52Link": "http://match.sports.sina.com.cn/livecast/g/live.php?id=111967"};
	$("#football_single_live_heading")[0].innerHTML = item.c1;
	$("#football_single_team1_name")[0].innerHTML = item.c4T1;
	$("#football_single_team2_name")[0].innerHTML = item.c4T2;
	if(item.c4T1URL){
		$("#football_single_team1_img")[0].setAttribute("src", "http://www.sinaimg.cn/lf/sports/logo85/"+item.c4T1URL.split("id=")[1] + ".png");
	}
	if(item.c4T2URL){
		$("#football_single_team2_img")[0].setAttribute("src", "http://www.sinaimg.cn/lf/sports/logo85/"+item.c4T2URL.split("id=")[1] + ".png");
	}
	$("#football_single_score")[0].innerHTML = item.c4R;
	$("#football_single_date")[0].innerHTML = item.c2;
	$("#football_single_time")[0].innerHTML = item.c3;
	if(item.c51 && item.c51Link.includes(".shtml")){
		$("#football_single_live_url")[0].valueUrl = item.c51Link;
		$("#football_single_live_url")[0].innerHTML = item.c51;
		$("#football_single_live_url")[0].onclick = function(e){openFootballLiveIframe(e.target);}
	}else if(item.c52 && item.c52Link.includes(".shtml")){
		$("#football_single_live_url")[0].innerHTML = item.c52;
		$("#football_single_live_url")[0].valueUrl = item.c52Link;
		$("#football_single_live_url")[0].onclick = function(e){openFootballLiveIframe(e.target);}
		
	}else if(item.c53 && item.c53Link.includes(".shtml")){
		$("#football_single_live_url")[0].valueUrl = item.c53Link;
		$("#football_single_live_url")[0].innerHTML = item.c53;
		$("#football_single_live_url")[0].onclick = function(e){openFootballLiveIframe(e.target);}
	}else if(item.c54 && item.c54Link.includes(".shtml")){
		$("#football_single_live_url")[0].valueUrl = item.c54Link;
		$("#football_single_live_url")[0].innerHTML = item.c54;
		$("#football_single_live_url")[0].onclick = function(e){openFootballLiveIframe(e.target);}
	}else{
		
	}
}
function openFootballTeam(item){
	//item = {"c1":"西甲","c2":"05-03","c3":"02:00","c4R":"2-3","c4T1":"塞维利亚","c4T1URL":"http:\/\/match.sports.sina.com.cn\/football\/team.php?id=166","c4T2":"皇家马德里","c4T2URL":"http:\/\/match.sports.sina.com.cn\/football\/team.php?id=157","c51":"","c52":"视频集锦","c52Link":"http://sports.sina.com.cn/g/ucl/2014-11-27/04347425813.shtml","c53":"全场战报","c53Link":"http:\/\/sports.sina.com.cn\/g\/laliga\/2015-05-03\/02497595119.shtml","c54":"","c54Link":""};
	$("#football_single_live_heading")[0].innerHTML = item.c1;
	$("#football_single_team1_name")[0].innerHTML = item.c4T1;
	$("#football_single_team2_name")[0].innerHTML = item.c4T2;
	if(item.c4T1URL){
		$("#football_single_team1_img")[0].setAttribute("src", "http://www.sinaimg.cn/lf/sports/logo85/"+item.c4T1URL.split("id=")[1] + ".png");
	}
	if(item.c4T2URL){
		$("#football_single_team2_img")[0].setAttribute("src", "http://www.sinaimg.cn/lf/sports/logo85/"+item.c4T2URL.split("id=")[1] + ".png");
	}
	$("#football_single_score")[0].innerHTML = item.c4R;
	$("#football_single_date")[0].innerHTML = item.c2;
	$("#football_single_time")[0].innerHTML = item.c3;
	if(item.c51 && item.c51Link.includes(".shtml")){
		$("#football_single_live_url")[0].valueUrl = item.c51Link;
		$("#football_single_live_url")[0].innerHTML = item.c51;
		$("#football_single_live_url")[0].onclick = function(e){openFootballLiveIframe(e.target);}
	}else if(item.c52 && item.c52Link.includes(".shtml")){
		$("#football_single_live_url")[0].innerHTML = item.c52;
		$("#football_single_live_url")[0].valueUrl = item.c52Link;
		$("#football_single_live_url")[0].onclick = function(e){openFootballLiveIframe(e.target);}
		
	}else if(item.c53 && item.c53Link.includes(".shtml")){
		$("#football_single_live_url")[0].valueUrl = item.c53Link;
		$("#football_single_live_url")[0].innerHTML = item.c53;
		$("#football_single_live_url")[0].onclick = function(e){openFootballLiveIframe(e.target);}
	}else if(item.c54 && item.c54Link.includes(".shtml")){
		$("#football_single_live_url")[0].valueUrl = item.c54Link;
		$("#football_single_live_url")[0].innerHTML = item.c54;
		$("#football_single_live_url")[0].onclick = function(e){openFootballLiveIframe(e.target);}
	}
	$("#football_single_live")[0].addEventListener("pagebeforechange", function(){alert("ffds");
		$("#football_single_item_iframe")[0].innerHTML = "";
	});
	
}
function openFootballLiveIframe(item){
	$("#football_single_item_iframe")[0].innerHTML =""; 
	$("#football_single_item_iframe")[0].setAttribute("src", item.valueUrl);
	window.location.href = "#football_single_live_iframe";
}
function closeFootballIframe(){
	$("#football_single_item_iframe")[0].setAttribute("src", "");
}
//haha