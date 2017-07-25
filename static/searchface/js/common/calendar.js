;
(function($, window, document, undefined) {
	$.fn.calendar = function(options) {
		//创建cameraManageCheck
		var calendar = new Calendar(this, options);
		//调用其方法
		calendar.render();
	}

	var Calendar = function(ele, opt) {
		var todate = new Date(),
			_year = todate.getFullYear(),
			_month = todate.getMonth() + 1,
			_date = todate.getDate(),
			_year_o = (opt && opt.origin == "today") ? _year : 0,
			_month_o = (opt && opt.origin == "today") ? _month : 0,
			_date_o = (opt && opt.origin == "today") ? _date : 0,
			_year_l = (opt && opt.last == "today") ? _year : undefined,
			_month_l = (opt && opt.last == "today") ? _month : undefined,
			_date_l = (opt && opt.last == "today") ? _date : undefined;
			
		this.$ele = ele,
			this.defaults = {
				year_origin: _year_o,
				month_origin: _month_o,
				date_origin: _date_o,
				year_last: _year_l,
				month_last: _month_l,
				date_last: _date_l,
				year_chosen: _year,
				month_chosen: _month,
				date_chosen: _date,
			},
			this.options = $.extend({}, this.defaults, opt);
	}
	Calendar.prototype = {
		//渲染日历插件
		render: function(year,month,date) {
			var that = this,
				$ele = that.$ele,
				_options = that.options,
				$section = $('<section class="calendar"></section>'),
				_section = "",
				_year = year || _options.year_chosen,
				_month = month || _options.month_chosen,
				_date = date || _options.date_chosen,
				_firstday = that.getFirstDay(_year,_month),
				_monthlength = that.getMonthLength(_year,_month - 1);
			_section += '<header>' +
				'<p>' + _year + '年' + _month + '月</p>' +
				'<a class="next-year"></a>' +
				'<a class="next-month"></a>' +
				'<a class="today"></a>' +
				'<a class="last-month"></a>' +				
				'<a class="last-year"></a>' +				
				'</header>' +
				'<section>' +
				'<aside>' +
				'<p>日</p>' +
				'<p>一</p>' +
				'<p>二</p>' +
				'<p>三</p>' +
				'<p>四</p>' +
				'<p>五</p>' +
				'<p>六</p>' +
				'</aside>' +
				'<article>';
				//当前月份首日星期几排列
				while(_firstday > 0){
					_section += '<p></p>';
					_firstday--;
				}
				for(i=1;i<=_monthlength;i++){
					if((_options.year_origin <= _year && _options.month_origin < _month)
						|| (_options.year_origin <= _year && _options.month_origin == _month && _options.date_origin <= i)){
						if(_options.year_chosen == _year && _options.month_chosen == _month && i == _date) _section += '<p class="chosen">'+ i +'</p>';
						else if(!_options.year_last 
							|| (_options.year_last && (_options.year_last >= _year && _options.month_last > _month)
							|| (_options.year_last >= _year && _options.month_last == _month && _options.date_last >= i))){
							_section += '<p class="active">'+ i +'</p>';
						}else _section += '<p>'+ i +'</p>';
					}else _section += '<p>'+ i +'</p>';
				}
				_section += '</article>' +
							'</section>';
				$section.html(_section);
				$ele.html($section);
				//点击选择事件
				$ele.find("article").find("p").click(function(){
					var _check = $ele.find("header").children("p").text() + $(this).text() + "日";	
					if($(this).attr("class") == "active" || $(this).attr("class") == "chosen"){
						$ele.siblings("p").text(_check);
						$section.remove();
						$ele.siblings("p").removeAttr("class");
						if(_options.end_fun) _options.end_fun(_check);
					}else{
						CommonFun.bubbleMsg("请选择有效日期");
					}						
				});	
				//点击前后翻页
				$ele.find("a.last-year").click(function(){
					that.render(_year-1,_month,_date);
				});
				$ele.find("a.last-month").click(function(){
					var y = (_month < 2) ? (_year - 1) :_year,
						m = (_month < 2) ? 12 :(_month - 1);
					that.render(y,m,_date);
				});
				$ele.find("a.today").click(function(){
					that.render(_options.year_chosen,_options.month_chosen,_options.date_chosen);
				});
				$ele.find("a.next-year").click(function(){
					that.render(_year+1,_month,_date);
				});
				$ele.find("a.next-month").click(function(){
					var y = (_month > 11) ? (_year + 1) :_year,
						m = (_month > 11) ? 1 : (_month + 1);
					that.render(y,m,_date);
				});
			return this;
		},
		//获取该日期第一天
		getFirstDay: function(year, month) {
			var theFirstDay = new Date(year, month - 1, 1);
			return theFirstDay.getDay();
		},
		//获取该日期第一天
		getMonthLength: function(year, month) {
			var next_month = new Date(year, month + 1, 1);
			next_month.setHours(next_month.getHours() - 2);
			return next_month.getDate();
		},
		
	}
})(jQuery, window, document);