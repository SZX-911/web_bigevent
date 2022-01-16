$(function(){
  let layer = layui.layer
  // 定义一个查询的参数对象 
  // 将来请求数据的时候 需要将请求的参数对象 
  // 提交服务器

  let q ={
    pagenum:1,//页码值
    pagesize:2,//每页显示几条数据 默认每页显示2条
    cate_id:'',//文章分类的id
    state:'' //文章发布的状态
  }

  // 获取文章数据的方法
  function initTable(){
    $.ajax({
      method:'GET',
      url:'/my/article/list',
      data:q,
      success:function(res){
        if(res.status!==0){
          return layer.msg('失败')
        }
        res.data = [
          {id:1,title:'title',cate_name:'美食',pub_date:'2021-1-16 20:9:3.817',state:'草稿'},
          {id:2,title:'title',cate_name:'美食',pub_date:'2021-1-16 20:8:8.817',state:'草稿'},
          {id:3,title:'title',cate_name:'OSS',pub_date:'2021-1-16 1:4:9.817',state:'草稿'},
          {id:4,title:'title',cate_name:'美食',pub_date:'2021-1-16 20:8:3.817',state:'草稿'}
      ]
        let htmlStr= template('tpl-table',res)
        $('tbody').html(htmlStr)
        // renderPage(res.total)
      }
    })
  }
  // 通过 `template.defaults.imports` 定义过滤器
  template.defaults.imports.dataFormat = function(data){
    let dt = new Date(data)
    let y = dt.getFullYear()
    let m =String(dt.getMonth()+1).padStart(2,'0')
    let d =String(dt.getDay()).padStart(2,'0')
    let hh = String(dt.getHours()).padStart(2,'0')
    let mm = String(dt.getMinutes()).padStart(2,'0')
    let ss = String(dt.getSeconds()).padStart(2,'0')
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  initTable()
  initCate()
  function initCate(){
    $.ajax({
        method:'GET',
      url:'/my/article/cates',
      success:function(res){
        if(res.status!==0){
          return layer.msg('获取分类数据失败！')
        }
        // layer.msg('获取分类数据成功！')
        let htmlStr = template('tpl-cate',res)
        $('[name=cate_id]').html(htmlStr)
        
      }
    })
  }
})