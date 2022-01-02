import { useState } from "react";
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

/**
 * Constants should have the same name i.e.
 * const DROPPABLE1 = "DROPPABLE1"
 * const DROPPABLE2 = "DROPPABLE2"
 */
const DROPPABLE1 = "DROPPABLE1";
const DROPPABLE2 = "DROPPABLE2";

const listIdsMapping = {
  DROPPABLE1: "first",
  DROPPABLE2: "second",
};

const getMappingForListsIds = (id) => listIdsMapping[id];
const getAllListsFromMapping = () =>
  Object.entries(listIdsMapping).map(([key, value]) => value);

const App = () => {
  const [tasksList, updateTasksListState] = useState({
    first: [...FirstTasksList],
    second: [...SecondTasksList],
  });

  /**
   * @param {obect} result instance that encapsulates information about source and destination
   * @param {item} droppableSource list item to be ejected
   * @param {item} droppableDestination list item to be added
   */
  const move = (result, droppableSource, droppableDestination) => {
    const sourceListId = getMappingForListsIds(result.source.droppableId);
    const destListId = getMappingForListsIds(result.destination.droppableId);

    const sourceClone = Array.from(tasksList[sourceListId]);
    const destClone = Array.from(tasksList[destListId]);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    updateTasksListState({
      [sourceListId]: [...sourceClone],
      [destListId]: [...destClone],
    });
  };

  /**
   * @param {obect} result instance that encapsulates information about source and destination
   */
  const reorderItems = (result) => {
    // Here we get id for the list that is being modified;
    const modifiedListState = getMappingForListsIds(result.source.droppableId);

    // Here we get the lists that are not being modified
    // at the same time to keep their state as it used to be
    const nonModifiedListStateToBeSaved = getAllListsFromMapping().filter(
      (item) => item !== modifiedListState
    );

    const items = Array.from(tasksList[modifiedListState]);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateTasksListState({
      [modifiedListState]: [...items],
      [nonModifiedListStateToBeSaved]: [
        ...tasksList[nonModifiedListStateToBeSaved],
      ],
    });
  };

  /**
   * @param {obect} result instance that encapsulates information about source and destination
   */
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      reorderItems(result);
    } else {
      move(result, source, destination);
    }
  };

  return (
    <div className={style.root}>
      <div className={style.container}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className={style.tasks_holder}>
            <h2 className={style.tasks_header}>TasksHolder #1</h2>
            <Droppable droppableId={DROPPABLE1}>
              {(provided) => (
                <div
                  className={style.tasks_container}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {tasksList.first.map((item, index) => (
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
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div className={style.tasks_holder}>
            <h2 className={style.tasks_header}>TasksHolder #2</h2>
            <Droppable droppableId={DROPPABLE2}>
              {(provided) => (
                <div
                  className={style.tasks_container}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {tasksList.second.map((item, index) => (
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
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default App;
