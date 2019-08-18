# rotatingMenu
    基于原生js实现的圆形菜单导航旋转切换，支持手动修改焦点图，可自定义焦点图动画，支持动态添加、删除元素等
## HTML内容

    <div class="circleCenter" id="circlecenter">
        <div class="bgBox">
            <img src="img/bg.jpg"/>
        </div>
        <div class='rotation-turn'>
            <div class='rotation-item'>
                <div class="rotation-animat">
                    <img src="img/img1.png"/>
                </div>
            </div>
        </div>
        <div class='rotation-turn'>
            <div class='rotation-item'>
                <div class="rotation-animat">
                    <img src="img/img2.png"/>
                </div>
            </div>
        </div>
        <div class='rotation-turn'>
            <div class='rotation-item'>
                <div class="rotation-animat">
                    <img src="img/img3.png"/>
                </div>
            </div>
        </div>
    </div>

## 模块背景
    <div class="bgBox">
        <img src="img/bg.jpg"/>
    </div>

## 单个模块结构（支持动态添加）
    <div class='rotation-turn'>
        <div class='rotation-item'>
            <div class="rotation-animat">
                <img src="img/img1.png"/>
            </div>
        </div>
    </div>

## 每个item自身动画，默认是放大 （可自定义）
    <div class="rotation-animat">
        <img src="img/img3.png"/>
    </div>

## 初始化 Rotation

<script>
    var rotation = new Rotation("circlecenter",{
        radius:200,
        focusindex:5,
        speed:800,
        callback:function(ele,index){}
    });
</script>

### 参数列表
    radius:
        类型：Number；
        默认值：200；
        是否必选：false；
        功能：大圆半径；
    focusindex:
        类型：Number；
        默认值：1；
        是否必选：false；
        功能：焦点图位置，位置排列规则是按第一象限到第四象限顺时针的方向算起
    speed:
        类型：Number；
        默认值：1000；
        是否必选：false；
        功能：旋转速率，单位（毫秒）
    speed:
        类型：Number；
        默认值：1000；
        是否必选：false；
        功能：旋转速率，单位（毫秒）
    callback:
        类型：Function；
            Function有两个两个参数：ele(触发事件的节点对象)；index(触发事件的节点对象下标)；this指向Rotation对象
        是否必选：false；
        功能：触发旋转时的回调函数
### 属性列表
    activeSlide：
        功能：获取当前焦点图dom节点的下标
### 方法列表
    init(a)：
        功能：初始化Rotation；
        参数a：
            类型：Boole；
            是否必选：false；
            使用：当动态添加元素后，初始化Rotation时，传true；
                  其他为false；
    selectedMod(a,b)：
        功能：动态选中指定下标的元素;
        参数a：
            类型：Number；
            是否必选：true；
            使用：需要选中的元素的下标；
        参数b：
            类型：Boole；
            是否必选：false；
            默认值：false；
            使用：是否触发callback；true触发；false不触发；
    destroy(a)：
        功能：销毁Rotation；
        参数a：
            类型：Boole；
            是否必选：false；
            默认值：true；
            使用：
                true: 彻底销毁Rotation对象，释放内存
                false:只是清除绑定的事件，可通过init恢复
