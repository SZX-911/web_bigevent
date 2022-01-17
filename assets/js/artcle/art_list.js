$(function () {
  let layer = layui.layer;
  let form = layui.form;
  let laypage = layui.laypage;
  // let hasROW
  // 定义一个查询的参数对象
  // 将来请求数据的时候 需要将请求的参数对象
  // 提交服务器

  let q = {
    pagenum: 1, //页码值
    pagesize: 3, //每页显示几条数据 默认每页显示2条
    cate_id: "", //文章分类的id
    state: "", //文章发布的状态
  };

  // 获取文章数据的方法
  function initTable() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("失败");
        }
        //   res.data = [
        //     {id:1,title:'title',cate_name:'美食',pub_date:'2021-1-16 20:9:3.817',state:'草稿'},
        //     {id:2,title:'title',cate_name:'美食',pub_date:'2021-1-16 20:8:8.817',state:'草稿'},
        //     {id:3,title:'title',cate_name:'OSS',pub_date:'2021-1-16 1:4:9.817',state:'草稿'},
        //     {id:4,title:'title',cate_name:'美食',pub_date:'2021-1-16 20:8:3.817',state:'草稿'}
        // ]
        let htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        //  参数总数据  条数
        renderPage(res.total);
      },
    });
  }
  // 通过 `template.defaults.imports` 定义过滤器
  template.defaults.imports.dataFormat = function (data) {
    let dt = new Date(data);
    let y = dt.getFullYear();
    let m = String(dt.getMonth() + 1).padStart(2, "0");
    let d = String(dt.getDay()).padStart(2, "0");
    let hh = String(dt.getHours()).padStart(2, "0");
    let mm = String(dt.getMinutes()).padStart(2, "0");
    let ss = String(dt.getSeconds()).padStart(2, "0");
    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };

  // <!-- 。。  分类区域  的从数据库得到 渲染 模板引擎 -->
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取分类数据失败！");
        }
        // layer.msg('获取分类数据成功！')
        let htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        // 通知layui 重新渲染表单区域ui结构  //两个框架
        form.render();
      },
    });
  }
         
  // let q ={
  //   pagenum:1,//页码值
  //   pagesize:2,//每页显示几条数据 默认每页显示2条
  //   cate_id:'',//文章分类的id
  //   state:'' //文章发布的状态
  // }

  // 为筛选表单绑定 submit事件
  $("#form-search").on("submit", function (e) {
    e.preventDefault();
    // 获取表单的值
    let cate_id = $("[name=cate_id]").val();
    let state = $("[name= state]").val();
    // 将表单的值放在q里
    q.cate_id = cate_id;
    q.state = state;

    // 调用函数
    initCate();
  });

  // 渲染分页  把页码显示
  function renderPage(total) {
    //执行一个laypage实例

    laypage.render({
      //  - `elem`  分页容器的 id
      // - `count` 总数据条数
      // - `limit`  每页显示几条数据
      // - `curr`  设置默认被选中的分页
      elem: "pageBox", //注意，这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: q.pagesize,
      curr: q.pagenum,
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits:[2,3,5,10],
      // 当分页被切换时触发，函数返回两个参数：obj（当前分页的所有选项值）
      // 、first（是否首次，一般用于初始加载的判断）
      jump: function (obj,first) {
        //obj包含了当前分页的所有参数，比如：
        // console.log(obj);
        // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
        q.pagenum = obj.curr; //拿到最新页码值 赋值到q 查询参数对象
          // console.log(obj.limit);//通过 `obj.limit` 就能获取用户选择的是第几条
        q.pagesize = obj.limit
        //首次不执行
        if (!first) {
          //do something
          initTable()
        }
      },
    });
    // console.log(44);
  }
  // 为删除按钮绑定 自定义属性触发点击事件
  $('tbody').on('click','.btn-delete',function(){
    // 获取到文章的id
    let len =$('.btn-delete').length
    let id = $(this).attr('data-id')
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
    $.ajax({
      method:'GET',
      url:'/my/article/delete/'+id,
      success:function(res){
        if (res.status !== 0) {
          return layer.msg('删除文章失败！')
        }
        layer.msg('删除文章成功！')
        // 当数据完成后 判断当前这一页 是否还有数据
//         判断删除后，页面上是否还有数据
          if(len===1){//删完这一个 就没有数据了
              //这是页码值
       q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
   // - 判断当前页面的删除按钮的长度是否等于1
// - 如果等于1，那么我们让当前页码-1
// 即可，如果不等于1，不用处理
        initTable()
        layer.close(index)
      }
    })
   
  })
  })

  initTable();
  initCate();
});
