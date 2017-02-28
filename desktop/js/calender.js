var CalendarHandler = {
currentYear: 0,
currentMonth: 0,
isRunning: false,
showYearStart: 2009,
initialize: function() {
	$calendarItem = this.CreateCalendar(0, 0, 0);
	$("#Container").append($calendarItem);
	$calendarItem.css("height", $("#context").height() - 30 + "px");
	$("#Container").animate({
		width: $("#context").width() + "px",
		height: ($("#context").height() - 30) * 2 + "px",
		marginLeft: "0px",
		marginTop: "0px"
	}, 300, function(){
		$calendarItem.css("visibility", "visible");
	});
	var itemPaddintTop = $(".dayItem").height() / 6;
	$(".item").css({
		"width": $(".week").width() / 7 + "px",
		"line-height": itemPaddintTop + "px",
		"height": itemPaddintTop + "px"
	});
	$(".currentItem>a").css({
		"margin-left":($(".item").width()-25)/2+"px",
		"margin-top":($(".item").height()-25)/2+"px"
	});
},
CreateSelectYear: function(showYearStart) {
	CalendarHandler.showYearStart = showYearStart;
	$(".currentDay").show();
	$("#selectYearDiv").children().remove();
	var yearindex = 0;
	for(var i = showYearStart; i < showYearStart + 12; i++) {
		yearindex++;
		if(i == showYearStart) {
			$last = $("<div>往前</div>");
			$("#selectYearDiv").append($last);
			$last.click(function() {
				CalendarHandler.CreateSelectYear(CalendarHandler.showYearStart - 10);
			});
			continue;
		}
		if(i == showYearStart + 11) {
			$next = $("<div>往后</div>");
			$("#selectYearDiv").append($next);
			$next.click(function() {
				CalendarHandler.CreateSelectYear(CalendarHandler.showYearStart + 10);
			});
			continue;
		}

		if(i == this.currentYear) {
			$yearItem = $("<div class=\"currentYearSd\" id=\"" + yearindex + "\">" + i + "</div>")

		} else {
			$yearItem = $("<div id=\"" + yearindex + "\">" + i + "</div>");
		}
		$("#selectYearDiv").append($yearItem);
		$yearItem.click(function() {
			$calendarItem = CalendarHandler.CreateCalendar(Number($(this).html()), 1, 1);
			$("#Container").append($calendarItem);
			CalendarHandler.CSS()
			CalendarHandler.isRunning = true;
			$($("#Container").find(".dayItem")[0]).animate({
				height: "0px"
			}, 300, function() {
				$(this).remove();
				CalendarHandler.isRunning = false;
			});
			$("#centerMain").animate({
				marginLeft: -$("#center").width() + "px"
			}, 500);
		});
		if(yearindex == 1 || yearindex == 5 || yearindex == 9) $("#selectYearDiv").find("#" + yearindex).css("border-left-color", "#fff");
		if(yearindex == 4 || yearindex == 8 || yearindex == 12) $("#selectYearDiv").find("#" + yearindex).css("border-right-color", "#fff");

	}
	$("#selectYearDiv>div").css("width", ($("#center").width() - 4) / 4 + "px").css("line-height", ($("#center").height() - 4) / 3 + "px");
	$("#centerMain").animate({
		marginLeft: "0px"
	}, 300);
},
CreateSelectMonth: function() {
	$(".currentDay").show();
	$("#selectMonthDiv").children().remove();
	for(var i = 1; i < 13; i++) {
		if(i == this.currentMonth) $monthItem = $("<div class=\"currentMontSd\" id=\"" + i + "\">" + i + "月</div>");
		else $monthItem = $("<div id=\"" + i + "\">" + i + "月</div>");
		$("#selectMonthDiv").append($monthItem);
		$monthItem.click(function() {
			$calendarItem = CalendarHandler.CreateCalendar(CalendarHandler.currentYear, Number($(this).attr("id")), 1);
			$("#Container").append($calendarItem);
			CalendarHandler.CSS()
			CalendarHandler.isRunning = true;
			$($("#Container").find(".dayItem")[0]).animate({
				height: "0px"
			}, 300, function() {
				$(this).remove();
				CalendarHandler.isRunning = false;
			});
			$("#centerMain").animate({
				marginLeft: -$("#center").width() + "px"
			}, 500);
		});
		if(i == 1 || i == 5 || i == 9) $("#selectMonthDiv").find("#" + i).css("border-left-color", "#fff");
		if(i == 4 || i == 8 || i == 12) $("#selectMonthDiv").find("#" + i).css("border-right-color", "#fff");
	}
	$("#selectMonthDiv>div").css("width", ($("#center").width() - 4) / 4 + "px").css("line-height", ($("#center").height() - 4) / 3 + "px");
	$("#centerMain").animate({
		marginLeft: -$("#center").width() * 2 + "px"
	}, 300);
},
IsRunYear: function(aDate) {
	return(0 == aDate % 4 && (aDate % 100 != 0 || aDate % 400 == 0));
},
CalculateWeek: function(y, m, d) {
	var arr = "7123456".split("");
	with(document.all) {
		var vYear = parseInt(y, 10);
		var vMonth = parseInt(m, 10);
		var vDay = parseInt(d, 10);
	}
	var week = arr[new Date(y, m - 1, vDay).getDay()];
	return week;
},
CalculateMonthDays: function(m, y) {
	var mDay = 0;
	if(m == 0 || m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12) {
		mDay = 31;
	} else {
		if(m == 2) {
			//判断是否为闰年
			var isRn = this.IsRunYear(y);
			if(isRn == true) {
				mDay = 29;
			} else {
				mDay = 28;
			}
		} else {
			mDay = 30;
		}
	}
	return mDay;
},
CreateCalendar: function(y, m, d) {
	$dayItem = $("<div class=\"dayItem\"></div>");
	//获取当前月份的天数
	var nowDate = new Date();
	if(y == nowDate.getFullYear() && m == nowDate.getMonth() + 1 || (y == 0 && m == 0))
		$(".currentDay").hide();
	var nowYear = y == 0 ? nowDate.getFullYear() : y;
	this.currentYear = nowYear;
	var nowMonth = m == 0 ? nowDate.getMonth() + 1 : m;
	this.currentMonth = nowMonth;
	var nowDay = d == 0 ? nowDate.getDate() : d;
	$(".selectYear").html(nowYear + "年");
	$(".selectMonth").html(nowMonth + "月");
	var nowDaysNub = this.CalculateMonthDays(nowMonth, nowYear);
	//获取当月第一天是星期几
	var nowWeek = parseInt(this.CalculateWeek(nowYear, nowMonth, 1));
	//获取上个月的天数
	var lastMonthDaysNub = this.CalculateMonthDays((nowMonth - 1), nowYear);
	if(nowWeek != 0) {
		//生成上月剩下的日期
		for(var i = (lastMonthDaysNub - (nowWeek - 1)); i < lastMonthDaysNub; i++) {
			$dayItem.append("<div class=\"item lastItem\"><a>" + (i + 1) + "</a></div>");
		}
	}
	//生成当月的日期
	for(var i = 0; i < nowDaysNub; i++) {
		if(i == (nowDay - 1)) $dayItem.append("<div class=\"item currentItem\"><a>" + (i + 1) + "</a></div>");
		else $dayItem.append("<div class=\"item\"><a>" + (i + 1) + "</a></div>");
	}
	//获取总共已经生成的天数
	var hasCreateDaysNub = nowWeek + nowDaysNub;
	//如果小于42，往下个月推算
	if(hasCreateDaysNub < 42) {
		for(var i = 0; i <= (42 - hasCreateDaysNub); i++) {
			$dayItem.append("<div class=\"item lastItem\"><a>" + (i + 1) + "</a></div>");
		}
	}
	return $dayItem;
},
CSS: function() {
	var itemPaddintTop = $(".dayItem").height() / 6;
	$(".item").css({
		"width": $(".week").width() / 7 + "px",
		"line-height": itemPaddintTop + "px",
		"height": itemPaddintTop + "px"
	});
	$(".currentItem>a").css("margin-left", ($(".item").width() - 25) / 2 + "px").css("margin-top", ($(".item").height() - 25) / 2 + "px");
},
CalculateNextMonthDays: function() {
	if(this.isRunning == false) {
		$(".currentDay").show();
		var m = this.currentMonth == 12 ? 1 : this.currentMonth + 1;
		var y = this.currentMonth == 12 ? (this.currentYear + 1) : this.currentYear;
		var d = 0;
		var nowDate = new Date();
		if(y == nowDate.getFullYear() && m == nowDate.getMonth() + 1) d = nowDate.getDate();
		else d = 1;
		$calendarItem = this.CreateCalendar(y, m, d);
		$("#Container").append($calendarItem);

		this.CSS();
		this.isRunning = true;
		$($("#Container").find(".dayItem")[0]).animate({
			height: "0px"
		}, 300, function() {
			$(this).remove();
			CalendarHandler.isRunning = false;
		});
	}
},
CalculateLastMonthDays: function() {
	if(this.isRunning == false) {
		$(".currentDay").show();
		var nowDate = new Date();
		var m = this.currentMonth == 1 ? 12 : this.currentMonth - 1;
		var y = this.currentMonth == 1 ? (this.currentYear - 1) : this.currentYear;
		var d = 0;

		if(y == nowDate.getFullYear() && m == nowDate.getMonth() + 1) d = nowDate.getDate();
		else d = 1;
		$calendarItem = this.CreateCalendar(y, m, d);
		$("#Container").append($calendarItem);
		var itemPaddintTop = $(".dayItem").height() / 6;
		this.CSS();
		this.isRunning = true;
		$($("#Container").find(".dayItem")[0]).animate({
			height: "0px"
		}, 300, function() {
			$(this).remove();
			CalendarHandler.isRunning = false;
		});
	}
},
CreateCurrentCalendar: function() {
	if(this.isRunning == false) {
		$(".currentDay").hide();
		$calendarItem = this.CreateCalendar(0, 0, 0);
		$("#Container").append($calendarItem);
		this.isRunning = true;
		$($("#Container").find(".dayItem")[0]).animate({
			height: "0px"
		}, 300, function() {
			$(this).remove();
			CalendarHandler.isRunning = false;
		});
		this.CSS();
		$("#centerMain").animate({
			marginLeft: -$("#center").width() + "px"
			}, 500);
		}
	}
}
CalendarHandler.initialize();
$("#CalendarMain .prevMonth").on("click",function(){ //前一个月
	CalendarHandler.CalculateLastMonthDays();
})
$("#CalendarMain .nextMonth").on("click",function(){ //后一个月
	CalendarHandler.CalculateNextMonthDays();
})
$("#CalendarMain .selectMonth").on("click",function(){ //选择月份
	CalendarHandler.CreateSelectMonth();
})
$("#CalendarMain .selectYear").on("click",function(){ //选择年
	CalendarHandler.CreateSelectYear(CalendarHandler.showYearStart);
})
$("#CalendarMain .currentDay").on("click",function(){ //回到今天
	CalendarHandler.CreateCurrentCalendar(0,0,0);
})
var scaleOnoff=false;
tools.drag($("#title")[0],$("#CalendarMain")[0]);
tools.maxIndex($("#CalendarMain")[0]);
$("#time").on("click",calsca);
$(".calender").on("click",calsca);
function calsca(){
	if(!scaleOnoff){
		$("#CalendarMain").css("transform","scale(1)");
		$("#CalendarMain")[0].style.zIndex=++max;
	}else{
		$("#CalendarMain").css("transform","scale(0)");
	}
	scaleOnoff=!scaleOnoff;
}