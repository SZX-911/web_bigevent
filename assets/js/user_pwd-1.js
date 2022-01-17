$(function(){
  // console.log(33);
  let layer = layui.layer
  let form = layui.form
//  - 长度必须是6到12位
// - 不能与旧密码一致
// - 两次密码是否相同
  form.verify({
    pwd:[/^[\S]{6,12}$/,'密码必须是6-12位且不能出现空格'],//放在一个数组里
    samepwd:function(value){
      if(value===$('[name=oldPwd]').val()){
        return '新旧密码不能相同！'
      }
    },
    repwd:function(value){
      if(value!==$('[name=newPwd]').val()){
          return '两次密码不一致'
      }
    }


  })

  // 监听表单 发送请求 提交
  $('.layui-form').on('submit',function(e){
    //阻止表单默认行为
    e.preventDefault()
    $.ajax({
      method:'POST',
      url:'/my/updatepwd',
      data:$(this).serialize(),
      success:function(res){
        console.log(res);
        if(res.status!==0){
          return layer.msg('更新失敗')

        }layer.msg('更新成功')
        // 清空一下表单表面数据
        $('.layui-form')[0].reset()
      }
    })
  })
})