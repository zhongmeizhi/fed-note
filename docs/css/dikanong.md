# 迪卡侬官网学习


### 商品分类
使用 float: left; 布局，且第一个设置 `clear: left;`

在子元素中设置2个div，后一个div 300%宽度


###  float产生乱序问题

<div class="box">
    <div class="item">
    </div>
</div>

// 偶数会乱序

.box {
  float: left;
  width: 33%;
}

.box:nth-child(3n+1){
  clear: left;
}