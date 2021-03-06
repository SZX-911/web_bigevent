$(function(){
  let layer = layui.layer
   // 1.1 获取裁剪区域的 DOM 元素
   let $image = $('#image')
   // 1.2 配置选项
   const options = {
     // 纵横比 / 拖动框 
     aspectRatio: 1,
     // 指定预览区域
     preview: '.img-preview'
   }
 
   // 1.3 创建裁剪区域
   $image.cropper(options) 

   
    // 点击上传按钮  绑定事件-你点击他了 就好比你点击文件框弹出来
   $('#btnChooseImage').on('click', function() {
    $('#file').click()
  })
  // 为文件框绑定change事件
  $('#file').on ('change',function(e){
    // console.log(e); 用e.target 选择用户的事件
    let filelist = e.target.files
    if(filelist.length===0){
      return '请选择图片 '
    }
 // 1. 拿到用户选择的文件
  var file = e.target.files[0]
  // 2. 将文件，转化为路径  可以获取当前文件的一个内存URL
  var imgURL = URL.createObjectURL(file)
  // 3. 重新初始化裁剪区域
  $image
    .cropper('destroy') // 销毁旧的裁剪区域
    .attr('src', imgURL) // 重新设置图片路径
    .cropper(options) // 重新初始化裁剪区域
})

// - 为确定按钮，绑定点击事件
// - 要拿到用户裁剪之后的头像
//   - 创建一个 Canvas 画布，将 Canvas 画布上的内容，转化为 `base64` 格式的字符串
  $('#btnUpload').on('click',function(){
    //拿到用户裁剪的数据-裁减之后的头像
    let $image = $('#image')
    let  dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
      // console.log(66);
        // 把base64 格式的字符串 放到服务器里
      $.ajax({
        method:'POST',
        url:'/my/update/avatar',
        data:{
          avatar:dataURL
        },
        
        success:function(res){
          console.log(69);
          if(res.status !==0){
            return layer.msg('更换头像失败')
          }
          layer.msg('更换头像成功')
          window.parent.getUserInfo()
        }

      })
  })

})