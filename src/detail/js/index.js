import '../css/index.css';
const moment = require('moment');

//获取地址栏参数
function getParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return "";
}

//获取评分数组
function itemClasses(param) {
    let result = [];
    let score = Math.floor(param * 2) / 2;
    let hasDecimal = score % 1 !== 0;
    let integer = Math.floor(score);
    for (let i = 0; i < integer; i++) {
        result.push("on");

    }
    if (hasDecimal) {
        result.push("half");

    }
    while (result.length < 5) {
        result.push("off");

    }
    console.log(result)
    return result;

}
var vm = new Vue({
    el: "#detailBox",
    data: {
        photo: [],
        houseInfo: {},
        floor: '',
        comments: [],
        score: [],
        comment_con: "",
        pageSize:2,
    },
    mounted: function () {
        let roomOrder = getParam('id')
        let querys = {
            roomOrder: roomOrder
        }
        this.getHouseDetail(querys);
        this.getHouseComments(querys);
    },
    methods: {
        getHouseDetail: function (querys) {
            let data = {
                querys: querys,
                sort: {},
                pagination: {
                    'current': 1,
                    'pageSize': 1
                },

            }
            $.ajax({
                type: "GET",
                url: "http://localhost:3300/room/queryRoomInfo",
                data: {
                    body: JSON.stringify(data)
                },
                success: function (res) {
                    console.log(res);
                    this.houseInfo = res.data.docs[0];
                    this.photo = res.data.docs[0].image;
                    let floor = ((res.data.docs[0].roomOrder).toString())[0]
                    console.log(floor)
                    this.floor = floor
                }.bind(this)
            })
        },
        getHouseComments: function (querys) {
            let data = {
                querys: querys,
                sort: {},
                pagination: {
                    'current': 1,
                    'pageSize': this.pageSize
                },
            }
            $.ajax({
                type: "GET",
                url: "http://localhost:3300/user/queryComments",
                data: {
                    body: JSON.stringify(data)
                },
                success: function (res) {
                    if (res.code == 0) {
                        this.comments = res.data.docs
                        let array = res.data.docs;
                        let score = []
                        for (let i = 0; i < array.length; i++) {
                            let element = array[i].rate;
                            score.push(itemClasses(element))
                        }
                        this.score = score;
                        sessionStorage.removeItem('score');
                    }
                }.bind(this)
            })
        },
        formatDate: function (values) {
            return moment(values).format('YYYY-MM-DD hh:mm a');
        },
        stringSub: function (param) {
            let newString = param.substr(0, 3) + '****' + param.substr(-9);
            return newString;
        },
        addCell:function (params) {
            
        },
        cancelPublish: function () {
            this.comment_con = ""
        },
        publish: function () {
            if (sessionStorage.getItem('userInfo') != null) {
                let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
                if (userInfo.userType == '1') {
                    alert('入住之后才能评论哦')
                } else {
                    if (sessionStorage.getItem('score') != null) {
                        if (this.comment_con !="") {
                            let score = sessionStorage.getItem('score');
                            let content = this.comment_con;
                            let roomOrder = getParam('id')
                            let data = {
                                uid: userInfo.uid,
                                email: userInfo.email,
                                name: userInfo.name,
                                roomOrder: roomOrder,
                                content: content,
                                rate: score,
                            }
                            $.ajax({
                                type: "GET",
                                url: "http://localhost:3300/user/addComments",
                                data: {
                                    body: JSON.stringify(data)
                                },
                                success: function (res) {
                                    if (res.code == 0) {
                                        console.log(res)
                                        let querys = {
                                            roomOrder: roomOrder
                                        }
                                        this.getHouseComments(querys);
                                    }
                                    this.comment_con = ""
                                }.bind(this)
                            })
                        } else {
                            alert('您还没有填写内容')
                        }
                    } else {
                        alert('请选择评分')
                    }
                }

            } else {
                alert('对不起，您还没有登录')
            }

        }
    },
    computed: {

    },
    updated: function () {
        var swiper2 = new Swiper('#swiper2', {
            direction: 'horizontal',
            loop: true,
            effect: 'fade',
            pagination: '#pagination1',
            speed: 700,
            autoplay: 3200,
            autoplayDisableOnInteraction: false,
        });
        $.fn.raty.defaults.path = '/lib/images';
        $('#function-demo').raty({
            number: 5, //多少个星星设置
            path: '/lib/images',
            hints: ['差', '一般', '好', '非常好', '全五星'],
            cancelOff: 'cancel-off.png',
            cancelOn: 'cancel-on.png',
            size: 24,
            starHalf: 'star-half.png',
            starOff: 'star-off.png',
            starOn: 'star-on.png',
            target: '#function-hint',
            cancel: false,
            targetKeep: true,
            targetText: '打个分吧！',
            click: function (score, evt) {
                sessionStorage.setItem('score', score)
            }
        });
    }
})