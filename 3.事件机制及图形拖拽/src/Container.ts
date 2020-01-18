import { IContainerConfig } from './interfaces/IContainerConfig';
import { Collection } from './Collection';
import { Node } from "./Node";
export abstract class Container<ChildType extends Node> extends Node<IContainerConfig> {
    children = new Collection<ChildType>()

    public drawScene() {
        this.children.forEach(function (item) {
            item.drawScene()
        })
    }

    public drawHit() {
        this.children.forEach(function (item) {
            item.drawHit()
        }) 
    }

    add(child: ChildType) {
        let _children = this.children
        child.parent = this;
        _children.push(child)
        return this
    }
}