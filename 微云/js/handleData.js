var handle = {
	//根据传入id查找子数据
	getChildsById(data,id){
		return data.filter(function(value){
		    return value.pid==id;
		})
	},
	//根据传入id查找自己
	getSelfById(data,id){
		return data.find(function(value){
		    return value.id==id;
		})
	},
	//根据传入id查找自己及所有父数据
	getParentById(data,id){
		var arr=[];
		var self=handle.getSelfById(data,id);
		if(self){ //如果父数据存在则执行下面代码
			arr.push(self);
			arr=arr.concat(handle.getParentById(data,self.pid));
		}
		return arr;
	},
	//根据传入id查找所有的子数据，包括子数据的所有子数据
	getAllChildsById(data,id){
		var arr=handle.getChildsById(data,id);
		if(arr.length){ //如果子数据存在则执行下面代码
			arr.forEach(function(value){
				arr=arr.concat(handle.getAllChildsById(data,value.id));
			})
		}
		return arr;
	},
	//修改传入id的title
	changeName(data,ori,name){
		var n=data.findIndex(function(value){
			return value.title==ori;
		});
		data[n].title=name;
	},
	getChildsAllByIdarr(data,idArr){
		var arr = [];
		idArr.forEach(function (value){
			arr = arr.concat(handle.getChildsAll(data,value));
		})
		return arr;
	},
	getChildsAll(data,id){
		var arr = [];
		var self = handle.getSelfById(data,id);
		arr.push(self);
		var childs = handle.getChildsById(data,self.id);
		childs.forEach(function (value){
			arr = arr.concat(handle.getChildsAll(data,value.id));
		})
		return arr;
	},
}
