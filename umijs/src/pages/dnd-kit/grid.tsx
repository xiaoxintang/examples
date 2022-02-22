import React, {useEffect, useState} from 'react';
import styles from './grid.module.less'
import {DndContext, DragEndEvent, DragOverlay, DragStartEvent,} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities'

interface ItemProps {
  title: string;
  src: string;
  /*一定要有id属性，其他属性可以没有*/
  id: string
}

function Item({item}: { item: ItemProps }) {
  return <div className={styles.item}>
    <img src={item.src} className={styles.img}/>
    <button className={styles.btn}>{item.title}</button>
  </div>
}

function SortableItem({item}: { item: ItemProps }) {
  const {transition, transform, attributes, listeners, setNodeRef, isDragging} = useSortable({
    id: item.id
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
    opacity: isDragging ? 0.5 : 1
  }
  /**
   * listeners、attributes放在哪个元素上，哪个元素就被监听相应拖动
   * */
  return <div {...listeners} {...attributes} ref={setNodeRef} style={style}>
    <Item item={item}/>
  </div>

}

export default function () {
  const [activeItem, setActiveItem] = useState(null as ItemProps | null | undefined)
  const [listData, setItems] = useState([] as ItemProps[])

  useEffect(() => {
    fetch('/api/list').then(res => res.json()).then(res => {
      console.log(res)
      setItems(res.list)
    })
  }, [])

  function handleDrageStart(event: DragStartEvent) {
    const {active} = event;
    console.log(event)
    const current = listData.find(el => el.id === active.id)
    setActiveItem(current)
  }

  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;
    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(el => el.id === active.id);
        const newIndex = items.findIndex(el => el.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveItem(null)
  }

  return <DndContext onDragEnd={handleDragEnd} onDragStart={handleDrageStart}>
    <SortableContext items={listData}>
      <div className={styles.layout}>
        {listData.map(item => <SortableItem item={item} key={item.id}/>)}
        {/*DragOverlay 是拖动的时候，跟随鼠标动的那个元素*/}
        <DragOverlay> {
          activeItem ? <Item item={activeItem}/> : null
        }</DragOverlay>
      </div>
    </SortableContext>
  </DndContext>;
}
