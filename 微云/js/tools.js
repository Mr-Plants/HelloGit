var tools={
	//给元素添加指定的class
	addClass(element,className){
		if( !tools.hasClass(element,className) ){
			element.className += " "+ className;
		}
	},
	//删除元素指定的class
	removeClass(element,className){
		if(tools.hasClass(element,className) ){
			var classArr = element.className.split(" ");
			//["a","b","c"]
			for( var i = classArr.length-1; i >= 0; i-- ){
				if( classArr[i] === className){
					classArr.splice(i,1);
				}
			}
			element.className = classArr.join(" ");

		}
	},
	//判断元素是否有指定class
	hasClass(element,className){
		var classArr = element.className.split(" ");
		for( var i = 0; i < classArr.length; i++ ){
			if( classArr[i] === className ){
				return true;
			}
		}
		return false;
	},
	//查找指定特性的父元素
	parent(element,attr){
		//先找到attr的第一个字符
		var firstChar = attr.charAt(0);
		if( firstChar === "." ){
			while(element.nodeType !== 9 && !tools.hasClass(element,attr.slice(1))){
				//elemnet不是document并且element没有指定的class，那么element就为父级，继续向上找
				element = element.parentNode;
			}
		}else if(firstChar === "#"){
			while(element.nodeType !== 9 && element.id !== attr.slice(1)){
				//element没有指定的id，那么element就为父级，继续向上找
				element = element.parentNode;
			}
		}else{
			while(element.nodeType !== 9 && element.nodeName !== attr.toUpperCase()){
				//element没有指定的标签名，那么element就为父级，继续向上找
				element = element.parentNode;
			}
		}
		return element.nodeType === 9 ? null : element;
//			如果最后没有找到,那么就返还null,否则返还元素
	},
	peng(obj1,obj2){//返回结果如果为true，说明碰到
    	var pos1 = obj1.getBoundingClientRect();
    	var pos2 = obj2.getBoundingClientRect();
    	return pos1.right > pos2.left && pos1.left < pos2.right && pos1.bottom > pos2.top && pos1.top < pos2.bottom;
   },
   //顶部弹出框
   tipsGo(className,word){
   		warnBox.lastElementChild.innerHTML=word;
   		warnBox.className="";
   		tools.addClass(warnBox,className);
		warnBox.style.transition="none";
		warnBox.style.top="-50px";
		setTimeout(function(){
		    warnBox.style.transition="0.3s";
		    warnBox.style.top="15px";
		},0)
		clearTimeout(warnBox.timer);
		warnBox.timer=setTimeout(function(){
			warnBox.style.top="-50px";
		},1000)	
   },
   //渲染函数
   render(id){
   	fileCont.innerHTML=createFilesHtml(id);
	topGuide.innerHTML=createBreadHtml(id);
	positionById(id);
   },
   //重命名检测
   nameCheck(name){
   		for (var i = 0; i < fileName.length; i++) {
   			if(fileName[i].innerHTML==name){
   				return false;
   			}
   		}
   		return true;
   },
   //检查是否全被选中
   isCheckAll(){
   		var bl=Array.from(items).every(function(value){
			return tools.hasClass(value,"active")
		});
		if(bl){
			tools.addClass(checkAll,"checked");
		}else{
			tools.removeClass(checkAll,"checked");
		}
   },
   //弹框组件
   tipBox(options){
   		var box=document.createElement("div");
   		var mask=document.createElement("div");
   		box.className="tipbox";
   		document.body.appendChild(box);
   		document.body.appendChild(mask);
		
   		box.innerHTML=`
   			<h3>${options.title}</h3>
			<span class="close"></span>
			<div class="cont list">
				${options.cont}
			</div>
			<span class="warn"></span>
			<span class="confirm btn">确定</span>
			<span class="cancel btn">取消</span>`;
		box.style.left=(document.documentElement.clientWidth-box.offsetWidth)/2+"px";
   		box.style.top=(document.documentElement.clientHeight-box.offsetHeight)/2+"px";
   		window.onresize=function(){
   			box.style.left=(document.documentElement.clientWidth-box.offsetWidth)/2+"px";
   			box.style.top=(document.documentElement.clientHeight-box.offsetHeight)/2+"px";
   		}
		mask.style.cssText = "width:100%;height:100%;background:#000;opacity: .5;position:fixed;left:0;top:0;z-index:99;";
		box.style.zIndex=100;	
   		box.querySelector(".close").onclick=function(){
   			document.body.removeChild(box);
   			document.body.removeChild(mask);
   		};
   		box.querySelector(".confirm").onclick=function(){
   			var bl=options.okFn();
   			if( !bl ){
				document.body.removeChild(box);
				document.body.removeChild(mask);
			}
   		};
   		box.querySelector(".cancel").onclick=function(){
   			document.body.removeChild(box);
   			document.body.removeChild(mask);
   		};
   },
   //找到被选中的元素
   isSelect(element){
   		return Array.from(element).filter(function(value){
			return tools.hasClass(value,"active")
		});
   },
   noSelect(element){
   		return Array.from(element).filter(function(value){
			return tools.noClass(value,"active");
		});
   },
   noClass(element,className){
		var classArr = element.className.split(" ");
		for( var i = 0; i < classArr.length; i++ ){
			if( classArr[i] === className ){
				return false;
			}
		}
		return true;
	}
}
