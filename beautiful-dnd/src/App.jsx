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
   *
   * @param {list} source list from which the element to be ejected
   * @param {list} destination list where the ejected element be added to
   * @param {item} droppableSource list item to be ejected
   * @param {item} droppableDestination list item to be added
   * @returns
   */
  const move = (source, destination, droppableSource, droppableDestination) => {
    // console.log(source);
    // console.log(destination);
    console.log(droppableSource);
    // console.log(droppableDestination);
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  const handleDragEnd = (result) => {
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

  const handleDragEnd2 = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      handleDragEnd(result);
    } else {
      const result = move(
        getMappingForListsIds(source.droppableId),
        getMappingForListsIds(destination.droppableId),
        source,
        destination
      );

      //   updateTasksListState({
      //     first: [...result.DROPPABLE2],
      //     second: [...result.DROPPABLE1],
      //   });
    }
  };

  return (
    <div className={style.root}>
      <div className={style.container}>
        <DragDropContext onDragEnd={handleDragEnd2}>
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
