// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(option){
  // console.log(option.url)
  option.url = 'http://www.liulongbin.top:3007' +option.url
  // console.log(option.url)
  //统一 为有权限的接口  设置headers 请求头
  if(option.url.indexOf('/my/')!==-1){
    option.headers={
      Authorization: localStorage.getItem('token') || ''    }
  }
  //无论成功还是失败 执行complete
  option.complete = function(res){
    // console.log(res);
    // console.log('执行了 complete回调函数');
       
        if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
          // 强制清空 token
          localStorage.removeItem('token')
          //跳转另一个页面
          location.href = '/login.html'
        }
 
  }


})