import { createContext, useContext, useReducer } from 'react';
import { AuthContext } from './AuthContext';

export const RoomContext = createContext();

export const RoomContextProvider = ({ children }) => {
	const { currentUser } = useContext(AuthContext);
	const INITIAL_STATE = {
		roomId: "null",
		user: {},
	};
	const roomReducer = (state, action) => {
		switch (action.type) {
			case "CHANGE_USER":
				return {
					user: action.payload,
					roomId:
						currentUser.uid > action.payload.uid
							? currentUser.uid + action.payload.uid
							: action.payload.uid + currentUser.uid,
				};
			default:
				return state;
		}
	};
	const [state, dispatch] = useReducer(roomReducer, INITIAL_STATE);
	return (
		<RoomContext.Provider value={{ data: state, dispatch }}>
			{children}
		</RoomContext.Provider>
	);
};
