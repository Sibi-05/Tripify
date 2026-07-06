import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { userActions } from '../store/userSlice'; 

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const currentUser = useSelector((state) => state?.user?.currentUser);
  const dispatch = useDispatch();
  useEffect(() => {
    let socketInstance = null;

    if (currentUser?._id || currentUser?.id) {
      const targetUserId = currentUser?._id || currentUser?.id;

      socketInstance = io("http://localhost:5001", {
        query: { userId: targetUserId },
        withCredentials: true,
        transports: ["websocket"],
      });

      setSocket(socketInstance);


      socketInstance.on("getOnlineUsers", (users) => {
        dispatch(userActions.setOnlineUsers(users));
      });
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }

    return () => {
      if (socketInstance) {
        socketInstance.close();
      }
    };
    
  }, [currentUser, dispatch]);

  

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};