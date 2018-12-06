$(function($){
var $theadcheckbox=$('thead input')
var $tbodycheckboxs=$('tbody input')
var $btndelete=$('#btn_delete')

var allcheckeds=[]
$tbodycheckboxs.on('change',function(){
  var id=$(this).data('id')

  if($(this).prop('checked')){
    allcheckeds.push(id)
  }else {
    allcheckeds.splice(allcheckeds.indexOf(id),1);
  }
  allcheckeds.length ? $btndelete.fadeIn() : $btndelete.fadeOut();
  $btndelete.prop('search','?id='+allcheckeds)
})

$theadcheckbox.on('change',function(){
  allcheckeds=[]

  var checked=$(this).prop('checked')

  $tbodycheckboxs.prop('checked', checked).trigger('change')

})
})
