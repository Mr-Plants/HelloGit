var canSearch=true, //控制是否可以搜索  默认可以搜索
	canMove=true,   //控制是否可以滑动删除  默认可以滑动
	create=false,   //是否通过创建打开  默认不是
	enter=true,	    //是否可以点击进入  默认可以		
	isEdit=false;   //是否在编辑状态  默认不在

var data=[
	{
		id:0,
		isMark:true,
		Date:[2017,3,10,05,10],
		content:"木木笔记是一款方便简洁高效的笔记应用，知识有限，不足之处敬请不吝指出，谢谢使用。本人邮箱：1171098609@qq.com"
	},
	{
		id:1,
		isMark:false,
		Date:[2017,3,4,12,06],
		content:"春眠不觉晓，处处闻啼鸟。"
	},
	{
		id:2,
		isMark:false,
		Date:[2017,3,3,13,26],
		content:"春秋战国时，有位俞伯牙善弹琴，一日乘舟游至汉阳江口，命童仆取琴焚香，调弦转轸，一曲未终弦断之。疑有人听琴，命左右搜之，遇一樵夫钟子期，二人登舟促膝相谈，意合知音，结为兄弟。约定来年江边相见。当俞伯牙按期来到江边时，钟子期已病故。伯牙闻知，泪如涌泉，去子期坟前祭拜，并割断琴弦，双手举琴向祭石台上一摔，摔得玉轸摧残，金徽零乱。老者惊问：“先生为何摔此琴？”伯牙道：“摔破瑶琴凤尾寒，子期不在对谁弹？春风满面皆朋友，欲觅知音难上难。"
	}
]

//----------获取本地存储-----------
var note=localStorage.getItem("note");
if(note){
	data=JSON.parse(note);
}

//-------------滑动菜单---------------
$(".content").on("touchstart",".context",function(e){
	if(!canMove) return;
	var ev=e.changedTouches[0];
	var _this=this,
		oriX=ev.clientX,
		moveX=null;
	$(".context").css({
		"transition":"0.3s",
		"transform":"translateX(0)"
	})
	$(document).on("touchmove",function(e){
		
		e=e.changedTouches[0];
		moveX=e.clientX-oriX;
		if(Math.abs(moveX)>15){
			enter=false;
		}
		if(moveX>=0){
			_this.style.transition="0.3s";
			_this.style.transform="translateX(0)";
		}else{
			_this.style.transition="none";
			moveX=-moveX>5.36*rem?-5.36*rem:moveX;
			_this.style.transform="translateX("+moveX+"px)"
		}
	})
	$(document).one("touchend",function(){
		$(document).off("touchmove");
		if(-moveX>=2.68*rem){
			_this.style.transition="0.2s";
			_this.style.transform="translateX("+-5.36*rem+"px)";
		}else{
			enter=true; //如果已经滑动成功，则不能点击
			_this.style.transition="0.3s";
			_this.style.transform="translateX(0)";
		}
	})
})

//---------------点击搜索----------------
$(".search").on("touchend",function(e){
	if(canSearch){
		canMove=false; //搜索时不能滑动删除
		enter=false;
		$("header").hide();
		$(this).css("width",12.4*rem+"px");
		$(".cancel").show();
		$("footer").hide();
		this.focus();
		$(".context").css({
			"transition":"0.3s",
			"transform":"translateX(0)"
		})
	}
})
//取消搜索
$(".cancel").on("touchend",function(){
	canMove=true;
	enter=true;
	$("header").show();
	$(".search").css("width",14.36*rem+"px");
	$(".search").blur();
	$(this).hide();
	$("footer").show();
})


//--------编辑按钮---------
$(".edit").on("touchend",function(){
	if(!isEdit){
		canSearch=false;
		canMove=false;
		enter=false;
		$(this).text("取消")
		$(".context").css({
			"transition":"0.3s",
			"transform":"translateX("+1.52*rem+"px)"
		})
		$(".serBox").css("opacity","0.4");
		$(".delBtn").hide();
		$(".mark").hide();
		$(".markAll").show();
		$(".deleteAll").show();
		$(".count").hide();
		$(".create").hide();
	}else{
		tools.cancelEdit();
	}
	isEdit=!isEdit;
})

//-------------选中--------------
var len; //选中的个数
$(".content").on("touchend",".context",function(){
	if(isEdit){
		$(".context").css("transition","none");
		$(this).toggleClass("active");
		len=$(".active").length;
		if(len!==0){
			$("h1").text("已选定"+len+"项");
			$(".markAll").text("标记选中");
			$(".deleteAll").text("删除选中");
		}else{
			$("h1").text("木木笔记");
			$(".markAll").text("标记全部");
			$(".deleteAll").text("删除全部");
		}
	}
})


//------------标记和取消--------------
$(".content").on("touchend",".mark",function(){
	var num=$(".mark").index(this);
	var id=$(this).parents("li")[0].dataset.id; //获取当前的id
	data.forEach(function(item,index){
		if(item.id==id){
			data[index].isMark=!data[index].isMark;
			return
		}
	})
	localStorage.setItem("note",JSON.stringify(data));
	$(".context").eq(num).css({
		"transition":"0.3s",
		"transform":"translateX(0)"
	})
	setTimeout(function(){
		tools.renderList(data); //渲染	
	},200)
})

//标记
$(".markAll").on("touchend",function(){
	if(!len){  //全部标记
		data.forEach(function(item){
			item.isMark=true;
		});	
	}else{
		tools.findSelect(function(index){
			data[index].isMark=true;
		})
	}
	localStorage.setItem("note",JSON.stringify(data));
	tools.cancelEdit();
	isEdit=false; //退出编辑状态
	setTimeout(function(){
		tools.renderList(data); //渲染	
	},200)
})

//---------删除----------
$(".deleteAll").on("touchend",function(){
	if(!len){  //全部删除
		tools.tips("删除全部");
	}else{
		tools.tips("删除选中");
	}
})
var index; //删除序号
//右滑删除
$(".content").on("touchend",".delBtn",function(){
	index=$(".delBtn").index(this); //获取当前的序号
	tools.tips("删除");
})
//确定删除
$(".sure").on("touchend",function(){
	if(!isEdit){ //非编辑滑动删除
		data.splice(index,1);
	}
	if(isEdit&&!len){ //编辑全部删除
		data=[];
		tools.cancelEdit();
		isEdit=false;
	}
	if(isEdit&&len){ //编辑选中删除
		tools.findSelect(function(index){
			data.splice(index,1);
		})
		tools.cancelEdit();
		isEdit=false;
	}
	localStorage.setItem("note",JSON.stringify(data));
	tools.renderList(data); //渲染
	$(".tips").css("transform","translateY(0)");
	$("#mask").hide();
})
//-----取消删除----
$(".giveUp").on("touchend",function(){
	tools.cancelDelete();
})

//-----文本编辑-------
$(".words").on("touchend",function(){
	$(this).focus();
})
//返回
$(".back").on("touchend",function(){
	document.addEventListener("touchstart",prevd);
	$(".words").blur();
	setTimeout(function(){
		$("#contShow").css("transform","translateX(0)");
	},20)
	if(create){
		create=false;
		if($(".words").text().trim()==="") return;
		data.unshift({
			id:parseInt(Math.random()*10000),
			isMark:false,
			Date:tools.setTime(),
			content:$(".words").text()
		})
		
	}else{
		tools.changeData(infoId,{
			Date:tools.setTime(),
			content:$(".words").text()
		})
	}
	tools.renderList(data);
	localStorage.setItem("note",JSON.stringify(data));
})

//-----------新建文本-------------
$(".create").on("touchend",function(){
	create=true;
	document.removeEventListener("touchstart",prevd);
	$(".words").text("");
	$(".time").text(tools.timeStr(tools.setTime()));
	$(".words").focus();
	tools.msgTextLastPos($(".words")[0]);
	$("#contShow").css("transform","translateX("+-15*rem+"px)");
})

//点击进入
var infoId; //记录访问的数据id
$(".content").on("touchend",".context",function(){
	if(!enter) return;
	infoId=$(this).parent()[0].dataset.id;
	document.removeEventListener("touchstart",prevd);
	$(".time").text(tools.timeStr(tools.getInfo(infoId,"Date")));
	$(".words").text(tools.getInfo(infoId,"content"));
	$("#contShow").css("transform","translateX("+-15*rem+"px)");
})
tools.renderList(data);