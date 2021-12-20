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

const App = () => {
  const [tasksList, updateTasksListState] = useState({
    first: [...FirstTasksList],
    second: [...SecondTasksList],
  });

  const listIdsMapping = {
    DROPPABLE1: "first",
    DROPPABLE2: "second",
  };

  const getMappingForListsIds = (id) => listIdsMapping[id];

  /**
   *
   * @param {list} list source array where drag-n-drop action occurred
   * @param {number} startIndex start index for search the element to be deleted
   * @param {number} endIndex start index for search for element to be added
   * @returns
   */
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  /**
   *
   * @param {list} source list from which the element to be ejected
   * @param {list} destination list where the ejected element be added to
   * @param {item} droppableSource list item to be ejected
   * @param {item} droppableDestination list item to be added
   * @returns
   */
  const move = (source, destination, droppableSource, droppableDestination) => {
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
    console.log(result);
    console.log(getMappingForListsIds(result.source.droppableId));
    console.log(getMappingForListsIds(result.destination.droppableId));

    const items1 = Array.from(tasksList.first);
    const items2 = Array.from(tasksList.second);
    const [reorderedItem1] = items1.splice(result.source.index, 1);
    const [reorderedItem2] = items2.splice(result.source.index, 1);
    items1.splice(result.destination.index, 0, reorderedItem1);
    items2.splice(result.destination.index, 0, reorderedItem2);

    updateTasksListState({ first: [...items1], second: [...items2] });
  };

  const handleDragEnd2 = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );

      let state = { items };

      if (source.droppableId === "droppable2") {
        state = { selected: items };
      }

      this.setState(state);
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      this.setState({
        items: result.droppable,
        selected: result.droppable2,
      });
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
