var canSearch=true, //控制是否可以搜索  默认可以搜索
	canMove=true,   //控制是否可以滑动删除  默认可以滑动
	isEdit=false;   //是否在编辑状态  默认不在


var data=[
	{
		isMark:false,
		Date:"2017/3/10",
		content:"春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。"
	},
	{
		isMark:false,
		Date:"2017/3/5",
		content:"春眠不觉晓，处处闻啼鸟。"
	},
	{
		isMark:false,
		Date:"2017/3/8",
		content:"春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。"
	}
]
//tools.renderList(data);
//-------------滑动删除标记-----------------
$(".content").on("touchstart",".context",function(e){
	if(!canMove) return;
	ev=e.changedTouches[0];
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
		if(moveX>=0){
			_this.style.transition="0.3s";
			_this.style.transform="translateX(0)";
		}else{
			_this.style.transition="none";
			moveX=-moveX>26.8*rem?-26.8*rem:moveX;
			_this.style.transform="translateX("+moveX+"px)"
		}
	})
	$(document).one("touchend",function(){
		$(document).off("touchmove");
		if(-moveX>=13.4*rem){
			_this.style.transition="0.2s";
			_this.style.transform="translateX("+-26.8*rem+"px)";
		}else{
			_this.style.transition="0.3s";
			_this.style.transform="translateX(0)";
		}
	})
})

//---------------点击搜索----------------
$(".search").on("touchend",function(e){
	if(canSearch){
		canMove=false; //搜索时不能滑动删除
		$("header").hide();
		$(this).css("width",62*rem+"px");
		$(".cancel").show();
		$("footer").hide();
		this.focus();
	}
})
//取消搜索
$(".cancel").on("touchend",function(){
	canMove=true;
	$("header").show();
	$(".search").css("width",71.8*rem+"px");
	$(".search").blur();
	$(this).hide();
	$("footer").show();
})


//--------点击编辑---------
$(".edit").on("touchend",function(){
	if(!isEdit){
		canSearch=false;
		canMove=false;
		$(this).text("取消")
		$(".context").css({
			"transition":"0.3s",
			"transform":"translateX("+7.6*rem+"px)"
		})
		$(".serBox").css("opacity","0.4");
		$(".delBtn").hide();
		$(".mark").hide();
	}else{
		canSearch=true;
		canMove=true;
		$(this).text("编辑");
		$("h1").text("木木笔记");
		$(".markAll").text("标记全部");
		$(".deleteAll").text("删除全部");
		$(".context").css({
			"transition":"0.3s",
			"transform":"translateX(0)"
		})
		$(".serBox").css("opacity","1");
		$(".context").removeClass("active");
		setTimeout(function(){
			$(".delBtn").show();
			$(".mark").show();
		},300)		
	}
	isEdit=!isEdit;
	$(".markAll").toggle();
	$(".deleteAll").toggle();
	$(".count").toggle();
	$(".create").toggle();
})

//----------------选中操作-----------------
$(".content").on("touchend",".context",function(){
	if(isEdit){
		$(".context").css("transition","none");
		$(this).toggleClass("active");
		var len=$(".active").length;
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

tools.renderList(data);