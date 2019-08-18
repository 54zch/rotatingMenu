/*
    author:zch
    Contact:466761312@qq.com
*/


(function(global,factory){
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) : (global = global || self, global.Rotation = factory());
}(this,function(){

    var Rotation =function Rotation(id,option){
        try {
            this.elem = document.getElementById(id);
            this.elem.setAttribute("data",this);
        } catch (error) {
            var error = "未找到id="+id+"的元素。";
            console.error(error);
            return;
        }
        this.doms = Array.prototype.slice.call(this.elem.children);
        this.doms = this.doms.filter(function(item,index){
            return item.getAttribute("class") !== 'bgBox';
        });
        this.initAngle = (360/this.doms.length).toFixed(2)-0;
        this.computAngle = 0;
        this.radius = option.radius || 200;     //大圆半径
        this.focusindex = option.focusindex || 1;     //焦点图位置
        this.focusAngle = this.initAngle * this.focusindex;
        this.speed = option.speed || 1000;     //旋转速率
        this.callback = option.callback;       //回调函数
        this.turnAngle = 0;     //转动角度
        this.bgBox = document.getElementsByClassName("bgBox");
        this.activeSlide = option.focusindex || 1;
        this.init();
    };
    Rotation.prototype = {
        isDestroy:false,
        init:function(initType){
            //动态添加元素的话，重新初始化和元素数量相关的参数
            if(initType){
                this.computAngle = 0;
                this.doms = Array.prototype.slice.call(this.elem.children);
                this.doms = this.doms.filter(function(item,index){
                    return item.getAttribute("class") !== 'bgBox';
                });
                this.initAngle = (360/this.doms.length).toFixed(2)-0;
                this.focusAngle = this.initAngle * this.focusindex;
            };
            var _this = this;
            this.isDestroy = false;
            //设置背景模块
            if(this.bgBox){
                this.bgBox[0].style.left = -this.radius+"px";
                this.bgBox[0].style.top = -this.radius+"px";
                this.bgBox[0].style.width = this.radius*2+"px";
                this.bgBox[0].style.height = this.radius*2+"px";
            };
            this.doms.map(function(val,index){

                //如果是动态添加元素的话，将每个元素及其子元素的旋转角度初始化为0
                if(initType){
                    val.style.transform = "rotate(0deg)";
                    //每个子模块倒转
                    val.children[0].style.transform = "rotate(0deg)";
                };
                //获取每个模块的初始化角度
                _this.computAngle = _this.computAngle + _this.initAngle;
                //模块在象限内的实际角度
                val.setAttribute("actualAngle",_this.computAngle);
                //保存已旋转角度
                val.setAttribute("actualRotationAngle",0);
                //保存模块的下标
                val.setAttribute("index",index);
                //保存Rotation对象
                val.rotation = _this;
                // val.setAttribute("data",_this);
                //为每个模块绑定点击事件
                val.addEventListener("click",_this.selectedMod);
                //为每个模块设置旋转速率
                val.style.transition = "all "+ (_this.speed/1000)+"s";
                val.children[0].style.transition = "all "+ (_this.speed/1000)+"s";
                //为焦点图添加class
                if(_this.focusindex === index+1){
                    val.className += ' rotation-active';
                };

                //获取模块的宽高（模块计算圆心点和定位时需要用到）
                var valH = val.offsetHeight-0,
                    valW = val.offsetWidth-0;

                //初始化各个模块的位置，以及动画原点
                if(_this.computAngle>0 && _this.computAngle<90){
                    var sideLength = _this.sideLength(_this.radius,_this.computAngle);
                        val.style.top = -sideLength.oppositeSide - valH/2+"px";
                        val.style.left = sideLength.adjacentSide - valW/2+"px";
                    var origin = "-"+(sideLength.adjacentSide - valW/2)+"px "+(sideLength.oppositeSide + valH/2)+"px";
                        val.style.transformOrigin = origin;
                }else if(_this.computAngle>89 && _this.computAngle<180){
                    var sideLength = _this.sideLength(_this.radius,_this.computAngle-90);
                        val.style.top = sideLength.adjacentSide - valH/2 + "px";
                        val.style.left = sideLength.oppositeSide - valW/2 + "px";
                    var origin = "-" + (sideLength.oppositeSide - valW/2) +"px "+(valH/2 - sideLength.adjacentSide)+"px";
                        val.style.transformOrigin = origin;

                }else if(_this.computAngle>179 && _this.computAngle<270){
                    var sideLength = _this.sideLength(_this.radius,_this.computAngle-180);
                        val.style.top = sideLength.oppositeSide - valH/2+"px";
                        val.style.left = -sideLength.adjacentSide - valW/2+"px";
                    var origin = (sideLength.adjacentSide + valW/2)+"px "+(valH/2 - sideLength.oppositeSide)+"px";
                        val.style.transformOrigin = origin;
                }else{
                    var sideLength = _this.sideLength(_this.radius,_this.computAngle-270);
                        val.style.top = -sideLength.adjacentSide - valH/2+"px";
                        val.style.left = -sideLength.oppositeSide - valW/2+"px";
                    var origin = (sideLength.oppositeSide + valW/2)+"px "+ (sideLength.adjacentSide + valH/2)+"px";
                        val.style.transformOrigin = origin;
                };
            })
        },
        selectedMod:function(index, callback){    //该方法是绑定在每个旋转元素上的，也可以通过Rotation实例调用，所以this指向不确定，需要通过判断this指向来些不同的逻辑
            var thisIndex = null;
            if(!isNaN(index)){
                thisIndex = index;
            }else{
                thisIndex = this.getAttribute("index")-0;
            };
            if(this.rotation){
                this.rotation.activeSlide = thisIndex+1;
                this.rotation.activationFun(this,thisIndex);
                this.rotation.callback(this,thisIndex+1);
            }else{
                if(this.isDestroy){
                    return false;
                }
                this.activeSlide = thisIndex;
                this.activationFun(this.doms[thisIndex-1],thisIndex-1);
                if(callback){
                    this.callback(this.doms[thisIndex-1],thisIndex)
                };
            };

        },
        sideLength:function(long,angle){
            //获得弧度
            var radian = 2*Math.PI/360*angle;
            return {
                adjacentSide:(Math.sin(radian) * long).toFixed(2)-0,//邻边A
                oppositeSide:(Math.cos(radian) * long).toFixed(2)-0//对边B
            };
        },
        activationFun:function(ele,index){

            // this.focusAngle
            _this = this;
            //如果此时选中的模块的下标和点击的模块下标相同，则不旋转
            if(this.focusindex === index+1){
                return false;
            };
            //将点击的下标赋值给选中的模块的下标
            this.focusindex = index+1;
            //获取模块的实际角度和焦点图的实际角度
            var actualAngle = ele.getAttribute("actualAngle")-0,
                focusAngle = this.focusAngle,
                rotationAngle = 0;

            //计算旋转角度
            if(Math.abs(actualAngle-focusAngle)<=180 ){
                rotationAngle = -(actualAngle-focusAngle);
            }else if(actualAngle<focusAngle-180){
                rotationAngle = -(360-focusAngle+actualAngle);
            }else if(actualAngle>focusAngle+180){
                rotationAngle = 360-actualAngle+focusAngle;
            }else if(focusAngle-180<actualAngle && actualAngle<focusAngle){
                rotationAngle = focusAngle-actualAngle;
            };
            _this.turnAngle = rotationAngle;

            this.doms.map(function(val,num){

                //每个模块在当前象限内的实际角度
                var valActualAngle = val.getAttribute("actualAngle")-0;
                val.setAttribute("actualAngle",_this.calcAngle(valActualAngle + _this.turnAngle));
                //获取旋转角度
                var actualRotationAngle = val.getAttribute("actualRotationAngle")-0;

                //旋转
                val.style.transform = "rotate("+ (actualRotationAngle + _this.turnAngle) +"deg)";
                //重新设置旋转后的旋转角度
                val.setAttribute("actualRotationAngle", actualRotationAngle + _this.turnAngle);
                //设置放大
                if(num === _this.focusindex-1){
                    val.classList.add("rotation-active");
                }else{
                    val.classList.remove("rotation-active");
                }

                //每个子模块倒转
                val.children[0].style.transform = "rotate("+ -(actualRotationAngle + _this.turnAngle) +"deg)";
            })

        },
        calcAngle:function(ang){
            if(ang>360){
                return ang - 360;
            }else if(ang<0){
                return 360 + ang;
            }else{
                return ang;
            }
        },
        hasClassFun:function( element, cls){
            return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
        },
        destroy:function(clear){

            var _that = this;
            this.isDestroy = true;
            this.doms.map(function(ele,index){
                ele.removeEventListener("click",_that.selectedMod)
            });

            if(!(clear === false)){
                for (var k in this) {
                    delete this[k];
                }
            }
        }
    };
    return Rotation;

}))
