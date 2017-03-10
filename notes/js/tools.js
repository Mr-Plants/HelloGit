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
		renderList:function(data){
			$(".count").text(data.length+"个笔记");
			var str="";
			for (var i = 0; i < data.length; i++){
				var title=data[i].content.slice(0,20),
					markStatus=data[i].isMark?"取消":"标记",
					red=data[i].isMark?"red":null,
					time=data[i].Date[0]+"/"+data[i].Date[1]+"/"+data[i].Date[2],
					detial=data[i].content.slice(15,50);
				if(detial===""){
					detial="无附加文本";
				}
				str+=`
					<li data-id=${data[i].id} class=${red}>
						<div class="context">
							<div class="checkbox"></div>
							<div class="text">
								<div class="title">${title}</div>
								<div class="Info">
									<span class="date">${time}</span>
									<span class="detial">${detial}</span>
								</div>
							</div>
						</div>
						<div class="delete">
							<div class="mark">${markStatus}</div>
							<div class="delBtn">删除</div>
						</div>
					</li>
				`
			}
			$(".content").html(str);
		},
		//根据传入id找到数据，并修改数据
		changeData:function(id,obj){
			data.forEach(function(item,index){
				if(item.id==id){
					for(var attr in obj){
						item[attr]=obj[attr];
					}
				}
			})
		},
		//--------取消编辑状态-------
		cancelEdit:function(){
			canSearch=true;
			canMove=true;
			enter=true;
			$(".edit").text("编辑");
			$("h1").text("木木笔记");
			$(".markAll").text("标记全部");
			$(".deleteAll").text("删除全部");
			$(".context").css({
				"transition":"0.3s",
				"transform":"translateX(0)"
			})
			$(".serBox").css("opacity","1");
			$(".context").removeClass("active");
			$(".markAll").hide();
			$(".deleteAll").hide();
			$(".count").show();
			$(".create").show();
			setTimeout(function(){
				$(".delBtn").show();
				$(".mark").show();
			},300)		
		},
		//-------操作时弹出提示-------
		tips:function(str){
			$(".tips").show();
			$("#mask").show();
			$(".sure").text(str);
			setTimeout(function(){
				$(".tips").css("transform","translateY("+-5.2*rem+"px)");
			},50)
			
		},
		//取消删除
		cancelDelete:function(){
			if(!isEdit){
				$(".context").css({
					"transition":"0.3s",
					"transform":"translateX(0)"
				})
			}
			$(".tips").css("transform","translateY(0)");
			$("#mask").hide();
		},
		//获取被选中数据的id
		findSelect:function(fn){
			$(".active").each(function(){
				var id=$(this).parent()[0].dataset.id;
				data.forEach(function(item,index){
					if(item.id==id){
						fn(index);
						return
					}
				})
			})
		},
		// 光标移动到最后
		msgTextLastPos:function(obj) {
	        obj.focus(); //解决ff不获取焦点无法定位问题
	        var range = window.getSelection();//创建range
	        range.selectAllChildren(obj);//range 选择obj下所有子内容
	        range.collapseToEnd();//光标移至最后
		},
		setTime:function(){
			var now=new Date(),
			h=tools.addZero(now.getHours()),
			m=tools.addZero(now.getMinutes()),
			y=now.getFullYear(),
			u=now.getMonth()+1,
			d=now.getDate();
			var arr=[y,u,d,h,m];
			return arr;
		},
		timeStr:function(arr){
			var str=arr[0]+'年'+arr[1]+'月'+arr[2]+'日'+' '+tools.addZero(arr[3])+':'+tools.addZero(arr[4]);			
			return str;
		},
		addZero:function(n){
			return n<10?"0"+n:""+n;
		},
		getInfo:function(id,attr){
			var ss; //用来保存数据并return
			data.forEach(function(item,index){
				if(item.id==id){
					ss=data[index][attr];
					return ;
				}
			})
			return ss;
		}
	}	
	window.tools=tools;
})()
