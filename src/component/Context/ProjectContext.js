import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import ApiService from '../../Sevices/Apiservices';
import { useUser } from '../Context/UserContext';

const ProjectContext = createContext([]);

export const useProjects = () => {
    return useContext(ProjectContext);
};

const TeamDetaContext = createContext([]);
export const useTeamDeta = () => {
    return useContext(TeamDetaContext);
};

const TaskContext = createContext([])
export const useTaskData = ()=>{
  return useContext(TaskContext)
}
const TodayTaskContext = createContext([])
export const useTodayTaskData = ()=>{
  return useContext(TodayTaskContext)
}

export const ProjectProvider = ({ children }) => {
    const { user } = useUser();
    const [projects, setProjects] = useState([]);
    const [teamDeta,setTeamDeta] = useState([])
    const [tasks1,setTasks]= useState([])
    const [todaytask,setTodayTask] = useState([])

    useEffect(() => {
        const getAllProjectsByUserId = async () => {
            if (!user) {
              return}; 
            try {
                const response = await ApiService.getAllProjects(user.id);
                setTeamDeta(response.teamList)
                setProjects(response.projectList);
            } catch (error) {
                console.log(error.response?.message || "Error occurred during project retrieval");
            }
        };

      const getAllTasks = async()=>{
        try{
          const response = await ApiService.getAllTaskByUserid(user.id)
          setTasks(response.taskList)
        }
        catch(err){
          console.log(err.response?.data?.message || "Error")
        }
      }

      const getAllTodayTask = async()=>{
        try{
          const response = await ApiService.getAlltodayTask(user.id)
          setTodayTask(response.taskList)
        }
        catch(err){
          console.log(err.response?.data?.message || "Error")
        }
      }

      getAllTodayTask();
      getAllTasks();
      getAllProjectsByUserId();
    }, [user]);

    const value = useMemo(() => projects, [projects]);
    const value1 = useMemo(()=> teamDeta,[teamDeta]);
    const value2 = useMemo(()=> tasks1,[tasks1])
    const value3 = useMemo(()=> todaytask,[todaytask])

    return (
        <ProjectContext.Provider value={value}>
          <TeamDetaContext.Provider value={value1}>
            <TaskContext.Provider value={value2}>
              <TodayTaskContext.Provider value={value3}>
                {children}
            </TodayTaskContext.Provider>
            </TaskContext.Provider>
          </TeamDetaContext.Provider>
        </ProjectContext.Provider>
    );
};
