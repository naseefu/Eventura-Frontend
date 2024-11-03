import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import ApiService from '../../Sevices/Apiservices';
import { useUser } from '../Context/UserContext';

const TeamContext = createContext([]);

export const useTeam = () => {
    return useContext(TeamContext);
};

export const TeamProvider = ({ children }) => {
    const { user } = useUser();
    const [team, setTeam] = useState([]);

    useEffect(() => {
        const getAllTeamByUserId = async () => {
            if (!user) {
              console.log("no user")
              return}; 
            try {
                const response = await ApiService.getAllTeams(user.id);
                setTeam(response.userListlist)
            } catch (error) {
                console.log(error.response?.message || "Error occurred during project retrieval");
            }
        };
        getAllTeamByUserId();
    }, [user]);

    const value = useMemo(() => team, [team]);

    return (
        <TeamContext.Provider value={value}>
            {children}
        </TeamContext.Provider>
    );
};
