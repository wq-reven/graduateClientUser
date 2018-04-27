import '../css/index.css';
const md5 = require('md5');
/**
 * 用户注册方法
 * @param {} param0
 */
function register() {
    let data = {
        email: $('#email').val(),
        password: md5($('#password').val()),
        phone: $('#phoneNum').val(),
        phoneVerificationCode: $('#verification').val(),
    };
    $.ajax({
        type: 'get',
        url: 'http://localhost:3300/user/newUserRegister',
        data: {
            body: JSON.stringify(data)
        },
        contentType: 'application/json; charset=utf-8',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        },
        success: function (res) {
            if (res.code == 0) {
                location.href = 'regisjump.html'
            } else if (res.data.dbResult == '验证码错误') {
                layer.msg('验证码错误,请重新获取', {
                    offset: '100px'
                })
            } else if (res.data.ok == 2) {
                layer.msg('手机号已被注册,请重试！', {
                    offset: '100px'
                });
            } else {
                layer.msg('注册失败，请重试！', {
                    offset: '100px'
                });
            }
        },
    });
}

/**
 * 表单提交事件
 */
$.validator.setDefaults({
    submitHandler: function () {
        register();
    },
});

$().ready(function () {
    /**
     * 表单验证规则
     */
    $('#commentForm').validate({
        debug: true,
        rules: {
            email: {
                required: true,
                email: true,
            },
            password: {
                required: true,
                minlength: 6,
            },
            confirm_password: {
                required: true,
                minlength: 6,
                equalTo: '#password',
            },
            nickname: {
                required: true,
            },
            verification: {
                minlength: 4,
                required: true,
            },
        },
        messages: {
            email: {
                required: '请输入邮箱地址',
                email: '请输入一个正确的邮箱',
            },
            password: {
                required: '请输入密码',
                minlength: '长度至少为6位',
            },
            confirm_password: {
                required: '请再次确认密码',
                minlength: '长度至少为6位',
                equalTo: '两次输入不相同',
            },
            nickname: {
                required: '请输入用户昵称',
            },
            verification: {
                minlength: '验证码输入有误',
                required: '请输入验证码',
            },
        },
    });
    /**
     * 全局样式
     */
    $('#phoneNum').focus(() => {
        $('.needPhoneNum').css({
            display: 'none'
        });
        $('.phoneNumError').css({
            display: 'none'
        });
    });
    $('.verification_confirm').click(() => {
        $('.verification_email').css({
            display: 'none'
        });
    });
});