$(function(){
  let form = layui.form
  let layer = layui.layer
  // layui里的表达式
  form.verify({
    nickname:function(value){
      if(value.length>6){
        return '昵称长度必须在1~6个字符之间'
      }
    }
  })
  initUserInfo()
  // 获取用户初始化修改用户信息
  function initUserInfo(){
    $.ajax({
      method:'GET',
      url:'/my/userinfo',
      success:function(res){
        if(res.status!==0){
          return layer.msg('获取用户信息失败')
        }
        console.log(res);
        // 调用 `form.val()` 方法为表单赋值
        form.val('formUserInfo',res.data)
      }

    })
  }
  //重置表单数据
  $('#btnReset').on('click',function(e){
    // 阻止表单的默认重置行为
    e.preventDefault()
    //渲染
      initUserInfo()
  })
  //监听表单 发起请求用户信息
  $('.layui-form').on('submit',function(e){
    //阻止表单默认提交行为默认
    e.preventDefault()
    $.ajax({
      method:'post',
      url:'/my/userinfo',
      //快速获取这个表单里数据 提交到服务器里的数据库
      data:$(this).serialize(),
      success:function(res){
          if(res.status!==0){
            return layer.msg('更新用户信息失败！')
          }
          // console.log('ok');
          layer.msg('更新用户信息成功')
     // 调用父页面中的方法，重新渲染用户的头像和用户的信息
      window.parent.getUserInfo()
      // console.log(window.parent)
      }
    })

  })
})