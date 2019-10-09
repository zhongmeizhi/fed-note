# HEX 转换 RGB

### 转换代码
```
    function transformRGB(x){  
        var sColor = x.toLowerCase();  
        if(sColor && reg.test(sColor)){  
            if(sColor.length === 4){  
                var sColorNew = "#";  
                for(var i=1; i<4; i+=1){  
                    sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));     
                }  
                sColor = sColorNew;  
            }  
            //处理六位的颜色值
            var sColorChange = [];  
            for(var i=1; i<7; i+=2){  
                sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));    
            }  
            //转换为rgb，此时不用传递参数
             return "rgb(" + sColorChange.join(",") + ")";

        }else{  
            return sColor;    
        }  
    }; 
```

### 使用场景

比如: 

通过检测 RGB 是否均大于某个值(比如 239), 大于该值则颜色为淡色

执行操作

颜色是否淡色 ? 淡色规则 A : 深色 规则 2