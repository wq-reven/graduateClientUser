import '../css/index.css';
const md5 = require('md5')

/**
 * 登录方法
 */
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
                if (res.data.dbResult === '验证码错误') {
                    $('#phoneCode_error').show();
                } else if (res.data.dbResult !== '登录失败') {
                    sessionStorage.setItem('userInfo', JSON.stringify(res.data.dbResult));
                    location.assign('index.html');
                    // setCookie('hlplayer', JSON.stringify(res.data), 1);
                    // location.assign('index.html');
                }
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
                if (res.data.dbResult !== '登录失败') {
                    sessionStorage.setItem('userInfo', JSON.stringify(res.data.dbResult));
                    location.assign('index.html');
                    // setCookie('hlplayer', JSON.stringify(res.data), 1);
                    // location.assign('index.html');
                } else {
                    layer.msg('用户名或密码错误！',{offset: '100px'});
                }
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

    /**
     * 
     * 设置cookie
     * @param {any} cname 
     * @param {any} cvalue 
     * @param {any} exdays 
     */
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        var domain = '.hlconnect.cn';
        document.cookie = cname + "=" + cvalue + ";" + expires + '; path=/; domain=' + domain;
    }
});

