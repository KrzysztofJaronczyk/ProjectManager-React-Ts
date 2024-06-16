import React from 'react';
import { Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import FunctionalityCard from '../ProjectDetails/FunctionalityCard';
import Functionality from '../Models/Functionality';

interface DragDropProps {
  functionalities: Functionality[];
  updateFunctionality: (id: string, updatedData: Partial<Omit<Functionality, 'id'>>) => void;
  deleteFunctionality: (id: string) => void;
  droppableId: string;
}

const DragDrop: React.FC<DragDropProps> = ({
  functionalities,
  updateFunctionality,
  deleteFunctionality,
  droppableId,
}) => {
  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {functionalities.map((functionality, index) => (
            <Draggable key={functionality.id} draggableId={functionality.id} index={index}>
              {(provided) => (
                <div
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                  className="my-2"
                >
                  <FunctionalityCard
                    functionality={functionality}
                    onUpdate={updateFunctionality}
                    onDelete={deleteFunctionality}
                  />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default DragDrop;
