import '../css/index.css';
const md5 = require('md5')
//登录
$(function () {
    $('#login_mobile').click(function () {
        let data = {
            phone: $('#phoneNumber').val(),
            code: $('#phoneCode').val(),
            loginType: '1',
        }
        $.ajax({
            type: 'get',
            url: 'http://localhost:3300/user/usersLogin',
            data: {
                body: JSON.stringify(data)
            },
            contentType: 'application/json; charset=utf-8',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            },
            success: function (res) {
                // if (res.code === 420) {
                //     $('#phoneCode_error').show();
                // } else if (res.code === 200) {
                //     setCookie('hlplayer', JSON.stringify(res.data), 1);
                //     location.assign('index.html');
                // }
            },
        });
    });
    $('#login_mail').click(function () {
        let data = {
            email: $('#email').val(),
            loginType: '0',
            password: md5($('#password').val()),
        }
        $.ajax({
            type: 'GET',
            url: 'http://localhost:3300/user/usersLogin',
            data: {
                body: JSON.stringify(data)
            },
            contentType: 'application/json; charset=utf-8',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            },
            success: function (res) {
                // if (res.code === 420) {
                //     $('#code_error').show();
                // } else if (res.code === 200) {
                //     setCookie('hlplayer', JSON.stringify(res.data), 1);
                //     location.assign('index.html');
                // }
            },
        });
    });
    $('#email').blur(function () {
        changeIdenfityCode();
    });
    $('#changeCode').click(function () {
        changeIdenfityCode();
    });
    $('#idenfity_code').click(function () {
        changeIdenfityCode();
    });
    $('#phoneLogin').click(function () {
        $('.login_mail').hide();
        $('.login_mobile').show();
    });

    $('#mailLogin').click(function () {
        $('.login_mobile').hide();
        $('.login_mail').show();
    });
    $('#img_code').focus(function () {
        $('#code_error').hide();
    })
});