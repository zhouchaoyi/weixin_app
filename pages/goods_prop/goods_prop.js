var Api = require('../../utils/api.js');

Page({
  data: {
    array:[],
    arrayId:[],
    index:0,
    goodsNm:"",
    goodsPrice:"",
    lowPrice:"",
    remark:"",
    modalHidden:true,
    delModalHidden:true,
    modalTxt:"",
    goodsId:"",
    showDelBtn:false
  },
  onLoad: function (options) {
    var self = this;
    self.getGoodsType();
    if(options.goodsId && options.goodsId!="") {
      self.setData({
        goodsId: options.goodsId,
        showDelBtn: true
      });
      self.queryPropById();
      //console.log(self.data.goodsId);
    }
    
  },

  getGoodsType: function() {
      var self = this;
      Api.request("/storeMgmt/listGoodsType","",function(res){
          var data = res.data.data;
          //console.log(data);
          var tempArray = data.map(function(value){
              return value.type_nm;
          });
          var tempArrayId = data.map(function(value){
              return value.type_id;
          });

          self.setData({
            array: tempArray, 
            arrayId: tempArrayId, 
          });   
        //console.log(self.data.arrayId);         
      });
  },

  queryPropById: function() {
      var self = this;
      var payLoad={
        goodsId: self.data.goodsId
      };
      Api.request("/storeMgmt/queryGoodsById",payLoad,function(res){
          var data = res.data.data;
          var typeId = data.type_id;
          var num=0;
          var arrayId = self.data.arrayId;
          for(var i=0;i<arrayId.length;i++) {
            if(arrayId[i]==typeId) {
              break;
            }else {
              num++;
            }
          }
          self.setData({
            goodsNm:data.goods_name,
            goodsPrice:data.goods_price,
            lowPrice: data.low_price,
            remark: data.remark,
            index: num
          });   
      });
  },

  bindPickerChange: function(e) {
      var index = e.detail.value;
      this.setData({
        index: index
      });
  },

  bindconfirm: function() {
    var self = this;
    self.setData({
      modalHidden:true
    });
  },

  formSubmit: function(e) {
    //console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var self = this;
    var payLoad={
      goodsNm: e.detail.value.goodsNm,
      goodsPrice: e.detail.value.goodsPrice,
      lowPrice: e.detail.value.lowPrice,
      remark: e.detail.value.remark,
      goodsType: self.data.arrayId[self.data.index],
      goodsId: self.data.goodsId
    };
    if(payLoad.goodsNm=="") {
        self.setData({
          modalHidden:false,
          modalTxt:"请填写物品名称"
        });
        return;
    }
    if(payLoad.goodsPrice=="") {
        self.setData({
          modalHidden:false,
          modalTxt:"请填写正常价格"
        });
        return;
    }

    var goodsId = self.data.goodsId;
    if(goodsId && goodsId!="") {
      Api.request("/storeMgmt/modifyGoods",payLoad,function(res){
          wx.navigateBack();
      });
    }else {
      Api.request("/storeMgmt/addGoods",payLoad,function(res){
          wx.navigateBack();
      });
    }
  },

  delGoods: function() {
    var self=this;
    self.setData({
      delModalHidden:false
    });
  },

  delConfirm: function() {
      var self=this;
      var payLoad={
        goodsId: self.data.goodsId
      };
      Api.request("/storeMgmt/deleteGoods",payLoad,function(res){
          wx.navigateBack();
      });
  },

  delCancel: function() {
    var self=this;
    self.setData({
      delModalHidden:true
    });
  }
})