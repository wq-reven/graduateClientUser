import '../css/index.css';
const moment = require('moment');

var vm = new Vue({
    el: "#Person",
    data: {
        order: [],
        collectionList: [],
        havedataShow: false,
        nodataShow: true,
        readyorder:0
    },
    mounted: function () {
        if (sessionStorage.getItem('userInfo') != null) {
            let userinfo = JSON.parse(sessionStorage.getItem('userInfo'));
            let querys = {
                uid: userinfo.uid
            }
            this.getOrder(querys);
            this.getCellction(userinfo)
            this.havedataShow = true;
            this.nodataShow = false;
        } else {
            this.havedataShow = false;
            this.nodataShow = true;
        }
    },
    methods: {
        getOrder: function (querys) {
            let data = {
                querys: querys,
                sort: {},
                pagination: {
                    'current': 1,
                    'pageSize': 8
                },
            }
            $.ajax({
                type: "GET",
                url: "http://123.207.164.37:3300/appo/queryAppoInfo",
                data: {
                    body: JSON.stringify(data)
                },
                success: function (res) {
                    if (res.code == 0) {
                        this.order = res.data.docs
                    }
                    let readyorder = 0;
                    let orderdata = res.data.docs
                    for (let i = 0; i < orderdata.length; i++) {
                        if (orderdata[i].status == '2') {
                            readyorder ++ 
                        }
                        
                    }
                    this.readyorder = readyorder;
                }.bind(this)
            })
        },
        getCellction: function (userinfo) {
            if (localStorage.getItem(userinfo.uid)) {
                let userCellObj = JSON.parse(localStorage.getItem(userinfo.uid))
                this.collectionList = userCellObj.housedata;
            }
        },
        formatDate: function (values) {
            return moment(values).format('YYYY-MM-DD hh:mm a');
        },
        formatView:function (param) {
            switch (param) {
                case '0':
                    return '<span style="color:lightcoral">正在等待处理</span>';
                    break;
                case '1':
                    return '<span style="color:#4fac6a">已接受，待前往</span>';
                    break;
                case '2':
                    return '<span style="color:#3385ff">已完成</span>'
                    break
            }
        }
    },
    computed: {

    },
    updated: function () {
        $(".person_con ul li").click(function () {
            $(this).addClass("cilckClass").siblings().removeClass("cilckClass")
            var index = $(this).index();
            $(".tab").eq(index).removeClass("hide").siblings().addClass('hide')
        })
    }

})

