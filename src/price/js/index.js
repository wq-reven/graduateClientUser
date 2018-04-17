import '../css/index.css';
$(function() {
    // 切换标签
    var _price = $('#select_price');
    var _cacu = $('#select_cacu');
    $('.caculator').on('click', function() {
        $(this).addClass('active');
        $(this)
            .siblings()
            .removeClass('active');
        _cacu.removeClass('hide');
        _price.addClass('hide');
    });
    $('.price').on('click', function() {
        $(this).addClass('active');
        $(this)
            .siblings()
            .removeClass('active');
        _price.removeClass('hide');
        _cacu.addClass('hide');
    });

    // 计算价格
    var cdn_price = {
        tb10: {
            in: 0.272 * 1024,
            out: 0.46 * 1024,
        },
        tb50: {
            in: 0.266 * 1024,
            out: 0.42 * 1024,
        },
        tb100: {
            in: 0.24 * 1024,
            out: 0.39 * 1024,
        },
        tb1024: {
            in: 0.203 * 1024,
            out: 0.35 * 1024,
        },
        tbmore: {
            in: 0.17 * 1024,
            out: 0.35 * 1024,
        },
    };

    // 计算价格
    var p2p_price = {
        tb10: {
            in: 0.19 * 1024,
            out: 0.23 * 1024,
        },
        tb50: {
            in: 0.15 * 1024,
            out: 0.21 * 1024,
        },
        tb100: {
            in: 0.12 * 1024,
            out: 0.18 * 1024,
        },
        tb1024: {
            in: 0.1 * 1024,
            out: 0.17 * 1024,
        },
        tbmore: {
            in: 0.07 * 1024,
            out: 0.15 * 1024,
        },
    };
    $('#country_in,#country_out').on('change', function() {
        var cdn = cacu(cdn_price, $('#rmb_cdn'));
        var p2p = cacu(p2p_price, $('#rmb_p2p'));
        var save = cdn - p2p > 0 ? cdn - p2p : 0;

        save = Math.round(save * 100) / 100;

        $('#rmb_save').html(save);
    });

    function cacu(price, ele) {
        var _in = $('#country_in').val() || 0;
        var _out = $('#country_out').val() || 0;
        var price_in = 0;
        var price_out = 0;

        if (_in <= 10) {
            price_in = _in * price.tb10.in;
        } else if (_in <= 50) {
            price_in = 10 * price.tb10.in + (_in - 10) * price.tb50.in;
        } else if (_in <= 100) {
            price_in = 10 * price.tb10.in + 40 * price.tb50.in + (_in - 50) * price.tb100.in;
        } else if (_in <= 1024) {
            price_in = 10 * price.tb10.in + 40 * price.tb50.in + 50 * price.tb100.in + (_in - 100) * price.tb1024.in;
        } else {
            price_in =
                10 * price.tb10.in +
                40 * price.tb50.in +
                50 * price.tb100.in +
                900 * price.tb1024.in +
                (_in - 1024) * price.tbmore.in;
        }

        if (_out <= 10) {
            price_out = _out * price.tb10.out;
        } else if (_out <= 50) {
            price_out = 10 * price.tb10.out + (_out - 10) * price.tb50.out;
        } else if (_out <= 100) {
            price_out = 10 * price.tb10.out + 40 * price.tb50.out + (_out - 50) * price.tb100.out;
        } else if (_out <= 1024) {
            price_out =
                10 * price.tb10.out + 40 * price.tb50.out + 50 * price.tb100.out + (_out - 100) * price.tb1024.out;
        } else {
            price_out =
                10 * price.tb10.out +
                40 * price.tb50.out +
                50 * price.tb100.out +
                900 * price.tb1024.in +
                (_out - 1024) * price.tbmore.out;
        }

        var result = price_in + price_out;

        var r = Math.round(result * 100) / 100;

        ele.html(r);

        return r;
    }
});
