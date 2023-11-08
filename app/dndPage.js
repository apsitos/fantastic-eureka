'use client';

import { useState } from 'react';

import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';

import Chocolate from '../public/assets/Chocolate_narrow.png';
import Joel from '../public/assets/Joel_narrow.png';
import DropItem from './components/dropItem';
import DropZone from './components/dropZone';

const items = {
  1: {
    src: Joel,
    id: 1,
    alt: 'drawing of a boy doing a cartwheel',
    answer: 'service',
  },
  2: {
    src: Chocolate,
    id: 2,
    alt: 'drawing of a chocolate bar',
    answer: 'good',
  },
};

export default function DndPage({ setInteractive }) {
  const [containers, setContainers] = useState([
    { id: 'hold', title: '', items: Object.keys(items) },
    { id: 'good', title: 'Good', items: [] },
    { id: 'service', title: 'Service', items: [] },
  ]);
  const [correct, setCorrect] = useState(0);
  const [activeId, setActiveId] = useState(null);

  const mouseSensor = useSensor(MouseSensor);
  const keyboardSensor = useSensor(KeyboardSensor);
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, keyboardSensor, touchSensor);

  function handleDragStart(event) {
    const { active } = event;
    setActiveId(active.id);
  }

  function handleDragEnd(event) {
    const { over } = event;
    if (!over) return;
    if (over.id !== items[activeId].answer) return;

    setContainers((containers) => {
      return containers.map((container) => {
        const remainingItems = container.items.filter((id) => id != activeId);
        if (container.id === over.id) remainingItems.push(activeId);
        return { ...container, items: remainingItems };
      });
    });
    setCorrect((prev) => prev + 1);
    return setActiveId(null);
  }

  // adjust to be dynamic
  if (correct === 2)
    return setTimeout(() => setInteractive('multichoice'), 500);

  return (
    <article className='flex min-h-screen flex-col items-center justify-between p-24'>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <div className='w-full items-center justify-around text-sm lg:flex'>
          {containers.slice(1).map((container, i) => {
            return (
              <DropZone
                key={container.id}
                id={container.id}
                title={container.title}
                index={i}
              >
                {container.items?.map((id) => {
                  const item = items[id];
                  return <DropItem key={item.id} item={item} />;
                })}
              </DropZone>
            );
          })}
        </div>
        <div className='flex justify-between'>
          {containers[0]?.items?.map((id) => {
            const item = items[id];
            return <DropItem key={item.id} item={item} />;
          })}
        </div>
      </DndContext>
    </article>
  );
}
