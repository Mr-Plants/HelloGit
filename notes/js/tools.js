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
					detial=data[i].content.slice(15,50);
				if(detial===""){
					detial="无附加文本";
				}
				str+=`
					<li>
						<div class="context">
							<div class="checkbox"></div>
							<div class="text">
								<div class="title">${title}</div>
								<div class="Info">
									<span class="date">${data[i].Date}</span>
									<span class="detial">${detial}</span>
								</div>
							</div>
						</div>
						<div class="delete">
							<div class="mark">标记</div>
							<div class="delBtn">删除</div>
						</div>
					</li>
				`
			}
			$(".content").html(str);
		}
	}	
	window.tools=tools;
})()
