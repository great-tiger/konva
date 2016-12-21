#继承关系
The stage, layers, groups, and shapes all extend Node.     

Stage->Container-Node
Group->Container->Node
Layer->BaseLayer->Container->Node    
Rect->Shape->Node  

#使用时，注意事项
Stage下只能添加Layer，不是Layer会报错的。Stage没有自己的Canvas元素。

Konva中的集合对象
Konva.Collection 继承自数组，主要提供了each方法。
把Konva.Node.prototype上的方法全部map到Konva.Collection.prototype上。
这样的话：如果一个Collection对象有10个Node对象，调用collection.method()时，会遍历该集合分别调用Node对象的相应方法。
Konva.Collection.mapMethods(Konva.Node);


Konva.idCounter++ 全局计数器，用来设置id

1、事件机制，支持自定义事件
事件机制相关的代码在基类Node.js中，记住 Node 与 Stage 支持的事件类型不一样。虽然 Stage 是 Node 的子类。比如：click contentClick
on:
   注册事件，处理程序保存到了eventListeners对象中(每一个Node都有这么一个对象)。暂不考虑事件代理。
   on("click.namespace",handler) 
   eventListener={
     "click":[
		{
			name:"namespace",
			handler:handler
	    }
     ]
   }
off:
   注销事件，从this.eventListener中删除事件处理程序。
fire: 
   function(eventType, evt, bubble)   bubble为true则表示触发事件并冒泡
   this._fireAndBubble(eventType, evt);  向父级冒泡this._fireAndBubble.call(this.parent, eventType, evt);
   this._fire(eventType, evt);  从this.eventListener中查找并触发事件处理程序，currentTarget 就是节点自己。

2、Node的初始化
   this._id = Konva.idCounter++;
   this.eventListeners = {};
   this.attrs = {};
   this._cache = {};
   this._filterUpToDate = false;
   this.setAttrs(config);  // 属性保存到attrs中
   另外还绑定了一些系统事件
3、Container的初始化
   this.children = new Konva.Collection(); //实例化集合对象
   Konva.Node.call(this, config); //直接调用基类的构造函数
   初始化过程如此简单，那就再深究一下吧，Container 到底有什么功能。
   add(child)
   destory()
   getChildren()
       get only circles
       var circles = layer.getChildren(function(node){
          return node.getClassName() === 'Circle';
       });
   hasChildren()
   removeChildren()
   destroyChildren()
   等等吧，主要集中了集合的增、删、找、克隆。剩下的就是与canvas绘画有关的api了。
4、Stage初始化
    this._buildDOM()
       构建content并append到container中 <div class="konvajs-content" role="presentation" style="position: relative;"></div>
       this.bufferCanvas = new Konva.SceneCanvas();  设置Canvas
       this.bufferHitCanvas = new Konva.HitCanvas({pixelRatio: 1});  设置Canvas
       _resizeDOM()  调整画布大小和画布容器大小
    _bindContentEvents()  
       在<div class="konvajs-content" role="presentation" style="position: relative;"></div>上绑定事件。

   Stage中重要的概念
    Stage包含多个层，每个层对应一个canvas元素。下面的代码验证了这个事实。
    add: function(layer) {
       Konva.Container.prototype.add.call(this, layer);
       layer.draw();
       this.content.appendChild(layer.canvas._canvas);
    }

    当我们调用Stage对象的draw()方法时，实质上调用的是Node.draw方法。与调用Layer.draw()方法，走的逻辑一样。
    都是遍历所有孩子，drawScene和drawHit。
    当调用Stage.draw()方法时，所有的节点都会被清除然后重画。显然有时候是没有必要的，我们调用Layer.draw就行了。
    如果我们直接调用Rect.draw()时，会调用Shape中的drawScene和drawHit方法，会在屏幕上直接画自己。原来的不会被删除。觉得这里库需要优化一下。

5、Canvas.js解析
   Konva.SceneCanvas
   Konva.HitCanvas
   都继承自Konva.Canvas，该类在初始化的时候创建了一个canvas，this._canvas，并设置了一些style。

   Konva.SceneCanvas
   Konva.HitCanvas 初始化的时候，设置this._canvas的宽高。设置对应的context,两个上下文如下：

   Konva.SceneContext(this)
   Konva.HitContext(this)  请详看Context.js解析

   其实这样的架构也很好理解。在原生Canvas中有一个Context对象。
   在Konvas中分别对原生的Canvas和Context对象进行了封装。

6、Context.js解析
   Konva.SceneContext-->>Konva.Context
   Konva.HitContext-->>Konva.Context

   Konva.Context 初始化时 设置this._context = canvas._canvas.getContext('2d');
        定义了一些与矩阵变化有关的接口(用来设置当前坐标系)
   		setTransform 调用原生setTransform方法
   		transform 调用原生的transform方法
   		translate 调用原生的translate方法
   		scale 调用原生的scale方法
   		rotate 调用原生的rotate方法
   		reset 设置单位矩阵,与原生的ResetTransform类似
   		其他api也大多是对原生api的封装

   Konva.SceneContext
        在基类的基础上提供了几个工具方法

   Konva.HitContext
        在基类的基础上提供了几个工具方法
7、Group.js解析
   定义Group中只能添加Group、Shape，其它的其实没做什么。
8、Layer.js解析
   Layer中只能添加Group、Shape
   Layer中包含自己的canvas元素,经验证一个层会生成一个canvas。
   Layer初始化时
      this.canvas = new Konva.SceneCanvas();
      this.hitCanvas = new Konva.HitCanvas({
          pixelRatio: 1
      });
9、一些全局对象意义
   Konva.shapes={ "key":"value" }  key为一个颜色值，value是一个Shape对象
10、BaseLayer.js解析
   初始化其实除了调用基类的构造函数，其它什么也没做。
   getCanvas() 返回Layer所属的SceneCanvas对象。
   getContext() 返回的是 Konva.SceneContext(this); 对象。每一个SceneCanvas对象，都有一个SceneContext上下文。
11、Shape.js解析
   初始化时，把自己保存在Konva.shapes中。
   getCanvas  调用BaseLayer.js中的getCanvas
   getContext 调用BaseLayer.js中的getContext
   destroy 销毁自己
12、Rect.js解析
   这个类继承自Shape，其实在这个类里的主要工作就是指定怎么画。即指定绘画函数 this.sceneFunc(this._sceneFunc);
13、Layer.js中draw处理流程
   调用Node.js中定义的方法
   draw: function() {
      this.drawScene(); 
      this.drawHit();
      return this;
   }

   Layer.drawScene 由子类 Layer.js 提供  默认清空画布
      接着调用Container.drawScene 在这个方法中最重要的就是 this._drawChildren(canvas, 'drawScene', top, false, caching);
      Container._drawChildren 中就干了点什么呢?
         Clip相关的操作
         遍历孩子，调用孩子的drawScene方法，测试例子调用Shape.drawScene方法
         drawScene: function(can, top, caching, skipBuffer) {
            var layer = this.getLayer(),
                canvas = can || layer.getCanvas(),
                context = canvas.getContext(),
                cachedCanvas = this._cache.canvas,
                drawFunc = this.sceneFunc(),
                hasShadow = this.hasShadow(),
                hasStroke = this.hasStroke(),
                stage, bufferCanvas, bufferContext;

            context.save();
            // if buffer canvas is needed
            if (this._useBufferCanvas(caching) && !skipBuffer) {
            }
            // if buffer canvas is not needed
            else {
                context._applyLineJoin(this);
                // layer might be undefined if we are using cache before adding to layer
                if (!caching) {
                    if (layer) {
                        //由层来决定如何应用变化矩阵,this这里是一个Rect。具体可查看代码中注释。
                        layer._applyTransform(this, context, top);
                    }
                }

                drawFunc.call(this, context);//真正的绘画逻辑
                
            }
            context.restore();
            return this;
        }
   Layer.drawHit 由子类 Layer.js 提供 逻辑和Layer.drawScene相同，默认清空画布
      接着调用Container.drawHit 在这个方法中最重要的就是 this._drawChildren(canvas, 'drawHit', top);
      Container._drawChildren 中就干了点什么呢?
         Clip相关的操作
         遍历孩子，调用孩子的drawHit方法，测试例子调用Shape.drawHit方法
         drawHit: function(can, top, caching) {
            var layer = this.getLayer(),
                canvas = can || layer.hitCanvas,
                context = canvas.getContext(),
                drawFunc = this.hitFunc() || this.sceneFunc(),
                cachedCanvas = this._cache.canvas,
                cachedHitCanvas = cachedCanvas && cachedCanvas.hit;

            context.save();
            context._applyLineJoin(this);
            if (!caching) {
                if (layer) {
                    layer._applyTransform(this, context, top);
                }
            }
            drawFunc.call(this, context);
            context.restore();
            return this;
        }
   似乎看上去drawScene与drawHit没有什么区别?本质上的区别体现在哪里呢？
     就是Shape.drawHit方法中的这句：drawFunc = this.hitFunc() || this.sceneFunc()。Image中提供了hitFunc函数。可以用来自定义hit区域。

15、Konva.Transform对矩阵操作的封装
16、Animation
    每一个动画都对应一个Animation对象，该对象被保存在Konva.Animation.animations=[]数组中。
    看了一下源码发现Animation对象，在动画当中起到的作用很小，就是数据封装而已。
17、DragAndDrop
    看这部分代码的时候，总是找不到拖拽的入口。即什么时候绑定的mousedown事件设置的拖拽node。
    实质上是通过setDraggable方法绑定的mousedown事件。即使是配置的draggable为true，在设置该属性的时候，还是会触发setDraggable方法。

    拖拽是通过动画来实现的
    new Konva.Animation(function() {
        var b = this.dirty;
        this.dirty = false;
        return b;//返回值决定了是否需要重新重绘
    });
    所以在拖拽的过程中,只要控制好this.dirty这个值就可以了

    如果有一个Group，Group中有一个矩形。如果同时设置了draggable为true。点击矩形时，矩形的drag生效。
    this.on('mousedown.konva touchstart.konva', function(evt) {
        if(!Konva.DD.node) {//这里解释了第一个生效
            that.startDrag(evt);
        }
    });



阅读所得待总结：
继承方法
向后兼容提示
Konva.Collection
absolute就是相对于根吧
如何查找鼠标选中的元素的，通过从hitCanvas中取个颜色，然后从Konva.shapes中查找。
   生成一个Shape的时候，会生成一个colorKey,然后把新生成的对象保存在Konva.shapes中。HitCanvas会用这个颜色填充，下面是HitContext中相关的代码。
   _fill: function(shape) {
            this.save();
            this.setAttr('fillStyle', shape.colorKey);
            shape._fillFuncHit(this);
            this.restore();
   }
Konva从Dom监听下面这些事件，其它的事件，都是这些事件模拟出来的。
EVENTS = [MOUSEDOWN, MOUSEMOVE, MOUSEUP, MOUSEOUT, TOUCHSTART, TOUCHMOVE, TOUCHEND, MOUSEOVER, DOMMOUSESCROLL, MOUSEWHEEL, WHEEL]
阅读源码时，要充分利用chrome的堆栈信息，点击可跳转到对应的代码

坑：
  经测试，Layer.setZIndex设置无效。但是当调用完draw方法后，再设置setZIndex就又起作用了。
