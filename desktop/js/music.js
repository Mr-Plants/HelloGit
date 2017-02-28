var musicTimer=null,
	now=null,
	nowPlayId=0,  //记录正在播放的歌曲id
	loopState="loop",
	loopCode=0,
	loopArr=["loop","order","random"],
	playlist=[],
	musicJs=null, //用来接收歌曲的jsonp
	num=0;
var songData=[
	{
		id:0,
		title:"情非得已-庾澄庆",
		src:"music/情非得已.mp3"
	},
	{
		id:1,
		title:"你的背包-陈奕迅",
		src:"music/你的背包.mp3"
	}
]
player.volume=0.8; //设置默认音量
//播放暂停
$(".control .play").on("click",function(){
	if(player.paused){
		tools.playFlash();
		tools.findList(nowPlayId);
	}else{
		player.pause();
		clearInterval(musicTimer);
		$(".control .play").css("backgroundImage","url(img/play.jpg)");
		$(".diskpic").css("animationPlayState","paused");
		$(".headpic").css("transform","rotate(-80deg)");
	}
	
})
//静音
$(".icon").on("click",function(){
	var oriVoice=player.volume;
	if(!player.muted){ 
		this.style.backgroundImage="url(img/novoi.png)";
		$(".curVoice").css("width",0);
		$(".voiBut").css("left",-5);
	}else{
		this.style.backgroundImage="url(img/voice.png)";
		$(".curVoice").css("width",oriVoice*100);
		$(".voiBut").css("left",oriVoice*100-5);
	}
	player.muted=!player.muted;
})
//下一首
$(".next").on("click",function(){
	if(loopState==="loop"){
		loopState="order";
		tools.loopType();
		loopState="loop";
		return;
	}
	tools.loopType();
})
//上一首
$(".prev").on("click",function(){
	player.src=songData[nowPlayId].src;
	player.play();
	tools.findList(nowPlayId);
})
//拖动调整进度
$(".cirBut").on("mousedown",function(e){
	var disX=e.clientX-this.offsetLeft;
	clearInterval(musicTimer);
	document.onmousemove=function(e){
		var wid=e.clientX-disX;
		wid=wid<-5?-5:wid;
		wid=wid>395?395:wid;
		now=(wid+5)/400*player.duration;
		$(".cirBut").css("left",wid);
		$(".bar .run").css("width",wid+5);
		$(".progBar .now").text(tools.transTime(now));
		e.preventDefault();
	}
	document.onmouseup=function(){
		player.currentTime=now;
		if(!player.paused){ //暂停时不开启
			tools.current();
		}
		document.onmousemove=null;
		document.onmouseup=null;
	}
})
//点击进度条控制进度
$(".bar").on("click",function(e){
	clearInterval(musicTimer);
	var left=this.getBoundingClientRect().left;
	var timeRange=e.clientX-left;
	timeRange=timeRange<0?0:timeRange;
	timeRange=timeRange>400?400:timeRange;
	$(".bar .run").css("width",timeRange);
	$(".bar .cirBut").css("left",timeRange-5);
	now=(timeRange)/400*player.duration;
	player.currentTime=now;
	$(".progBar .now").text(tools.transTime(now));
	tools.current();
})
//点击调整音量
$(".volProgbar").on("click",function(e){
	var left=this.getBoundingClientRect().left;
	var voiceRange=e.clientX-left;
	voiceRange=voiceRange<0?0:voiceRange;
	voiceRange=voiceRange>100?100:voiceRange;
	$(".curVoice").css("width",voiceRange);
	$(".voiBut").css("left",voiceRange-5);
	if(player.muted){
		player.muted=!player.muted;
	}
	player.volume=(voiceRange)/100;
	if(voiceRange===0){ //点击零点切换图标
		$(".icon").css("backgroundImage","url(img/novoi.png)");
	}else{
		$(".icon").css("backgroundImage","url(img/voice.png)");
	}
})

//拖动调整音量
$(".voiBut").on("mousedown",function(e){
	var disX=e.clientX-this.offsetLeft;
	document.onmousemove=function(e){
		var voiceRange=e.clientX-disX;
		voiceRange=voiceRange<-5?-5:voiceRange;
		voiceRange=voiceRange>95?95:voiceRange;
		if(player.muted){
			player.muted=!player.muted;
		}
		player.volume=(voiceRange+5)/100;
		$(".voiBut").css("left",voiceRange);
		$(".curVoice").css("width",voiceRange+5);
		if(voiceRange===-5){ //滑动到零点切换图标
			$(".icon").css("backgroundImage","url(img/novoi.png)");
		}else{
			$(".icon").css("backgroundImage","url(img/voice.png)");
		}
		e.preventDefault();
	}
	document.onmouseup=function(){
		document.onmousemove=null;
		document.onmouseup=null;
	}
})
//双击菜单选歌
$(".song").on("dblclick","li",function(e){
	$(".song li").removeClass("active");
	$(this).addClass("active");
	player.src=this.dataset.src;
	tools.playFlash();
	e.preventDefault();
})
$(".loop").on("click",function(e){
	loopCode++;
	loopCode%=3;
	player.loop=loopCode===0?true:false;
	loopState=loopArr[loopCode];
	$(this).css("backgroundImage","url(img/"+loopState+".png)");
})
tools.createList(songData);
player.ondurationchange=function(){  //切换歌曲时duration改变
	$(".progBar .all").text(tools.transTime(player.duration));
	playlist.push(nowPlayId);
	console.log(playlist);
}

//搜索歌曲
$("#musicSearch").on("keyup",function(e){
	if(e.keyCode===13){
		if(this.value.trim()===""){
			return
		}
		$(".disk").hide();
		$(".songlist").show();
		ask();
	}
})
//关闭搜索歌曲菜单
$(".songlist .closeSearchList").on("click",function(){
	$(".disk").show();
	$(".songlist").hide();
})
var lisJs=null;
//点击试听
$(".songlist").on("dblclick","li",function(){
	listen(this.dataset.id);
})
//查找歌曲播放地址
function listen(val){
	lisJs=document.createElement("script");
	lisJs.src="http://music.baidu.com/data/music/links?&format=json&callback=listening&songIds="+val;
	document.body.appendChild(lisJs);
}
//访问歌曲库
function ask(){
	console.log(musicSearch.value);
	musicJs=document.createElement("script");
	musicJs.src="http://tingapi.ting.baidu.com/v1/restserver/ting?from=qianqian&version=2.1.0&method=baidu.ting.search.common&format=json&callback=result&query="+musicSearch.value+"&page_no=1&page_size=10";
	document.body.appendChild(musicJs);
}
function result(data){
	var str='';
	$(".tipsCount").text("搜索"+musicSearch.value+"，找到"+data.pages.total+"首单曲");
	for (var i = 0; i < data.song_list.length; i++) {
		mv=data.song_list[i].has_mv===0?"未找到MV":"有MV";
		data.song_list[i].album_title=data.song_list[i].album_title===""?"未找到专辑":data.song_list[i].album_title;
		str+="<li data-id="+data.song_list[i].song_id+"><span>"+data.song_list[i].author+"</span><span>"+data.song_list[i].title+"</span><span>"+data.song_list[i].album_title+"</span><span>"+mv+"</span><span>标准品质</span></li>";
	}
	$(".songInfo").html(str);
	document.body.removeChild(musicJs);
}
//试听加载
function listening(data){
	var links=data.data.songList[0];
	songData.push({
		id:links.songId,
		title:links.songName,
		src:links.songLink
	})
	createList(songData);
	player.src=links.songLink;
	playFlash();
	$(".song li").removeClass("active");
	$(".song li:last").addClass("active");
}

tools.maxIndex($("#music")[0]);

$(".music").on("click",function(){
	$("#music").toggle();
	$("#music")[0].style.zIndex=++max;
	tools.drag($("#music header")[0],$("#music")[0]);
})
$("#music .close").on("click",function(){
	player.pause();
	clearInterval(musicTimer);
	$(".control .play").css("backgroundImage","url(img/play.jpg)");
	$(".diskpic").css("animationPlayState","paused");
	$(".headpic").css("transform","rotate(-80deg)");
	$("#music").hide();
})
$("#music .hide").on("click",function(){
	$("#music").hide();
})