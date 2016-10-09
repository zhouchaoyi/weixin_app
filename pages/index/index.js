var Api = require('../../utils/api.js');
//获取应用实例
var app = getApp();
Page({
  data: {
    array:[],
    arrayId:[],
    index:0,
    listItems:[],
    page: 1,
    hidden: false,
    searchTxt: ""
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    //console.log('onLoad')
    this.myInitData();
  },
  onShow: function() {
    //console.log("onShow<<<<<<<");
    this.myInitData();
  },

  myInitData: function() {
    var self = this;
    Api.request("/storeMgmt/listGoodsType","",function(res){
        var data = res.data.data;
        //console.log(data);
        var tempArray = data.map(function(value){
            return value.type_nm;
        });
        tempArray.unshift("全部类别");
        var tempArrayId = data.map(function(value){
            return value.type_id;
        });
        tempArrayId.unshift("");

        self.setData({
          array: tempArray, 
          arrayId: tempArrayId, 
        });   
        //console.log(self.data.arrayId);         
    });
    this.fetchData({
      type_id: self.data.arrayId[self.data.index],
      keyword: self.data.searchTxt
    });
  },

  bindPickerChange: function(e) {
      var index = e.detail.value;
      if(index==0) {
        this.setData({
          page: 1
        });
      }
      this.setData({
        index: index
      });
      this.fetchData({
        type_id: this.data.arrayId[e.detail.value],
        keyword: this.data.searchTxt
      });
  },

  lower: function(e) {
    //console.log("触发了<<<<<<<<<");
    var self = this;
    self.setData({
        page: self.data.page + 1
    });
    this.fetchData({
      page: self.data.page,
      type_id: self.data.arrayId[self.data.index],
      keyword: self.data.searchTxt
    });
    
  },

  fetchData: function (data) {
    var self = this;
    self.setData({
      hidden: false
    });
    if (!data) data = {};
    if (!data.page) data.page = 1;
    if (!data.type_id) data.type_id = "";
    if (!data.keyword) data.keyword = "";
    if (data.page === 1) {
      self.setData({
        listItems: []
      });
    }

    var payLoad = {
        "pageSize": 15,
        "currentPage": data.page,
        "type_id": data.type_id,
        "keyword": data.keyword
    };
    //console.log(payLoad);
    Api.request("/storeMgmt/listGoods",payLoad,function(res){
        //console.log(res.data.data);
        self.setData({
          listItems: self.data.listItems.concat(res.data.data.list)
        });    
        setTimeout(function () {
          self.setData({
            hidden: true
          });
        }, 300);        
    });

  },

  tapSearchBtn: function(e) {
      var self = this;
      self.fetchData({
        type_id: self.data.arrayId[self.data.index],
        keyword: self.data.searchTxt
      });
  },

  bindSearchTxtInput: function(e) {
      var self = this;
      self.setData({
        searchTxt: e.detail.value
      });
  },

  addGoods: function() {
      wx.navigateTo({
        url: '../goods_prop/goods_prop'
      });
  },

  editGoods: function(e) {
    // console.log("goodsId="+e.currentTarget.dataset.id);
    var goodsId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../goods_prop/goods_prop?goodsId='+goodsId
    })
  }

  // billType: function() {
  //   wx.navigateTo({
  //     url: '../bill_type_list/bill_type_list'
  //   })
  // }
})
