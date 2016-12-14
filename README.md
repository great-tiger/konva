#继承关系
The stage, layers, groups, and shapes all extend Node.     

Stage->Container-Node
Group->Container->Node
Layer->BaseLayer->Container->Node    
Rect->Shape->Node  

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

阅读所得待总结：
继承方法
向后兼容提示