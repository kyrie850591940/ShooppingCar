//轮播图
define(["jquery"], function($){
    function banner(){
        $(function(){
            var aBtns = $("#play").find("ol").find("li");
            var aImgs = $("#play").find("ul").find("li");
            var oUl = $("#play").find("ul");
            var iNow = 0; //代表显示第几张图片
            var timer = null; 
    
            aBtns.click(function(){
                iNow = $(this).index();
                tab();
            })
    
    
            //自动轮播
            timer = setInterval(function(){
                iNow++;
                tab();
            }, 2000);
    
            
            //切换到对应的图片和对应的按钮
            function tab(){
                aBtns.attr("class", '').eq(iNow).attr("class", 'active');
                //判断
                if(iNow == aBtns.size()){
                    aBtns.eq(0).attr("class", 'active');
                }
    
                oUl.animate({
                    top: -iNow * 150
                }, 500, function(){
                    if(iNow == aBtns.size()){
                        iNow = 0;
                        oUl.css("top", 0);
                    }
                })
                document.title = iNow;
            }
    
    
            $("#play").mouseenter(function(){
                clearInterval(timer);
            }).mouseleave(function(){
                 //自动轮播
                timer = setInterval(function(){
                    iNow++;
                    tab();
                }, 2000);
            })
        })
    }
    return {
        banner: banner
    }
})