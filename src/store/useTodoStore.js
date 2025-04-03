import {create} from "zustand"
import { request } from "../request" 

export const useTodoStore = create((set) => ({
    todos: [],
    isLoading: false,

    fetchTasks: async () => {
        set({isLoading: true})
        try {
            const response = await request.get("todo")
            set({
                todos: response.data.map((item) => ({
                    id: item.id,
                    title: item.title,
                    isActive: item.isActive,
                })),
                isLoading: false,
            })
        } catch (error) {
            console.log(error)
            set({isLoading: false})
        }
    },

    addNewTask: async (newTodo) => {
        set({isLoading: true})
        try {
            const response = await request.post("todo", {
                title: newTodo.text,
                isActive: false,
                createdAt: new Date().toLocaleDateString(),
            })
            set((state) => ({
                todos: [
                    ...state.todos,
                    {
                        id: response.data.id,
                        title: response.data.title,
                        isActive: response.data.isActive,
                    },
                ],
                isLoading: false,
            }))
            return response.data
        } catch (error) {
            console.log(error)
            set({isLoading: false})
        }
    },

    deleteTask: async (id) => {
        set({isLoading: true})
        try {
            await request.delete(`todo/${id}`)
            set((state) => ({
                todos: state.todos.filter((todo) => todo.id !== id),
                isLoading: false,
            }))
        } catch (error) {
            console.log(error)
            set({isLoading: false})
        }
    },

    editTask: async (updatedTodo) => {
        set({isLoading: true})
        try {
            const response = await request.put(`todo/${updatedTodo.id}`, {
                title: updatedTodo.title,
                isActive: !updatedTodo.isActive,
            })
            set((state) => ({
                todos: state.todos.map((todo) =>
                    todo.id === updatedTodo.id
                        ? {
                              ...todo,
                              title: response.data.title,
                              isActive: !response.data.isActive,
                          }
                        : todo
                ),
                isLoading: false,
            }))
            return response.data
        } catch (error) {
            console.log(error)
            set({isLoading: false})
        }
    },

    toggleComplete: async (id) => {
        set({isLoading: true})
        try {
            const todo = useTodoStore.getState().todos.find((t) => t.id === id)
            const response = await request.put(`todo/${id}`, {
                isActive: !todo.isActive,
                title: todo.title,
            })
            set((state) => ({
                todos: state.todos.map((todo) =>
                    todo.id === id
                        ? {
                              ...todo,
                              isActive: !todo.isActive,
                          }
                        : todo
                ),
                isLoading: false,
            }))
            return response.data
        } catch (error) {
            console.log(error)
            set({isLoading: false})
        }
    },
}))
