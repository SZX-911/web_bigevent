
  // let layer = layui.layer
  function getUserInfo(){
    $.ajax({
      method:'GET',
      url:'/my/userinfo',
      // Headers 请求头  这个是有权限的接口
      // 以 /my 开头的请求路径，
      // 需要在请求头中携带 Authorization 身份认证字段，
      // 才能正常访问成功
      // headers:{
      //   Authorization: localStorage.getItem('token') || ''
      // },
      success:function(res){
        // console.log(res);
        // console.log(res.data);
        if(res.status!== 0){
          // return layer.msg('获取用户信息')
          return layui.layer.msg('获取用户信息失败！')
        }
        // console.log('成功');
        // layui.layer.msg('999')
        
        renderAvatar(res.data)
      },
      // complete:function(res){
      //   console.log(res);
      //   console.log('执行了complete函数')
      //   if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
      //     localStorage.removeItem('token')
      //     location.href = '/login-1.html'
      //   }
      // }
   
    })
  } 


  getUserInfo()
  let layer = layui.layer
  $('#btnLogout').on('click',function(){
    // 从layui中的  提示用户是否确认退出 询问框
    layer.confirm('确定退出登录？',{icon:3,title:'提示'},function(index){
      //清除本地存储的token
      localStorage.removeItem('token')
      //跳转另一个页面
      location.href='/login.html'
      //关闭confirm 询问框
      layer.close(index)
    })
  })

      //渲染用户信息
     function renderAvatar(user){
       let name = user.nickname || user.username
       $('#welcome').html('欢迎 &nbsp;' +name)
       if(user.user_pic!==null){
        console.log( $('.layui-nav-img'));
         $('.text-avatar').hide()
         $('.layui-nav-img').attr('src',user.user_pic).show()
       }else{
        $('.layui-nav-img').hide()
          let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
       }

     }
