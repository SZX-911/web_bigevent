$(function(){
  let layer = layui.layer
  let form = layui.form
  initArtCateList()
  // 利用模板引擎渲染列表数据  模板 来从数据库获取数据
  function initArtCateList(){
    $.ajax({
      url:'/my/article/cates',
      method:'GET',
      success:function(res){
        // console.log(res);
        if(res.status!==0){
            return '失败'
        }
      let htmstr=  template('tpl-table',res)
        $('tbody').html(htmstr)
      }
    })
  }
  // 定义个变量为null
  let indexAdd = null
  // 点击添加按钮  会弹出文本框
  $('#btnAddCate').on('click',function(){

    indexAdd = layer.open({
      type: 1, 
      // area:['500px','250px'],
      area: ['500px', '300px'],
      title:'添加文章分类',
      content:  $('#dialog-add').html() //这里content是一个普通的String
    });
  })

  // 通过代理 为form-add 表单绑定submit
  $('body').on('submit','#form-add',function(e){
    e.preventDefault()
    $.ajax({
      method:'POST',
      url:'/my/article/addcates',
      data:$(this).serialize(),
      success:function(res){
        if(res.status!==0){
          return layer.msg('新增失败')
        }
        initArtCateList()
        layer.msg('新增成功')
        layer.close(indexAdd)
      }
    })

  })


  let indexEdit = null
  // 通过代理 为btn-edit 编辑/修改按钮 绑定事件
  $('tbody').on('click','.btn-edit',function(){
      // 弹出一个修改文章分类信息的层
  indexEdit = layer.open({
    type: 1,
    area: ['500px', '250px'],
    title: '修改文章分类',
    content: $('#dialog-edit').html()
  })
  // console.log(data-id);
  // 就是当你单击的时候 弹出来从数据库调用的数据显示出来
  let id = $(this).attr('data-id')
  $.ajax({
    method:'GET',
    url:'/my/article/cates/'+id,
    success:function(res){
      form.val('form-edit',res.data)
    }
  })

  })
  // 通过 事件委派 的方式，给修改按钮绑定submit事件
  $('body').on('submit','#form-edit',function(e){
    e.preventDefault()
    $.ajax({
      method:'POST',
      url:'/my/article/updatecate',
      data:$(this).serialize(),
      success:function(res){
        if (res.status !== 0) {
          return layer.msg('更新分类数据失败！')
        }
        layer.msg('更新分类数据成功！')
        layer.close(indexEdit)
        initArtCateList()
      }
    })

  })

  
  // 通过事件委托的方式 给删除的按钮 click事件
  $('body').on('click','.btn-delete',function(){
    // 获取点击该按钮 是哪个id
    let id = $(this).attr('data-id')
    layer.confirm('确定删除？', {icon: 3, title:'提示'}, function(index){
      //do something
      // ajax 向服务器访问需要时间  所以是异步 需要把 layer.close(index); 放在ajax里面最后
      $.ajax({
        method:'GET',
        url:'/my/article/deletecate/'+id,
        success:function(res){
          console.log(res);
          if(res.status!==0){
            return layer.msg('删除失败')
          }
          layer.msg('删除成功')
          initArtCateList()
          layer.close(index);

        }
      })
      
      
    });
    
  })

})