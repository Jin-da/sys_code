export default {
  // 调整表格高度
  setClientHight(_this,outSideHieght,th,td) {//(指向,理想状态下表格(不包括外边距)外的高度,表头高度,行高)10为横向滚动条高度
    _this.clientHeight = document.documentElement.clientHeight;
    // console.log(document.documentElement.clientHeight);
    // if (document.documentElement.clientWidth <= 1483) {
    //   _this.childMethod();
    // }
    var tbheight = _this.clientHeight - outSideHieght
    var line_num = Math.round((tbheight-th)/td)
    if (line_num <= 3) {
      return 3*td + th +8
    } else {
      if (_this.ShowTableData.length === 0) {
        return 120
      }
      else if (_this.ShowTableData.length < line_num) {
        return _this.ShowTableData.length*td + th +8
      }
      else {
        return line_num*td + th +8
      }
    }
  },
  // 动态改变侧边栏显示状态
  setIsCollapse(_this) {
    if (_this.standBy_w != document.documentElement.clientWidth) {
      if (document.documentElement.clientWidth <= 1800) {
        if (_this.isCollapse === false) {
          _this.isCollapse = true
          _this.userIsCollapse = 0
        }
      } else {
        if (_this.isCollapse === true) {
          _this.isCollapse = false
          _this.userIsCollapse = 0
        }
      }
    } else {
      if (document.documentElement.clientWidth <= 1800) {
        if (_this.isCollapse === false && _this.userIsCollapse === 0) {
          _this.isCollapse = true
        }
      } else {
        if (_this.isCollapse === true && _this.userIsCollapse === 0) {
          _this.isCollapse = false
        }
      }
    }
    _this.standBy_w = document.documentElement.clientWidth
  },
  // 搜索的通用方法
  multiplexFilter(_this, value, params, code) {
    if (value === '') {//
    } else if (code === 1) {
      value = value.split(',')
      _this.ShowTableData = _this.ShowTableData.filter(item => {
        return item[params] >= value[0] && item[params] <= value[1];
      })
    } else if (code === 0) {//模糊搜索
      _this.ShowTableData = _this.ShowTableData.filter(item => {
        return item[params].indexOf(value) != -1
      })
    } else {//下拉栏搜索
      _this.ShowTableData = _this.ShowTableData.filter(item => {
        return item[params] === value
      })
    }
  },
  multiplexFilter1(_this, value, params, code) {
    if (value === '') {
      //
    } else if (code === 0 && value != '') {//模糊搜索
      _this.ShowTableData = _this.ShowTableData.filter(item => {
        return item['content'][params].indexOf(value) != -1
      })
    } else if (code === 2 && value != '') {//下拉栏搜索
      _this.ShowTableData = _this.ShowTableData.filter(item => {
        return item['content'][params] === value
      })
    }
  },
  getTimeData(timeStamp){
    var date = new Date();
    date.setTime(timeStamp * 1000);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second = date.getSeconds();
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
  },
  //日期处理(当有日期筛选时需要使用)
  dateToString(_this) {
    if (_this.searchDate instanceof Array) {
      _this.middleSearchDate = _this.searchDate.toString()
    }
    if (_this.searchDate === null) {
      _this.middleSearchDate = ''
      _this.searchDate = []
    }
  },
  getLocalTime(nS) {// 十位时间戳转换
    let time = new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ').replace(/\//g, '-');
    let space_position = time.indexOf(' ');
    return time.slice(0, space_position);
  },
  getLocalTime1(nS) {// 十位时间戳转换
    let time = new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ').replace(/\//g, '/');
    let space_position = time.indexOf(' ');
    return time.slice(0, space_position);
  },
  deepClone(obj) {//深拷贝
    let _obj = JSON.stringify(obj)
    return JSON.parse(_obj);
  }
}
