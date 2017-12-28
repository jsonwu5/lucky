
var userList = [];      // 抽奖名单数组
var ucount = 0;         // 抽奖名单数组长度
var num = 0;            // 抽奖随机数
var user = $("#user");  // 抽奖名单DOM对象
var runing = false;     // 是否正在运行
var count = 0;          // 抽奖回合计数（默认三回合）

/**
 * 导入抽奖名单
 */
function openDialog() {
    layer.prompt({
        title: '导入名单',
        formType: 2,
        value: '每一行为一个抽奖名额，多个名额请使用回车换行或空格隔开。',
        area: ['800px', '350px'] // 自定义文本域宽高
    }, function (value, index, elem) {
        layer.close(index);
        userList = value.split(/\D/);
        ucount = userList.length - 1;
        console.log(userList);
        var html = "", count = 0;
        for (var i = 0; i < userList.length; i++) {
            html += '<li><div class="portrait" style="background-image:url(\'./img/head.jpg\')"></div><div class="luckuserName">' + userList[i] + '</div></li>';
            count++;
        }
        $("#userlist").append(html);
        $('#start').text('开始抽取三等奖');
        $('#prize').css('background-image','url(./img/FloralMug.png)');
        layer.msg('抽奖名单导入成功!一共：' + count + '个',{icon:6});
    });
}

/**
 * 随机跳动抽奖名单
 */
function startNum() {
    // 取一个随机数
    num = Math.floor(Math.random() * ucount);
    console.log("ucount：%s,num：%s", ucount, num);
    $("#user").html(userList[num]);
    // 无限循环，0秒一次
    t = setTimeout(startNum, 0);
}

/**
 * 停止跳动
 */
function stop() {
    clearTimeout(t);
    t = 0;
}

/**
 * 开始 & 停止
 */
function start() {
    console.log("runing:",runing);
    if (runing === false) { // 未运行
        if (ucount <= 3) {
            layer.msg('抽奖人数不足3人', {
                anim: 6
            });
        } else {
            console.log("抽奖开始");
            $('#start').text('停止');
            count++;        // 运行计数 +1
            runing = true;  // 设置运行状态
            user.attr("style","");
            startNum();     // 开始随机滚动
            console.log("开始随机滚动抽奖名单");
        }
    }else {
        // 停止跳动
        stop();
        // 设置停止状态
        runing = false;
        // 获取奖品图片url
        var prizeImg = $('#prize').css('background-image').split("\"")[1];
        console.log("prizeImg:%s,userList[num]:%s",prizeImg,userList[num]);
        // 打印中奖者名单
        $('#luckUserList').prepend('<li><div class="portrait" style="background-image:url('+prizeImg+')"></div><div class="luckuserName" data-value="'+ count +'">' + userList[num] + '</div></li>');
        console.log("count:%s",count);
        // 更新奖品图片
        switch (count){
            case 1:
                $('#start').text("开始抽取二等奖");
                $('#prize').css('background-image','url(./img/DaisyHat.png)');
                break;
            case 2:
                $('#start').text("开始抽取一等奖");
                $('#prize').css('background-image','url(./img/Sweatshirt.png)');
                break;
            case 3:
                $('#start').text("抽奖结束").attr("onclick","");
                $('#prize').css('background-image','url(./img/jfla.jpg)');
                break;
        }
        // 在userList数组中查找抽中的号码在数组中的索引
        var index = $.inArray(userList[num], userList);
        console.log("userList:%o,index:%s",userList,index);
        // 将已中奖者从数组中"删除",防止二次中奖
        // 从第index个开始，删除一个并返回删除后的数组
        userList.splice(index, 1);
        console.log("userList2:%o",userList);
    }
}

/**
 * 导出中奖人
 */
$("#drawList").click(function () {
    var luckUser = [], html = "";
    $(this).parent().prev().find("li").each(function (index,element) {
        luckUser[index] = $(element).find(".luckuserName").text();
    });
    if(luckUser.length === 3){
        html = '一等奖（卫衣）：' + luckUser[0] + '\n二等奖（帽子）：' + luckUser[1] + '\n三等奖（花杯）：' + luckUser[2];
    }else if(luckUser.length === 2){
        html = '一等奖（卫衣）：' + '待抽取' + '\n二等奖（帽子）：' + luckUser[0] + '\n三等奖（花杯）：' + luckUser[1];
    }else if(luckUser.length === 1){
        html = '一等奖（卫衣）：' + '待抽取' + '\n二等奖（帽子）：' + '待抽取' + '\n三等奖（花杯）：' + luckUser[0];
    }else{
        html = '一等奖（卫衣）：' + '待抽取' + '\n二等奖（帽子）：' + '待抽取' + '\n三等奖（花杯）：' + '待抽取';
    }
    layer.prompt({
        title: '中奖用户名单',
        formType: 2,
        value: html,
        area: ['400px', '100px'] // 自定义文本域宽高
    }, function (value, index, elem) {
        layer.close(index);
    });
});

