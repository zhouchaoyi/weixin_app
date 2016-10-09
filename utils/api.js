'use strict';
var HOST_URI = 'https://112.74.205.42/weiapp';

function obj2uri (obj) {
    return Object.keys(obj).map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(encodeURIComponent(obj[k]));
    }).join('&');
}

module.exports = {
    request: function (path,data,func) {
        if(!data) {
            data = "";
        }
        wx.request({
            url: HOST_URI + path,
            data: obj2uri(data),
            header:{
                //"Content-Type":"application/json; charset=UTF-8",
                "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",
                "Accept":"application/json; charset=UTF-8"
            },
            method: "POST",
            success: func
        });
    }
};