import React, {useState, useEffect} from "react"
import "@ant-design/v5-patch-for-react-19"
import {Button, Checkbox, Spin, message} from "antd"
import {useTodoStore} from "./store/useTodoStore"
import {TbTrashX} from "react-icons/tb"
import {BiEdit, BiSearch} from "react-icons/bi"
import {AiOutlineClose} from "react-icons/ai"
import {LoadingOutlined} from "@ant-design/icons"

const App = () => {
    const {
        todos,
        isLoading,
        fetchTasks,
        addNewTask,
        editTask,
        deleteTask,
        toggleComplete,
    } = useTodoStore()
    const [newTask, setNewTask] = useState("")
    const [editingTask, setEditingTask] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        fetchTasks()
    }, [fetchTasks])

    const reversedTodo = [...todos].reverse()
    const filteredTodos = reversedTodo?.filter((todo) =>
        todo?.title?.toLowerCase().includes(searchTerm?.toLowerCase())
    )

    const completedCount = todos?.filter((t) => t?.isActive).length
    const progress =
        todos?.length > 0 ? (completedCount / todos?.length) * 100 : 0

    message.config({
        right: 0,
        duration: 1,
        maxCount: 1,
    })

    const handleDelete = async (id) => {
        try {
            await deleteTask(id)
            message.success({content: "Task Deleted"})
        } catch {
            message.error({content: "Failed to delete task"})
        }
    }

    const handleAdd = async () => {
        if (!newTask.trim()) {
            message.warning({content: "Task cannot be empty"})
            return
        }

        try {
            await addNewTask({text: newTask})
            message.success({content: "Task Added"})
            setNewTask("")
        } catch {
            message.error({content: "Failed to add task"})
        }
    }

    const handleEdit = (task) => {
        setEditingTask(task)
        setNewTask(task.title)
    }

    const handleCancelEdit = () => {
        setEditingTask(null)
        setNewTask("")
    }

    const handleUpdate = async () => {
        if (!newTask.trim()) {
            message.warning({content: "Task cannot be empty"})
            return
        }

        try {
            await editTask({id: editingTask.id, title: newTask})
            message.success({content: "Task Updated"})
            setNewTask("")
            setEditingTask(null)
        } catch {
            message.error({content: "Failed to update task"})
        }
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white px-[20px]">
            <div className="flex flex-col gap-[20px] max-[580px]:w-full w-[550px]">
                <div className="flex flex-col gap-[10px]">
                    {todos.length > 4 && (
                        <div className="flex justify-start items-center gap-[10px] h-[40px] p-1 border border-blue-600 rounded-md">
                            <input
                                maxLength={40}
                                type="text"
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-full p-[10px] outline-none text-sm bg-transparent"
                            />
                            <BiSearch className="h-full w-[25px] opacity-60 mx-1" />
                        </div>
                    )}

                    <div className="flex justify-between items-center gap-[10px] h-[40px]">
                        <input
                            maxLength={40}
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder={
                                editingTask ? "Update task" : "Add new task"
                            }
                            className="w-full h-full border p-[10px] rounded-md outline-none border-blue-600 text-sm bg-transparent"
                            onKeyPress={(e) =>
                                e.key === "Enter" &&
                                (editingTask ? handleUpdate() : handleAdd())
                            }
                        />
                        <Button
                            className="!h-full"
                            type="primary"
                            loading={isLoading}
                            onClick={editingTask ? handleUpdate : handleAdd}>
                            {editingTask ? "Update" : "Add"}
                        </Button>
                    </div>
                </div>

                {/* Todo List */}
                <div className="flex flex-col gap-[10px] pr-1 h-[300px] max-h-[300px] overflow-y-auto">
                    {filteredTodos?.map((todo) => (
                        <div
                            key={todo.id}
                            className={`flex justify-between items-center gap-[10px] bg-[#00c3ff28] p-[10px] rounded-md ${
                                todo.isActive ? "opacity-70" : ""
                            }`}>
                            <div className="flex justify-start items-center gap-[15px]">
                                <Checkbox
                                    checked={todo.isActive}
                                    onChange={() => toggleComplete(todo.id)}
                                    className="!bg-transparent"
                                />
                                <p
                                    className={`opacity-80 ${
                                        todo.isActive ? "line-through" : ""
                                    }`}>
                                    {todo.title}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-center items-center gap-[10px]">
                                {editingTask?.id === todo.id ? (
                                    <Button
                                        className="!border-orange-500 !bg-transparent !text-orange-500"
                                        onClick={handleCancelEdit}>
                                        <AiOutlineClose />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => handleEdit(todo)}
                                        disabled={todo.isActive}>
                                        <BiEdit
                                            className={`${
                                                todo.isActive
                                                    ? "text-white"
                                                    : "text-black"
                                            }`}
                                        />
                                    </Button>
                                )}

                                <Button
                                    type="primary"
                                    danger
                                    onClick={() => handleDelete(todo.id)}>
                                    <TbTrashX />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                {todos.length > 0 && (
                    <div className="flex flex-col gap-[5px] items-end">
                        <p className="text-[#ffffffac]">
                            {Math.round(progress)}% Complete
                        </p>
                        <div className="h-[15px] border border-[#ffffff37] w-full rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-300 ${
                                    progress < 20
                                        ? "bg-red-500"
                                        : progress < 40
                                        ? "bg-orange-500"
                                        : progress < 60
                                        ? "bg-yellow-500"
                                        : progress < 80
                                        ? "bg-lime-500"
                                        : "bg-green-500"
                                }`}
                                style={{width: `${progress}%`}}
                            />
                        </div>
                        <p className="text-sm text-[#ffffffac]">
                            {completedCount} of {todos.length} tasks completed
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default App
