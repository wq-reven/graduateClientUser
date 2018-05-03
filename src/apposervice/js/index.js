import '../css/index.css';


function submitAppo() {
    if (sessionStorage.getItem('userInfo') != null) {
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        let data = {
            name: $('#name').val(),
            appoTime: Date.parse($('#date').val()),
            roomOrder: parseInt($('#roomOrder').val()),
            email: $('#email').val(),
            phone: parseInt($('#contact').val()),
            uid: userInfo.uid,
            avatar: userInfo.avatar
        };
        console.log(data)
        $.ajax({
            type: 'get',
            url: 'http://localhost:3300/appo/addAppo',
            data: {
                body: JSON.stringify(data)
            },
            contentType: 'application/json; charset=utf-8',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            },
            success: function (res) {
                console.log(res)
                location.href = "personalcenter.html"
            },
        });
    } else {
        layer.msg('登录后才可以预约哦！',{offset: '100px'});
    }
}

/**
 * 表单提交事件
 */
$.validator.setDefaults({
    submitHandler: function () {
        submitAppo();
    },
});
$('#form').validate({
    debug: true,
    rules: {
        email: {
            required: true,
            email: true,
        },
        name: {
            required: true,
            minlength: 2,
        },
        contact: {
            required: true,
            minlength: 11,
            maxlength:11
        },
        roomOrder: {
            required: true,
        },
        appoTime: {
            minlength: 4,
            required: true,
        },
    },
    messages: {
        email: {
            required: '请输入邮箱地址',
            email: '请输入一个正确的邮箱',
        },
        name: {
            required: '请输入姓名',
        },
        contact: {
            required: '请输入手机号',
            minlength: '联系方式不正确',
            maxlength: '联系方式不正确',
        },
        appotime: {
            required: '请输入预约时间',
        },
        
    },
});