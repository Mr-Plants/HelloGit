;(function(){
	var tools={
		setTime:function(){
			var now=new Date(),
			h=tools.addZero(now.getHours()),
			m=tools.addZero(now.getMinutes()),
			s=tools.addZero(now.getSeconds()),
			y=now.getFullYear(),
			u=tools.addZero(now.getMonth()+1),
			d=tools.addZero(now.getDate()),
			D=now.getDay();
			str='<span class="hours">'+h+':'+m+'</span><span class="second">'+s+'</span><span class="year">'+y+'-'+u+'-'+d+' '+tools.getCnDay(D)+'</span>';
			$("#time").html(str);
		},
		//转译星期
		getCnDay:function(n){
			var dayArr=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
			return dayArr[n];
		},
		addZero:function(n){
			return n<10?"0"+n:""+n;
		},
		drag:function(target,move){
			var width=document.documentElement.clientWidth-move.offsetWidth;
			var height=document.documentElement.clientHeight-move.offsetHeight;
			target.onmousedown=function(e){
				var disX=e.clientX-move.offsetLeft;
				var disY=e.clientY-move.offsetTop;
				document.onmousemove=function(e){
					var x=e.clientX-disX;
					var y=e.clientY-disY;
					if(x<0) x=0;
					if(y<0) y=0;
					if(x>width) x=width;
					if(y>height) y=height;
					move.style.left=x+"px";
					move.style.top=y+"px";
					e.preventDefault();
				};
				document.onmouseup=function(){
					document.onmousemove=null;
					document.onmouseup=null;
				}
				
			}
		},
		//使选中标签层级最高
		maxIndex:function(ele){
			ele.addEventListener("mousedown",function(){
				this.style.zIndex=++max;
			})
		},
		//根据传入id找到数据，并修改数据
		changeData:function(id,obj){
			for (var i = 0; i < memoList.length; i++) {
				if(memoList[i].id===id){
					for(var attr in obj){
						memoList[i][attr]=obj[attr];
					}
					localStorage.setItem("memo",JSON.stringify(memoList));
				}
			}
		},
		delData:function(id){ //删除便签数据
			for (var i = 0; i < memoList.length; i++) {
				if(memoList[i].id===id){
					memoList.splice(i,1);
					localStorage.setItem("memo",JSON.stringify(memoList));
				}
			}
		},
		addMemo:function(){ //添加一条便签
			var obj={
				id:parseInt(Math.random()*1000),
				top:parseInt(Math.random()*100+200),
				left:parseInt(Math.random()*1000+300),
				content:""
			}
			new Memo(obj);
			memoList.push(obj);
			localStorage.setItem("memo",JSON.stringify(memoList));
		},
		//根据传入的参数来设置进度条的显示情况
		changeBar:function(time,allTime){ 
			var x=time/allTime;
			$(".bar .run").css("width",x*400);
			$(".bar .cirBut").css("left",x*400-5);
		},
		//将时间转格式输出
		transTime:function(time){
			var minutes=tools.addZero(parseInt(time/60));
			var second=tools.addZero(parseInt(time%60));
			var str=minutes+':'+second;
			return str;
		},
		//播放时自动改变进度条和播放时间
		current:function(){ 
			musicTimer=setInterval(function(){
				$(".progBar .now").text(tools.transTime(player.currentTime));
				tools.changeBar(player.currentTime,player.duration);
				if(player.ended){
					tools.loopType();
				}
			},500)
		},
		//生成歌曲列表
		createList:function(data){
			var str="";
			data.forEach(function(item){
				str+="<li data-src="+item.src+" data-id="+item.id+">"+item.title+"</li>"
			})
			$(".song").html(str);
		},
		//根据播放类型切换歌曲
		loopType:function(){
			if(loopState==="loop"){
				player.loop=true;
			}
			if(loopState==="order"){ //列表顺序播放
				player.loop=false;
				nowPlayId++;
				nowPlayId%=songData.length;
				player.src=songData[nowPlayId].src;
			}
			if(loopState==="random"){ //列表随机播放
				player.loop=false;
				nowPlayId=parseInt(Math.random()*100);
				nowPlayId%=songData.length;
				player.src=songData[nowPlayId].src;
			}
			tools.playFlash();
			tools.findList(nowPlayId);
		},
		playFlash:function(){ //任何途径播放要做的动画
			player.play();
			tools.current();
			$(".control .play").css("backgroundImage","url(img/pause.jpg)");
			$(".diskpic").css("animationPlayState","running");
			$(".headpic").css("transform","rotate(-55deg)");
		},
		//根据传入的id给歌单加class
		findList:function(id){
			var lis=$(".song")[0].getElementsByTagName("li");
			for (var i = 0; i < lis.length; i++){
				if(lis[i].dataset.id==id){
					$(".song li").removeClass("active");
					$(lis[i]).addClass("active");
				}
			}
		},
		//搜索建议
		searchWord:function(value){
			searchJs=document.createElement("script");
			searchJs.src="http://suggestion.baidu.com/su?wd="+value+"&p=3&t=1487780367384&cb=baidu";
			document.body.appendChild(searchJs);
		},
		searching:function(val){
			window.open("https://www.baidu.com/baidu?&wd="+val);
		},
		//设置界面弹窗
		setTip:function(str){
			$(".tipsBox").text(str);
			$(".tipsBox").css("opacity",1);
			setTimeout(function(){
				$(".tipsBox").css("opacity",0);
			},600)
		},
		//华氏转摄氏
		f2c:function(n){
			return parseInt(5/9*(n-32)); 
		},
		cnInfo:function(code){
			if(code>=31&&code<=34){ //晴
				return 'B';
			}
			if(code>=3&&code<=12||code>=37&&code<=40||code===35||code===45||code===47||code===18||code===17){ //雨
				return 'R';
			}
			if(code>=20&&code<=22){ //雾
				return 'E';
			}
			if(code>=0&&code<=2||code>=23&&code<=24){//风
				return 'F';
			}
			if(code>=27&&code<=30||code===44){ //多云
				return 'H';
			}
			if(code>=13&&code<=16){ //小雪
				return 'X';
			}
			if(code>=41&&code<=43||code===46){ //中雪
				return 'W';
			}
			if(code>=25&&code<=26){ //小雪
				return 'Y';
			}
			if(code===36){ //炎热
				return 'C';
			}
		},
		code2char:function(code){
		    switch(code){
		        case 0:
		            return '龙卷风';
		        case 1:
		            return '热带风暴';
		        case 2:
		            return '暴风';
		        case 3:
		            return '大雷雨';
		        case 4:
		            return '雷阵雨';
		        case 5:
		            return '雨夹雪';
		        case 6:
		            return '雨夹雹';
		        case 7:
		            return '雪夹雹';
		        case 8:
		            return '冻雾雨';
		        case 9:
		            return '细雨';
		        case 10:
		            return '冻雨';
		        case 11:
		            return '阵雨';
		        case 12:
		            return '阵雨';
		        case 13:
		            return '阵雪';
		        case 14:
		            return '小阵雪';
		        case 15:
		            return '高吹雪';
		        case 16:
		            return '雪';
		        case 17:
		            return '冰雹';
		        case 18:
		            return '雨淞';
		        case 19:
		            return '粉尘';
		        case 20:
		            return '雾';
		        case 21:
		            return '薄雾';
		        case 22:
		            return '烟雾';
		        case 23:
		            return '大风';
		        case 24:
		            return '风';
		        case 25:
		            return '冷';
		        case 26:
		            return '阴';
		        case 27:
		            return '多云';
		        case 28:
		            return '多云';
		        case 29:
		            return '局部多云';
		        case 30:
		            return '局部多云';
		        case 31:
		            return '晴';
		        case 32:
		            return '晴';
		        case 33:
		            return '转晴';
		        case 34:
		            return '转晴';
		        case 35:
		            return '雨夹冰雹';
		        case 36:
		            return '较热';
		        case 37:
		            return '局部雷雨';
		        case 38:
		            return '偶有雷雨';
		        case 39:
		            return '偶有雷雨';
		        case 40:
		            return '偶有阵雨';
		        case 41:
		            return '大雪';
		        case 42:
		            return '零星阵雪';
		        case 43:
		            return '大雪';
		        case 44:
		            return '局部多云';
		        case 45:
		            return '雷阵雨';
		        case 46:
		            return '阵雪';
		        case 47:
		            return '局部雷阵雨';
		        default:
		            return '水深火热';
		    }
		}
	}
	window.tools=tools;
})()
