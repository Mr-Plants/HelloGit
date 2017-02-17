$(".dock a").hover(function(){
	$(this).next().show();
},function(){
	$(this).next().hide();
})

tools.setTime();
setInterval(function(){
	tools.setTime();
},1000)
var max=99;
var memoList=[
	{
		id:1,
		top:100,
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
			show:true
		},
		{
			content:"吃饭打豆豆",
			isChecked:true,
			show:true
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
				this.list.push({
					content:this.inner,
					isChecked:false,
					show:show
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