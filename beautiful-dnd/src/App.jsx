import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import style from "./App.module.css";

const FirstTasksList = [
  { id: 1, taskName: "Task #1" },
  { id: 2, taskName: "Task #2" },
  { id: 3, taskName: "Task #3" },
  { id: 4, taskName: "Task #4" },
  { id: 5, taskName: "Task #5" },
];

const SecondTasksList = [
  { id: 6, taskName: `Task #6` },
  { id: 7, taskName: "Task #7" },
  { id: 8, taskName: "Task #8" },
  { id: 9, taskName: "Task #9" },
  { id: 10, taskName: "Task #10" },
];

function App() {
  const getTasks = (listItemsCollection) => {
    const list = listItemsCollection.map((item, index) => (
      <Draggable
        key={item.id}
        draggableId={"draggable" + item.id}
        index={index}
      >
        {(provided) => (
          <div
            className={style.task}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {item.taskName}
          </div>
        )}
      </Draggable>
    ));
    return list;
  };

  return (
    <div className={style.root}>
      <div className={style.container}>
        <DragDropContext
          onDragEnd={() => {
            console.log("DragEnded");
          }}
        >
          <div className={style.tasks_holder}>
            <h2 className={style.tasks_header}>TasksHolder #1</h2>
            <Droppable droppableId="droppable-1">
              {(provided) => (
                <div
                  className={style.tasks_container}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {getTasks(FirstTasksList)}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div className={style.tasks_holder}>
            <h2 className={style.tasks_header}>TasksHolder #2</h2>
            <Droppable droppableId="droppable-2">
              {(provided) => (
                <div
                  className={style.tasks_container}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {getTasks(SecondTasksList)}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
