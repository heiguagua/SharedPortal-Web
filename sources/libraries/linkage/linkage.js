/*
desc:linkage
author:xulan
date:06/16/2017
*/

//一个匿名自执行函数，划分一个独立的作用域，不至于插件中的变量干扰jquery

;
exports =>{
  $(function(){
  $.fn.linkage = function(options) {
    var $obj = this;
    //默认参数
    var defaluts = {
      url: '',
      data: null,
      params: {
        "id": 1
      },
      align: 'left',
      btn_text:'确定',
      multiple_selectable: true,
      parent_selectable: false,
      selected_datas: null,
      onConfirm: null,
      onExpandNode: null,
      onNodeClick:null,
      onNodeRemoved:null,
      getValue: function() {
        return false;
      }
    };
    $obj.getDatas = function() {
      var selected_datas = [];
      $obj.find('.selection-selected').each(function() {
        selected_datas.push($(this).data());
      });
      return selected_datas;
    }
    $obj.setData = function(data) {
      options.data = data;
      methods['init'](options);
    }
    var loading = function(dom) {
      dom.append("<div class='loading-ajax'><div><div class='load-container'><div class='loader'>Loading</div><p>加载中</p></div></div></div>");
    }
    var loaded = function(dom) {
      dom.find('.loading-ajax').remove();
    }
    var methods = {
      /**
       * 初始化方法
       * @param _options
       * @return {*}
       */
      init: function(_options) {
        var opts = $.extend({}, defaluts, _options);
        return $obj.each(function() {
          var _oSelf = $(this);
          var selected_data_list = [];
          var other_param = ''; // 除id以外的其他参数

          // 初始化函数
          var _init = function() {
            // 初始化数据
            _initData();
            _loadEvent();
            _searchEvent();
          }

          var _initData = function() {
            var param_str = '';
            for (attr in opts.params) {
              if (attr != 'p_no') {
                other_param += '&' + attr + '=' + opts.params[attr];
              }
              param_str += '&' + attr + '=' + opts.params[attr];
            }
            param_str = param_str.substring(1);
            other_param = other_param.substring(1);

            $.ajax({
              url: opts.url + "?" + param_str,
              xhrFields:{
                withCredentials:true
              },
              type: 'get',
              "dataType": "json",
              success: function(res) {
                console.log(res)
               var data = res.body;
               
                _initContent(data);
              }
            });
          };


          // event
          var _tabEvent = function() {
            _oSelf.find('.selection-tabs>li').unbind("click").bind('click', (function(ev) {
              ev.stopPropagation();
              if (!$(this).hasClass('curr')) {
                var tab_index = $(this).index();
                _oSelf.find('.selection-tabs li:gt(' + tab_index + ')').remove();
                $(this).addClass('curr');
                _oSelf.find('.selection-list-wrap:gt(' + tab_index + ')').remove();
                _oSelf.find('.selection-list-wrap').eq(tab_index).show();
                if (tab_index >= 2) {
                  _oSelf.find('.selection-wrap').css({
                    "width": (tab_index + 1) * 100 + "px"
                  });
                } else {
                  _oSelf.find('.selection-wrap').css({
                    "width": (tab_index + 1) * 150 + "px"
                  });
                }
                _oSelf.find('.selection-selected').each(function() {
                  var data_level = Number($(this).attr('data-level'));
                  var data_id = $(this).attr('data-selected-id');
                  if (data_level > (1 + tab_index)) {
                    // removeInitDataByCancel(data_id);//删除当前tab之后初始化的数据
                    // $(this).remove();//删除当前tab之后所选中的元素
                  }
                });
              }
            }))
          }

          var _searchEvent = function() {
            _oSelf.find('.selection-input-wrap').unbind("click").bind('click', (function(ev) {
              ev.stopPropagation();
              $(this).find('input.selection-search-field').focus();
              if (_oSelf.find('.selection-wrap').is(":hidden")) {
                _oSelf.find('.selection-wrap').show();
              }
            }))
          }


          var _loadConfirmEvent = function() { // 确定事件
            _oSelf.find('.add-confirm').unbind("click").bind('click', (function(ev) {
              if (opts.onConfirm) {
                var selectedDatas = $obj.getDatas();
                opts.onConfirm(selectedDatas);
                console.log(selectedDatas)
              }
              _oSelf.find('.selection-wrap').hide();
            }));
          }


          var _loadEvent = function() {
            // 选项下一级标志点击事件
            _oSelf.find('.s-item .selection-open-child').unbind("click").bind('click', (function(ev) {
              ev.stopPropagation();

              var $itemDomObj = $(this).parent();
              var data_index = Number($itemDomObj.parent().attr('data-index'));
              var data_id = $itemDomObj.attr('data-id');
              var has_leaf = $itemDomObj.attr('data-has-leaf');
              _oSelf.find('.selection-selected[data-selected-id=' + data_id + ']').remove();

              var custom_url = opts.url + "?" + other_param + "&p_no=" + data_id;
              if(opts.onExpandNode) {// 获取回调函数返回值
                var returned_url = opts.onExpandNode(data_index,data_id,has_leaf);
                custom_url = returned_url?returned_url:custom_url;
              }

              $itemDomObj.removeClass('selected');
              loading(_oSelf.find('.selection-wrap'));
              $.ajax({
                 url: custom_url,
                // url: "http://localhost:5001/api/linkage" + data_index,
                type: 'get',
                xhrFields:{
                withCredentials:true
              },
                "dataType": "json",
                success: function(res) {
                  var data = res.body;
                  var list_tmp = '';
                  var selected_items = [];
                  _oSelf.find('.selection-selected[data-level=' + (1 + data_index) + ']').each(function(item) {
                    selected_items.push($(this).attr("data-selected-id"));
                  })

                  for (var i = 0; i < data.length; i++) {
                    if (data) {
                      var data_exist = selected_items.indexOf(data[i].ids);

                      if (data[i].has_leaf == true || data[i].has_leaf == 'true') {
                        if (data_exist > -1) {
                          list_tmp += '<li class="s-item selected"  data-id=' + data[i].ids + ' data-has-leaf=' + data[i].has_leaf + '><span>' + data[i].name + '</span><a class="selection-open-child" href="javascript:;">&nbsp;&nbsp;>></a></li>';
                        } else {
                          list_tmp += '<li class="s-item" data-id=' + data[i].ids + ' data-has-leaf=' + data[i].has_leaf + '><span>' + data[i].name + '</span><a class="selection-open-child" href="javascript:;">&nbsp;&nbsp;>></a></li>';
                        }

                      } else {
                        if (data_exist > -1) {
                          list_tmp += '<li class="s-item selected"  data-id=' + data[i].ids + ' data-has-leaf=' + data[i].has_leaf + '><span>' + data[i].name + '</span></li>';
                        } else {
                          list_tmp += '<li class="s-item"  data-id=' + data[i].ids + ' data-has-leaf=' + data[i].has_leaf + '><span>' + data[i].name + '</span></li>';
                        }

                      }
                      $('.s-item[data-id=' + data[i].ids + ']').data(data[i]);
                    }
                  }
                  var list_wrap = '<ul class="selection-list-wrap" data-index=' + (1 + data_index) + ' >' + list_tmp + '</ul>';

                  if (data_index >= 2) {
                    _oSelf.find('.selection-wrap').css({
                      "width": (data_index + 1) * 100 + "px"
                    });
                  } else {
                    _oSelf.find('.selection-wrap').css({
                      "width": (data_index + 1) * 150 + "px"
                    });
                  }

                  $itemDomObj.parent().hide(); // 隐藏当前选项tab
                  _oSelf.find('.add-confirm').before(list_wrap);
                  _oSelf.find('.selection-tabs').children().removeClass('curr');
                  _oSelf.find('.selection-tabs').append('<li class="curr"><a>请选择</a></li>');

                  loaded(_oSelf.find('.selection-wrap'));
                  fillInitData();
                  _tabEvent();
                  _loadEvent();
                }
              });
            }))

            // 选项点击事件
            _oSelf.find('.selection-list-wrap .s-item').unbind("click").bind('click', (function(ev) {

              var $itemDomObj = $(this);
              var data_index = Number($itemDomObj.parent().attr('data-index'));
              var data_id = $itemDomObj.attr('data-id');
              var has_leaf = $itemDomObj.attr('data-has-leaf');

              if(opts.onNodeClick) {// 获取回调函数返回值
                opts.onNodeClick(ev,data_index,data_id,has_leaf);
              }

              if (!$itemDomObj.hasClass('selected')) {
                //  if(has_leaf == 'true' || has_leaf == true)  {
                if (opts.parent_selectable == true || opts.parent_selectable == 'true') {

                  if (opts.multiple_selectable != true && opts.multiple_selectable != 'true') { // 不可多选
                    _oSelf.find('.selection-selected').remove();
                    _oSelf.find('.s-item').removeClass('selected');
                    removeInitDataByCancel(data_id);
                  }
                  $itemDomObj.addClass('selected');
                  var selected_item = '<li class="selection-selected" data-name="' + $itemDomObj.find('span').html()  +'"  title="' + $itemDomObj.find('span').html() + '" data-level="' + data_index + '" data-selected-id="' + data_id + '"><span class="selection-remove">x</span>' + $itemDomObj.find('span').html() + '</li>';
                  _oSelf.find('.selection-search-inline').before(selected_item);

                } else {
                  if (has_leaf == 'true' || has_leaf == true) {
                    $itemDomObj.find('.selection-open-child').click();
                  } else {
                    if (opts.multiple_selectable != true && opts.multiple_selectable != 'true') { // 不可多选
                      _oSelf.find('.selection-selected').remove();
                      _oSelf.find('.s-item').removeClass('selected');
                      removeInitDataByCancel(data_id);
                    }
                    $itemDomObj.addClass('selected');
                    var selected_item = '<li class="selection-selected" data-name="'+ $itemDomObj.find('span').html() +'" title="' + $itemDomObj.find('span').html() + '" data-level="' + data_index + '" data-selected-id="' + data_id + '"><span class="selection-remove">x</span>' + $itemDomObj.find('span').html() + '</li>';
                    _oSelf.find('.selection-search-inline').before(selected_item);
                  }
                }
                //  }

              } else {
                $itemDomObj.removeClass('selected');
                _oSelf.find('.selection-selected[data-selected-id=' + data_id + ']').remove();
                removeInitDataByCancel(data_id);
              }
              _removeEvent();
            }))

            _removeEvent();
          };

          var _removeEvent = function() {
            // 已选中项删除标志点击事件
            _oSelf.find('.selection-remove').unbind("click").bind('click', (function(ev) {
              var data_id = $(this).parent().attr('data-selected-id');
              removeInitDataByCancel(data_id);
              _oSelf.find('.s-item[data-id=' + data_id + ']').removeClass('selected');
              $(this).parent().remove(); // 删除当前项

              if (opts.onNodeRemoved) {
                var selectedDatas = $obj.getDatas();
                opts.onNodeRemoved(ev,selectedDatas);
              }
            }));
          }


          // 渲染dom
          var _initContent = function(data) {
console.log(data)
            var list_tmp = ''
            for (var i = 0; i < data.length; i++) {
              if (data[i]) {
                if (data[i].has_leaf == true || data[i].has_leaf == 'true') {
                  list_tmp += '<li class="s-item" data-id=' + data[i].ids +  ' data-has-leaf=' + data[i].has_leaf + '><span>' + data[i].name + '</span><a class="selection-open-child" href="javascript:;">&nbsp;&nbsp;>></a></li>';
                } else {
                  list_tmp += '<li class="s-item"  data-id=' + data[i].ids + ' data-has-leaf=' + data[i].has_leaf + '><span>' + data[i].name + '</span></li>';
                }
                _oSelf.find('.s-item[data-id=' + data[i].ids + ']').data(data[i]);
              }
            }
            var wrap = '<div class="selection-item-list">' +
              '<ul class="selection-tabs"><li class="curr"><a>请选择</a></li></ul>' +
              '<ul class="selection-list-wrap" data-index=1 >' + list_tmp + '</ul><a class="btn btn-primary add-confirm">'+opts.btn_text+'</a></div>';
            _oSelf.find('.selection-wrap').addClass(opts.align);
            _oSelf.find('.selection-wrap').html('').append(wrap);
            _oSelf.find('.selection-selected').remove();

            fillInitData(); // 初始化已选数据
            _loadEvent();
            _loadConfirmEvent();
          };

          var fillInitData = function() {
            // 修改时，初始化已选数据
            if (opts.data) {
              if (opts.data instanceof Array) { // 判断数据是否为数组
                if (opts.multiple_selectable != true && opts.multiple_selectable != 'true') {
                  alert('传入数据有误!该项不支持多选');
                  return;
                }
                _oSelf.find('.selection-selected.inited').remove();
                for (var i = 0; i < opts.data.length; i++) {
                  var selected_item = '<li class="selection-selected inited" data-name="'+opts.data.name+'"  title="' + opts.data.name + '" data-level="' + opts.data[i].level + '" data-selected-id="' + opts.data[i].ids + '"><span class="selection-remove">x</span>' + opts.data[i].name + '</li>';
                  _oSelf.find('.selection-search-inline').before(selected_item);
                  _oSelf.find('.s-item[data-id=' + opts.data[i].ids + ']').addClass('selected');
                }
              } else if (opts.data instanceof Object) {
                var selected_item = '<li class="selection-selected inited" data-name="'+opts.data.name+ '" title="' + opts.data.name + '" data-level="' + opts.data.level + '" data-selected-id="' + opts.data.ids + '"><span class="selection-remove">x</span>' + opts.data.name + '</li>';
                _oSelf.find('.selection-selected.inited').remove();
                _oSelf.find('.selection-search-inline').before(selected_item);
                _oSelf.find('.s-item[data-id=' + opts.data.ids + ']').addClass('selected');
              } else {
                alert("数据格式有误!");
                return;
              }
            }

          }

          var removeInitDataByCancel = function(data_id) {
            if (opts.data) {
              if (opts.data instanceof Array) { // 判断数据是否为数组
                if (opts.multiple_selectable != true && opts.multiple_selectable != 'true') {
                  alert('传入数据有误!该项不支持多选');
                  return;
                }
                for (var i = 0; i < opts.data.length; i++) {
                  if (data_id != '' && data_id == opts.data[i].ids) {
                    opts.data.splice(i, 1);
                  }
                }
              } else if (opts.data instanceof Object) {
                opts.data = null;
              } else {
                alert("数据格式有误!");
                return;
              }
              // fillInitData();
            }

          }


          $(document).click(function(event) {
            var _con = _oSelf.find(".selection-wrap"); // 设置目标区域
            if (!_con.is(event.target) && _con.has(event.target).length === 0) { // Mark 1
              _oSelf.find(".selection-wrap").hide(); //消失
            }
          });

          // 初始化
          _init();

        });
      },
      getValue: function() {
        return $obj.getDatas();
      }
    };


    //检测用户传进来的参数是否合法
    // if (!isValid(options))
    //     return this;
    var method = arguments[0];
    if (methods[method]) {
      // 如果存在该方法就调用该方法
      // apply 是吧 obj.method(arg1, arg2, arg3) 转换成 method(obj, [arg1, arg2, arg3]) 的过程.
      // Array.prototype.slice.call(arguments, 1) 是把方法的参数转换成数组.
      return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof options === 'object' || !options) {
      // 如果传进来的参数是"{...}", 就认为是初始化操作.
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.pluginName');
    }



  }



  //私有方法，检测参数是否合法
  // function isValid(options) {
  //     return !options || (options && typeof options === "object") ? true : false;
  // }
  })
}