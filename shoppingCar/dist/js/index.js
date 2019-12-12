define(["parabola", "jquery", "jquery-cookie"], function(parabola, $){

    function index(){
        $(function(){
			sc_num();
			sc_msg();
		    $.ajax({
			   url: "data/data.json",
			//    dataType: "json",
			   success: function(arr){
				  
					for(var i = 0; i < arr.length; i++){
						var node = $(`<li class = 'goods_item'>
							<div class = 'goods_pic'>
								<img src="${arr[i].img}" alt="">
							</div>
							<div class = 'goods_title'>
								<p>【京东超市】奥利奥软点小草莓</p>
							</div>
							<div class = 'sc'>
								<div id = "${arr[i].id}" class = 'sc_btn'>加入购物车</div>
							</div>
						</li>`)
						node.appendTo(".goods_box ul");
					}
					
			   },
			   error: function(msg){
				   console.log(msg);
			   }
		   })

		   
		   //凡是后添加的节点，我们都要通过事件委托添加事件
		   /*
		   		cookie  
				   1、只能存储字符串
				   2、最多能存4kb
				一个商品存入购物车， 商品id和商品数量

				[{id:id,num:1}, {id:id,num:1}]  转成json格式字符串存入。
				键设置  goods键
		   */
		   $(".goods_box ul").on("click", ".sc_btn", function(){
			   //加入购物车
			   var id = this.id;

			   //1、判断是否第一次添加
			   var first = $.cookie("goods") == null ? true : false;
			   if(first){
				   var arr = [{id: id, num: 1}];
				   $.cookie("goods", JSON.stringify(arr), {
					   expires: 7
				   })
			   }else{
					//2、判断之前是否添加过
					var cookieStr = $.cookie("goods");
					
					var cookieArr = JSON.parse(cookieStr);
					var same = false; //假设不存在
					for(var i = 0; i < cookieArr.length; i++){
						//存在
						if(cookieArr[i].id == id){
							same = true;
							cookieArr[i].num++;
							break;
						}
					}
					//3、判断不存在
					if(!same){
						//新增记录
						var obj = {id: id, num: 1};
						cookieArr.push(obj);
					}

					//将处理完的数据存入cookie
					$.cookie("goods", JSON.stringify(cookieArr), {
						expires: 7
					})

			   }
			   sc_num();
			   sc_msg();

               ballMove(this);
		   })

		   //给右侧购物车添加移入移出
		   $(".sc_right").mouseenter(function(){
				$(this).stop().animate({
					right: 0
				}, 500);
		   })
		   $(".sc_right").mouseleave(function(){
				$(this).stop().animate({
					right: -270
				}, 500);
			})



            //给购物车内每一个商品添加删除按钮
            $(".sc_right ul").on("click", ".delete_goodsBtn", function(){
                //知道当前删除这个商品的id是谁
                var id = $(this).closest("li").attr("id");
                
                var cookieArr = JSON.parse($.cookie("goods"));
                for(var i = 0; i < cookieArr.length; i++){
                    if(cookieArr[i].id == id){
                        cookieArr.splice(i, 1);
                        break;
                    }
                }
                //判断数组是否为空数组
                if(!cookieArr.length){
                    $.cookie("goods", null);
                }else{
                    $.cookie("goods", JSON.stringify(cookieArr), {
                        expires: 7
                    })
                }

                //清除页面上的节点
                $(this).closest("li").remove();

                //重新计算购物车内商品的总数
                sc_num();

            })


            //给购物车内商品数量+和-，添加点击事件
            $(".sc_right ul").on("click", ".sc_goodsNum button", function(){
                var id = $(this).closest("li").attr("id");

                var cookieArr = JSON.parse($.cookie("goods"));
                for(var i = 0; i < cookieArr.length; i++){
                    if(cookieArr[i].id == id){
                        //判断你是+还是-
                        if(this.innerHTML == "+"){
                            cookieArr[i].num++;
                        }else{
                            cookieArr[i].num == 1 ? alert("数量不能小于1") : cookieArr[i].num--;
                        }
                        break;
                    }
                }

                $(this).nextAll("span").html(`商品数量：${cookieArr[i].num}`);
                //存回cookie里
                $.cookie("goods", JSON.stringify(cookieArr), {
                    expires: 7
                })
                sc_num();

            })
		  

		   //计算购物车里商品总数
		   function sc_num(){
				var cookieStr = $.cookie("goods");
				if(cookieStr){
					var cookieArr = JSON.parse(cookieStr);
					var sum = 0;
					for(var i = 0; i < cookieArr.length; i++){
						sum += cookieArr[i].num;
					}	

					$(".sc_right .sc_num").html(sum);
				}else{
					$(".sc_right .sc_num").html(0);
				}
		   }

           //抛物线运动

           function ballMove(oBtn){
               //oBtn节点当前加入购物车的按钮

               //1、现将小球显示，并且小球的位置移动到点击按钮的位置
               $("#ball").css({
                   display: 'block',
                   left: $(oBtn).offset().left,
                   top: $(oBtn).offset().top
               })

               var X = $(".sc_right .sc_pic").offset().left - $(oBtn).offset().left;
               var Y = $(".sc_right .sc_pic").offset().top - $(oBtn).offset().top;
               //2、创建一个抛物线对象
               var bool = new Parabola({
                    el: "#ball",
                    offset: [X, Y],
                    duration: 500,
                    curvature: 0.001,
                    callback: function(){
                        $("#ball").hide();
                    }
               })

               bool.start();
           }

           //清空购物车
           $("#clearBtn").click(function(){
                //1、清楚本地cookie数据
                $.cookie("goods", null);
                //2、将页面上的数据清空
                sc_num();
                sc_msg();
           })


		   //加载购物车中商品列表
		   /*
				   cookie里面只存储了id和数量
				   商品信息
		   */
		   function sc_msg(){

				// $(".sc_right ul").html("");

				$(".sc_right ul").empty(); //清空该节点下的所有子节点
				$.ajax({
					url: "data/data.json",
					success: function(arr){
						//arr 所有商品的数据
						var cookieStr = $.cookie("goods");
						if(cookieStr){
							var cookieArr = JSON.parse(cookieStr);
							var newArr = [];

							for(var i = 0; i < arr.length; i++){
								for(var j = 0; j < cookieArr.length; j++){
									if(arr[i].id == cookieArr[j].id){
										arr[i].num = cookieArr[j].num;
										newArr.push(arr[i]);
										break;
									}
								}
							}

							// console.log(newArr);

							//通过循环创建节点添加到页面上
							for(var i = 0; i < newArr.length; i++){
								var node = $(`<li id = "${newArr[i].id}">
											<div class = 'sc_goodsPic'>
												<img src="${newArr[i].img}" alt="">
											</div>
											<div class = 'sc_goodsTitle'>
												<p>这是商品曲奇饼干</p>
											</div>
											<div class = 'sc_goodsBtn'>购买</div>
                                            <div class = 'delete_goodsBtn'>删除</div>
											<div class = 'sc_goodsNum'>
                                                <button>+</button>
                                                <button>-</button>
                                            <span>商品数量：${newArr[i].num}</span></div>
										</li>`);
								node.appendTo(".sc_right ul");
							}


						}
					},	
					error: function(msg){
						console.log(msg);
					}
				})
		   }
	   })

    }

    return {
        index: index
    }
})