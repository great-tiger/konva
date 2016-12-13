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

阅读所得待总结：
继承方法
向后兼容提示