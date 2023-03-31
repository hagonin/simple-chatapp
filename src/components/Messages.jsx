import { doc, onSnapshot } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { RoomContext } from '../context/RoomContext';
import { db } from '../firebase';
import Message from './Message';

export default function Rooms() {
	const [messages, setMessages] = useState([]);
	const { data } = useContext(RoomContext);

	useEffect(() => {
		const unsub = onSnapshot(doc(db, 'userRooms', data.roomId), (doc) => {
			doc.exists() && setMessages(doc.data().messages);
		});

		return () => {
			unsub();
		};
	}, [data.roomId]);
	console.log(messages);

	return (
		<div className="messages">
			{messages.map((mess) => (
				<Message message={mess} key={mess.id} />
			))}
		</div>
	);
}
