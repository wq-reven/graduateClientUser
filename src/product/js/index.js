import '../css/index.css';

var vm = new Vue({
    el:"#houseinfo",
    data:{
        house:[],
        all: 1, //总页数
        cur: 1,//当前页码
        searchValue:"",
        querys: { 'status': '0'},
        searchType:'direction'
    },
    watch: {
        cur: function (oldValue, newValue) {
            console.log(arguments);
        }
    },
    mounted: function () {
        this.getHouseList(this.querys);
    },
    methods:{
        getHouseList:function (querys) {
            let current = this.cur;
            let data  = {
                querys: querys,
                sort: {},
                pagination: { 'current': current, 'pageSize': 8 },
            }
            $.ajax({
                type:"GET",
                url: "http://localhost:3300/room/queryRoomInfo",
                data:{
                    body:JSON.stringify(data)
                },
                success: function (res) {
                    console.log(res);
                    if (res.code === 0) {
                        this.house = res.data.docs;
                        var allpage = res.data.pagination.total
                        if (allpage > 8){
                            var All = Math.floor(allpage/8);
                            if (allpage%8 != 0) {
                                All++
                            }
                            this.all = All;
                            this.cur = res.data.pagination.current
                        } else{
                            this.all=1
                        }
                    }
                }.bind(this)
            })
        },
        btnClick: function (data) {
            if (data != this.cur) {
                this.cur = data
                this.getHouseList(this.querys);
            }
        },
        pageClick: function () {
            console.log('现在在' + this.cur + '页');
             this.getHouseList(this.querys);
        },
        searchList: function () {
            if (this.searchValue !== '') {
                let querys = {}
                this.searchType == 'direction' ? querys = {
                    direction: this.searchValue,
                    status: '0'
                } : querys = {
                    roomOrder: this.searchValue,
                    status: '0'
                }
                this.getHouseList(querys);
            } else {
                this.getHouseList(this.querys);
            }
        }
    },
    computed: {
        indexs: function () {
            var left = 1;
            var right = this.all;
            var ar = [];
            if (this.all >= 5) {
                if (this.cur > 3 && this.cur < this.all - 2) {
                    left = this.cur - 2
                    right = this.cur + 2
                } else {
                    if (this.cur <= 3) {
                        left = 1
                        right = 5
                    } else {
                        right = this.all
                        left = this.all - 4
                    }
                }
            }
            while (left <= right) {
                ar.push(left)
                left++
            }
            return ar
        }

    },
    updated:function() {
    }

    
})