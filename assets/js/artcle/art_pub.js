$(function () {
  let form = layui.form;
  initCate();
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("初始化文章分类失败！");
        }
        // 调用模板引擎，渲染分类的下拉菜单
        let htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        form.render();
      },
    });
  }

  // 调用 `initEditor()` 方法，初始化富文本编辑器
  initEditor();

  // 实现基本裁剪效果
  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  // 为选择封面的按钮，绑定点击事件处理函数
  $("#btnChooseImage").on("click", function () {
    $("#coverFile").click();
  });
  // 监听 `coverFile`--input-文件-文本框 的 `change` 事件，获取用户选择的文件列表
  $("#coverFile").on("change", function (e) {
    let files = e.target.files; // 获取到文件的列表数组 用来判断
    if (files === 0) {
      //判断是否选择文件
      return "请选择图片";
    }
    let file = e.target.files[0]; //获取文件第一个
    let newImgURL = URL.createObjectURL(file); //创建url地址
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  let art_state = "已发布"; //默认设置为发布
  // 当点击的时候是草稿
  $("#btnSave2").on("click", function () {
    art_state = "草稿";
  });
  // 为表单绑定 `submit` 提交事件
  $("#form-pub").on("submit", function (e) {
    // 1. 阻止表单的默认提交行为
    e.preventDefault();
    // let fd = $(this).serialize()//name=ewe$ 传入
    // 2. 基于 form 表单，快速创建一个 FormData 对象
    let fd = new FormData($(this)[0]); //带文件传人
    fd.append("state", art_state); // 3. 将文章的发布状态，存到 fd 中

    // 4. 将封面裁剪过后的图片，输出为一个文件对象
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {     // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作


        // 5. 将文件对象，存储到 fd 中
        fd.append("cover_img", blob);
        // 调用发起ajax请求
        publishArticle(fd);
      });

    // console.log(23);
  });
  //发起ajax请求实现发布文章
  // - 定义一个发布文章的方法
  // - 注意：如果是提交的是`FormData`格式数据，
  // 需要添加 `contentType：false ，processData：false`
  function publishArticle(fd) {
    $.ajax({
      method: "POST",
      url: "/my/article/add",
      data: fd,
      // 注意：如果向服务器提交的是 FormData 格式的数据，
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("发布文章失败！");
        }
        layer.msg("发布文章");
        location.href = "/article/art_list.html";
        // window.parent.$('#lb').click()
      },
    });
  }
});
