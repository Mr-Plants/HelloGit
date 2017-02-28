$(".dock a").hover(function(){
	$(this).next().show();
},function(){
	$(this).next().hide();
})
var bgData=localStorage.getItem("bg");
if(bgData){
	$("body").css("backgroundImage",bgData);
}
//-----------时钟------------
tools.setTime();
setInterval(function(){
	tools.setTime();
},1000)
var max=99; //全局最高层级
var memoList=[
	{
		id:1,
		top:200,
		left:100,
		content:"添加你的便签"
	}
]
//-------------------便签-----------------------
function Memo(defaults){
	this.defaults=defaults;
	this.init();
	tools.drag(this.head,this.memo);
	tools.maxIndex(this.memo);
	this.memo.style.zIndex=++max;
	this.fake.focus();
}

Memo.prototype={
	constructor:Memo,
	init:function(){
		this.memo=this.creatHtml();
		$("body").append(this.memo);
		this.head=$(this.memo).find(".top")[0];
		this.fake=$(this.memo).find(".fake")[0];
		$(this.memo).find(".close")[0].onclick=this.closeFn.bind(this);
		$(this.memo).find(".add")[0].onclick=tools.addMemo;
		this.head.onmouseup=this.changePosition.bind(this);
		this.fake.onkeyup=this.changeCont.bind(this);
		this.fake.onmouseup=this.changeCont.bind(this);
	},
	creatHtml:function(){
		var div=document.createElement("div");
		div.className="memo";
		div.style.left=this.defaults.left+"px";
		div.style.top=this.defaults.top+"px";
		div.setAttribute("data-id",this.defaults.id);
		div.innerHTML='<div class="top"><span class="add">✚</span><span class="close">✖</span></div><div class="fake" contenteditable="true">'+this.defaults.content+'</div>'
		return div;
	},
	closeFn:function(){
		tools.delData(this.defaults.id);
		$(this.memo).remove();
	},
	changePosition:function(){
		tools.changeData(this.defaults.id,{
			left:this.memo.offsetLeft,
			top:this.memo.offsetTop
		})
	},
	changeCont:function(){
		tools.changeData(this.defaults.id,{
			content:this.fake.innerHTML
		})
	}
}
var memoData=localStorage.getItem("memo");
if(memoData){
	memoList=JSON.parse(memoData);
}
memoList.forEach(function(item){
	new Memo(item);
})

//点击图标添加便签
$(".note").on("click",function(){
	tools.addMemo();
})

//-------------------待办事项-------------------------
var list;
var todoData=localStorage.getItem("todo");
if(todoData){
	list=JSON.parse(todoData);
}else{
	list=[
		{
			content:"吃饭睡觉打豆豆",
			isChecked:false,
			show:true,
			Date:"2017-1-15"
		},
		{
			content:"下午三点去开会",
			isChecked:true,
			show:true,
			Date:"2017-1-17"
		}
	]
}

new Vue({
	el:"#todos",
	data:{
		list:list,
		checkAll:false,
		inner:"",
		editItem:"",
		origCont:"",
		now:"all"
	},
	methods:{
		changeCheck:function(item){
			item.isChecked=!item.isChecked;
			item.show=this.now==='active'?!item.isChecked:item.isChecked;
			this.checkAll=this.list.every(function(item){
				return item.isChecked;
			})
		},
		deleteList:function(item){
			var index=this.list.indexOf(item);
			this.list.splice(index,1);
			this.checkAll=this.list.every(function(item){
				return item.isChecked;
			})
		},
		allCheck:function(){
			var onoff=this.checkAll=!this.checkAll;
			this.list.forEach(function(item){
				item.isChecked=onoff;
			})
		},
		addTodo:function(){
			var show=this.now==="done"?false:true;
			if(this.inner.trim()){
				var n=new Date();
				this.list.push({
					content:this.inner,
					isChecked:false,
					show:show,
					Date:n.getFullYear()+"-"+(n.getMonth()+1)+"-"+(n.getDate())
				})
				this.inner="";
				this.checkAll=false;
			}
		},
		edit:function(item){
			this.editItem=item;
			this.origCont=item.content;
		},
		finishEdit:function(item){
			if(item.content.trim()===""){
				this.deleteList(item);
			}
			this.editItem="";
		},
		cancel:function(item){
			item.content=this.origCont;
			this.editItem="";
			this.origCont="";
		},
		remove:function(){
			this.list=this.list.filter(function(item){
				return !item.isChecked;
			})
		},
		active:function(){
			this.now="active";
			this.list.forEach(function(item){
				if(item.isChecked){
					item.show=false;
				}else{
					item.show=true;
				}
			})
		},
		all:function(){
			this.now="all";
		},
		done:function(){
			this.now="done";
			this.list.forEach(function(item){
				if(item.isChecked){
					item.show=true;
				}else{
					item.show=false;
				}
			})
		}
	},
	computed:{
		unCheckLen:function(){
			var checkArr=this.list.filter(function(item){
				return !item.isChecked
			})
			return checkArr.length;
		},
		checkLen:function(){
			return this.list.length-this.unCheckLen;
		}
	},
	directives:{ //自定义指令
		focus:{
			update:function(el,binding){
				if(binding.value){
					el.focus();
				}
			}
		}
	},
	watch:{
		list:{
			handler:function (){
				localStorage.setItem("todo",JSON.stringify(this.list));	
			},
			deep:true
		}
	}
})
tools.maxIndex($("#todos")[0]);
$(".todos").on("click",function(){
	$("#todos").toggle();
	$("#todos")[0].style.zIndex=++max;
	tools.drag($("#todos h3")[0],$("#todos")[0]);
})
$("#todos .hide").on("click",function(){
	$("#todos").hide();
})

//------------设置-------------
tools.maxIndex($("#setting")[0]);
tools.drag($("#setting .head")[0],$("#setting")[0]);
$(".setting").on("click",function(){
	$(".getTouch").hide();
	$("#setting").toggle();
	$("#setting")[0].style.zIndex=++max;	
})
$("#setting .close").on("click",function(){
	$("#setting").hide();
	$(".getTouch").hide();
})
$(".clearStorage").on("click",function(){ //清空存储
	localStorage.clear();
	$(".memo").remove();
	new Memo({
		id:1,
		top:200,
		left:100,
		content:"添加你的便签"
	});
	tools.setTip("本地存储已清空");
})
$(".update").on("click",function(){
	tools.setTip("已是最新版本");
})
$(".changePaper").on("click",function(){
	tools.setTip("请选择壁纸");
	$("#changePaper").show();
	$("#changePaper")[0].style.zIndex=++max;
})
$(".about").on("click",function(){
	$("#about").toggle();
	$("#about")[0].style.zIndex=++max;
})
$(".author").on("click",function(){
	$(".getTouch").toggle();
})
//--------------百度搜索-----------------
var searchJs=null; //搜索建议的jsonp
var lisNum=-1;
tools.maxIndex($("#search")[0]);
tools.drag($("#search h3")[0],$("#search")[0]);
$("#search input").focus(function(){
	$("#search .mirrow").css("opacity",1);
})
$("#search input").blur(function(){
	$("#search .mirrow").css("opacity",0);
})
//输入时显示建议
$("#search input").on("input",function(){
	var value=this.value;
	if(value.trim()===""){
		$(".tipWord").hide();
	}else{
		$(".tipWord").show();
		tools.searchWord(value);
		document.body.removeChild(searchJs);
	}
})
//输入框回车搜索
$("#search input").on("keyup",function(e){
	if(e.keyCode===13&&this.value.trim()!==""){
		tools.searching(this.value);
		lisNum=-1;
	}
})
//点击搜索按钮搜索
$("#search .mirrow").on("click",function(){
	if($("#search input").val().trim()!==""){
		tools.searching($("#search input").val());
	}
})
//点击推荐结果搜索
$("#search .tipWord").on("click","li",function(){
	tools.searching($(this).html());
})
//上下键控制
document.onkeyup=function(e){
	if(e.keyCode===40){ //下
		lisNum++;
		lisNum%=$("#search .tipWord li").length;
		$("#search .tipWord li").removeClass("active")
		$("#search .tipWord li").eq(lisNum).addClass("active");
		$("#search input").val($("#search .tipWord li").eq(lisNum).html())
	}
	if(e.keyCode===38){ //上
		lisNum--;
		lisNum=lisNum<-1?$("#search .tipWord li").length-1:lisNum;
		$("#search .tipWord li").removeClass("active")
		$("#search .tipWord li").eq(lisNum).addClass("active");
		$("#search input").val($("#search .tipWord li").eq(lisNum).html())
	}
}
function baidu(data){
	var str="";
	for (var i = 0; i < data.s.length; i++) {
		str+="<li>"+data.s[i]+"</li>";
	}
	$("#search .tipWord").html(str);
}
//----------常用链接-------------
$(".tips").on("mouseenter",function(){
	$("#Tools")[0].style.zIndex=++max;
	$("#Tools").css("left",0);
	$(".tips").css("opacity",0);
})
$("#Tools").on("mouseleave",function(){
	$(this).css("left",-200);
	$(".tips").css("opacity",1);
})
$("#links").on("click","li",function(){
	window.open(this.dataset.href);
})

//-------------更换壁纸-----------------
$("#changePaper .close").on("click",function(){
	$("#changePaper").hide();
})
$("#changePaper .paper").on("click","img",function(){
	$("body").css("backgroundImage","url("+this.dataset.src+")");
	localStorage.setItem("bg","url("+this.dataset.src+")");
})
tools.drag($("#changePaper h3")[0],$("#changePaper")[0]);
tools.maxIndex($("#changePaper")[0]);

//---------------天气----------------
tools.drag($("#weather .head")[0],$("#weather")[0]);
tools.maxIndex($("#weather")[0]);
$("#weather .close").on("click",detial);
$(".weather").on("click",detial);
function detial(){
	$("#weather .detial").toggle();
	$("#weather .future").toggle();
}
var cnDay=new Date().getDay();
var query={"count":1,"created":"2017-02-26T09:00:01Z","lang":"zh-CN","results":{"channel":{"units":{"distance":"mi","pressure":"in","speed":"mph","temperature":"F"},"title":"Yahoo! Weather - Beijing, Beijing, CN","link":"http://us.rd.yahoo.com/dailynews/rss/weather/Country__Country/*https://weather.yahoo.com/country/state/city-2151330/","description":"Yahoo! Weather for Beijing, Beijing, CN","language":"en-us","lastBuildDate":"Sun, 26 Feb 2017 05:00 PM CST","ttl":"60","location":{"city":"Beijing","country":"China","region":" Beijing"},"wind":{"chill":"54","direction":"200","speed":"14"},"atmosphere":{"humidity":"20","pressure":"1018.0","rising":"0","visibility":"16.1"},"astronomy":{"sunrise":"6:52 am","sunset":"6:3 pm"},"image":{"title":"Yahoo! Weather","width":"142","height":"18","link":"http://weather.yahoo.com","url":"http://l.yimg.com/a/i/brand/purplelogo//uh/us/news-wea.gif"},"item":{"title":"Conditions for Beijing, Beijing, CN at 04:00 PM CST","lat":"39.90601","long":"116.387909","link":"http://us.rd.yahoo.com/dailynews/rss/weather/Country__Country/*https://weather.yahoo.com/country/state/city-2151330/","pubDate":"Sun, 26 Feb 2017 04:00 PM CST","condition":{"code":"34","date":"Sun, 26 Feb 2017 04:00 PM CST","temp":"56","text":"Mostly Sunny"},"forecast":[{"code":"32","date":"26 Feb 2017","day":"Sun","high":"54","low":"30","text":"Sunny"},{"code":"32","date":"27 Feb 2017","day":"Mon","high":"58","low":"30","text":"Sunny"},{"code":"30","date":"28 Feb 2017","day":"Tue","high":"59","low":"35","text":"Partly Cloudy"},{"code":"34","date":"01 Mar 2017","day":"Wed","high":"49","low":"34","text":"Mostly Sunny"},{"code":"32","date":"02 Mar 2017","day":"Thu","high":"55","low":"28","text":"Sunny"},{"code":"34","date":"03 Mar 2017","day":"Fri","high":"57","low":"31","text":"Mostly Sunny"},{"code":"34","date":"04 Mar 2017","day":"Sat","high":"54","low":"32","text":"Mostly Sunny"},{"code":"30","date":"05 Mar 2017","day":"Sun","high":"53","low":"33","text":"Partly Cloudy"},{"code":"34","date":"06 Mar 2017","day":"Mon","high":"51","low":"32","text":"Mostly Sunny"},{"code":"34","date":"07 Mar 2017","day":"Tue","high":"50","low":"31","text":"Mostly Sunny"}],"description":"<![CDATA[<img src=\"http://l.yimg.com/a/i/us/we/52/34.gif\"/>\n<BR />\n<b>Current Conditions:</b>\n<BR />Mostly Sunny\n<BR />\n<BR />\n<b>Forecast:</b>\n<BR /> Sun - Sunny. High: 54Low: 30\n<BR /> Mon - Sunny. High: 58Low: 30\n<BR /> Tue - Partly Cloudy. High: 59Low: 35\n<BR /> Wed - Mostly Sunny. High: 49Low: 34\n<BR /> Thu - Sunny. High: 55Low: 28\n<BR />\n<BR />\n<a href=\"http://us.rd.yahoo.com/dailynews/rss/weather/Country__Country/*https://weather.yahoo.com/country/state/city-2151330/\">Full Forecast at Yahoo! Weather</a>\n<BR />\n<BR />\n(provided by <a href=\"http://www.weather.com\" >The Weather Channel</a>)\n<BR />\n]]>","guid":{"isPermaLink":"false"}}}}};
$.ajax({
	url:"http://query.yahooapis.com/v1/public/yql?q=select+*+from+weather.forecast+where+woeid+in+(select+woeid+from+geo.places(1)+where+text%3D%22BeiJing%2CChina%22)&format=json&randomT=1487820484882",
	success:function(data){
		var data=data.query.results.channel;
		localStorage.setItem("weather",JSON.stringify(data));
		var code=Number(data.item.condition.code);		
		renderWeather(data,code);
	},
	error:function(){
		console.log("请求失败了");
		var wea=localStorage.getItem("weather");
		var data;
		if(wea){
			data=JSON.parse(wea);
		}else{
			data=query.results.channel;
		}
		var code=Number(data.item.condition.code);
		renderWeather(data,code);
	}
	
})
//渲染天气数据
function renderWeather(data,code){
	$("#weather .date").text("北京 |"+" "+tools.getCnDay(cnDay));
	$("#weather .pic").css("backgroundImage","url(weatherPic/"+tools.cnInfo(code)+".png)");
	$("#weather .text").text(tools.code2char(code));
	$("#weather .now").text(tools.f2c(data.item.condition.temp)+"°");
	$("#weather .min").text(tools.f2c(data.item.forecast[0].low)+"°<");
	$("#weather .max").text("<"+tools.f2c(data.item.forecast[0].high)+"°");
	$(".humidity .data").text(data.atmosphere.humidity+"%");
	$(".windSpeed .data").text(data.wind.speed+"m/s");
	$(".pressure .data").text(parseInt(data.atmosphere.pressure)+"hpa");
	for (var i = 1; i < 5; i++){
		$(".future li .futureDate").eq(i-1).text(tools.getCnDay(cnDay+i));
		$(".future li img").eq(i-1).attr("src","weatherPic/"+tools.cnInfo(Number(data.item.forecast[i].code))+".png");
		$(".future li .futureTemp").eq(i-1).text(tools.f2c(data.item.forecast[i].low)+"~"+tools.f2c(data.item.forecast[i].high));
	}
}

//--------------about-------------
tools.drag($("#about .head")[0],$("#about")[0]);
tools.maxIndex($("#about")[0]);
$("#about .close").on("click",function(){
	$("#about").hide();
});
