import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { RoomContextProvider } from './context/RoomContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<AuthContextProvider>
		<RoomContextProvider>
			<React.StrictMode>
				<App />
			</React.StrictMode>
		</RoomContextProvider>
	</AuthContextProvider>
);
