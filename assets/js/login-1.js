$(function () {
  // 点击('#link_reg')按钮 让这盒子显示  另一个盒子隐藏
  $("#link_reg").on("click", function () {
    $(".login-box").hide();
    $(".reg-box").show();
  });

  $("#link_login").on("click", function () {
    $(".reg-box").hide();
    $(".login-box").show();
  });
  //定义个变量 做弹出层
  let layer= layui.layer
  // 从layui 获取form对象
  let form = layui.form;
  form.verify({
    // 自定义 一个pwd 校验规则
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],

    username: function(value, item){ //value：表单的值、item：表单的DOM对象
      if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
        return '用户名不能有特殊字符';
      }
      if(/(^\_)|(\__)|(\_+$)/.test(value)){
        return '用户名首尾不能出现下划线\'_\'';
      }
      if(/^\d+\d+\d$/.test(value)){
        return '用户名不能全为数字';
      }
      
      //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
      if(value === 'xxx'){
        alert('用户名不能为敏感词');
        return true;
      }
    },
    repwd:function(value){
      // 拿到确认密码框的值(形参为value) 与 密码框的值 比较
      // 失败  return 返回一个提示消息
    let pwd =  $('.reg-box [name=password]').val()
      if(pwd!== value){
        return '两次密码不一致'
      }
    }
  });

  //注册提交到数据库
  $('#form_reg').on('submit',function(e){
    //阻止默认行为
    e.preventDefault()
    // 点击那个按钮 发起ajax post请求
    // http://www.liulongbin.top:3007
    $.post('/api/reguser',{
      username:$('#form_reg [name=username]').val(),
      password:$('#form_reg [name=password]').val(),
  
    },function(res){
      if(res.status!==0){
        // return console.log(res.message);
        // return console.log(111);
        return layer.msg(res.message)
      }
      // console.log('ok');
      layer.msg('注册成功，请登录')
      $('#link_login').click()
    })

  })
  //监听登录提交到服务器 数据库
  $('#form_login').on('submit',function(e){
    e.preventDefault()
    $.ajax({
      method:'post',
      url:'/api/login',
      //这个form表单的元素的集合 --快速获取表单元素
      data:$(this).serialize(),
      success:function(res){
        if(res.status!==0){
          return layer.msg(res.message)
          // return layer.msg('登录失败')
        }
        layer.msg('登陆成功')
         // 将登录成功得到的 token 字符串，保存到 localStorage 中
        //  localStorage.setItem('token', res.token)
        localStorage.setItem('token',res.token)
         // 跳转到后台主页
        location.href = '/index-1.html'

      }

    })
  })


});
