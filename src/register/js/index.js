import '../css/index.css';
/**
 * 发送验证邮件方法
 * @param {email}
 */
function sendEmail() {
    console.log('发送验证邮件');
    $.ajax({
        type: 'GET',
        url: 'http://10.50.16.20:7080/help/sendRegisterMail',
        data: {
            email: $('#email').val(),
        },
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
        },
        success: function(res) {
            console.log(res);
        },
    });
}
function flightHandler() {
    alert(1);
}
/**
 * 用户注册方法
 * @param {} param0
 */
function register() {
    let data = {
        email: $('#email').val(),
        nickname: $('#nickname').val(),
        password: $('#password').val(),
        phone: $('#phoneNum').val(),
        phoneVerificationCode: $('#verification').val(),
    };
    $.ajax({
        type: 'POST',
        url: 'http://10.50.16.20:7080/consoleapi/login/register',
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        },
        success: function(res) {
            console.log(res);
            // if (res.code == 200) {
            console.log('注册成功');
            $('.verification_email').css({ display: 'block' });
            sendEmail();
            //}
        },
    });
}
/**
 * 重新发送验证邮件
 * @param {}
 */
$('.sendEmail_again').click(() => {
    sendEmail();
});
/**
 * 获取验证码
 */
$('#getVerification').click(() => {
    let phoneNum = $('#phoneNum').val();
    if (phoneNum !== '') {
        if (checkMobile(phoneNum)) {
            $.ajax({
                type: 'GET',
                url: 'http://10.50.16.20:7080/consoleapi/help/sendMessage',
                data: {
                    phone: phoneNum,
                },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
                },
                success: function(res) {
                    console.log(res);
                },
            });
        } else {
            $('.phoneNumError').css({ display: 'block' });
        }
    } else {
        $('.needPhoneNum').css({ display: 'block' });
    }
});
/**
 * 表单提交事件
 */
$.validator.setDefaults({
    submitHandler: function() {
        register();
    },
});

$().ready(function() {
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
        $('.needPhoneNum').css({ display: 'none' });
        $('.phoneNumError').css({ display: 'none' });
    });
    $('.verification_confirm').click(() => {
        $('.verification_email').css({ display: 'none' });
    });
});
