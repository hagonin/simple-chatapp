import { doc, onSnapshot } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { RoomContext } from '../context/RoomContext';
import { db } from '../firebase';

export default function Rooms() {
	const [rooms, setRooms] = useState([]);

	const { currentUser } = useContext(AuthContext);
	const { dispatch } = useContext(RoomContext);

	useEffect(() => {
		const getRooms = () => {
			const unsubscribe = onSnapshot(
				doc(db, 'userRooms', currentUser.uid),
				(doc) => {
					const newData = doc.data();
					if (newData !== rooms) {
						const sortedData = Object.entries(newData).sort(
							(a, b) => b[1].date - a[1].date
						);
						setRooms(sortedData);
					}
				}
			);
			return () => {
				unsubscribe();
			};
		};
		currentUser.uid && getRooms();
	}, [currentUser.uid, rooms]);

	console.log('rooms', rooms);

	const handleSelect = (user) => {
		dispatch({ type: 'CHANGE_USER', payload: user });
	};

	return (
		<div className="rooms">
			{rooms.map((room) => (
				<div
					className="userRoom"
					key={room[0]}
					onClick={() => handleSelect(room[1].userInfo)}
				>
					<img src={room[1].userInfo.photoURL} alt="" />
					<div className="userRoomInfo">
						<span>{room[1].userInfo.displayName}</span>
						<p>{room[1].lastMessage?.text}</p>
					</div>
				</div>
			))}
		</div>
	);
}
