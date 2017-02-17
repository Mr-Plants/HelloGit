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
			D=now.getDay(),
			dayArr=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
			str='<span class="hours">'+h+':'+m+'</span><span class="second">'+s+'</span><span class="year">'+y+'-'+u+'-'+d+' '+dayArr[D]+'</span>';
			$("#time").html(str);
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
		}
	}
	window.tools=tools;
})()
