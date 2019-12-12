console.log("加载成功")

//配置当前 index.html 引入的所有 . js 的文件

//路径配置
require.config({
    paths: {
        "jquery": "jquery-1.11.3",
        "jquery-cookie": "jquery.cookie",
        "parabola": "parabola",
        "index": "index",
        "banner": "banner"
    },
    shim: {
		//设置jquery-cookie依赖于jquery开发的
		"jquery-cookie": ["jquery"],
		//抛物线不支持AMD规范
		"parabola": {
			exports: "_"
		}
	}
})

require(["index", "banner"], function(index, banner){
    index.index();
    banner.banner();//让轮播图效果生效
})