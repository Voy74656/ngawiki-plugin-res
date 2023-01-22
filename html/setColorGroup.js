function getUrlParam(paraName) {
	// 获取当前的url地址,这样我们便可以拿到这个参数.
	var url = document.location.toString();
    //alert(url);
    // 通过"?"对url进行切割,?后面的便是参数了
    var arrObj = url.split("?");
    //orrObj是一个数组,数组的0索引是url地址,1索引便是参数的名字和值了,如(id=1)
    if (arrObj.length > 1) {
    // 如果有传递过来参数,我们便使用"&"继续将参数进行切割如(id=1&name=abc)
        var arrPara = arrObj[1].split("&");
        var arr;
    // 如果有多个参数就遍历参数的数组    
        for (var i = 0; i < arrPara.length; i++) {
        //我们可以看到每个参数的名字和值是以"="分割的,那么我们可以继续切割然后得到参数的名字和对应的值
            arr = arrPara[i].split("=");
            // 如果这个参数的名字我们想要的参数,就返回这个参数的值
            if (arr != null && arr[0] == paraName) {
                return arr[1];
            }
        }
        // 否则就返回"",表示地址中有参数,但是没有我们想要的
        return "";
    }
    else {
	    // 返回"" 表示当前地址只是一个简单的url地址,并不携带参数
        return "";
    }
}

function _set_style(regular, thin, thinner, dark){
    document.documentElement.style.setProperty('--c-regular', regular)
    document.documentElement.style.setProperty('--c-thin', thin)
    document.documentElement.style.setProperty('--c-thinner', thinner)
    document.documentElement.style.setProperty('--c-dark', dark)
    
}
function setColorGroup(){
    // element = getUrlParam('element')
    element = document.getElementById("element").innerHTML
    switch (element) {
        case "pyro": _set_style('#ec4923', '#f67759', '#f69982', '#99270b'); break; //火
        case "hydro": _set_style('#00BFFF', '#40cfff', '#73dcff', '#007ca6'); break;  //水
        case "anemo": _set_style('359697', '#68cbcb', '#83cbcb', '#116262'); break;  //风
        case "electro": _set_style('#945DC4', '#b889e2', '#c3a0e2', '#521e7f'); break; //雷
        case "dendro": _set_style('#66AD16', '#95d64a', '#a6d66f', '#407007'); break; //草
        case "cryo": _set_style('#4682B4', '#76acda', '#90b8da', '#174a75'); break; //冰

        case "geo": _set_style('#DEBD6C', '#efd493', '#efdbab', '#907123'); break; //岩
        case "火": _set_style('#ec4923', '#f67759', '#f69982', '#99270b'); break; //火
        case "水": _set_style('#00BFFF', '#40cfff', '#73dcff', '#007ca6'); break;  //水
        case "风": _set_style('359697', '#68cbcb', '#83cbcb', '#116262'); break;  //风
        case "雷": _set_style('#945DC4', '#b889e2', '#c3a0e2', '#521e7f'); break; //雷
        case "草": _set_style('#66AD16', '#95d64a', '#a6d66f', '#407007'); break; //草
        case "冰": _set_style('#4682B4', '#76acda', '#90b8da', '#174a75'); break; //冰
        case "岩": _set_style('#DEBD6C', '#efd493', '#efdbab', '#907123'); break; //岩
        default: _set_style('#171717','#6b6b6b','#717171','#000000');
    }
}
