import { useContext, useState } from 'react';
import {
	arrayUnion,
	doc,
	serverTimestamp,
	Timestamp,
	updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuid } from 'uuid';

import { AuthContext } from '../context/AuthContext';
import { RoomContext } from '../context/RoomContext';
import { db, storage } from '../firebase';
import Attach from '../img/attach.png';
import Img from '../img/img.png';

export default function Input() {
	const [text, setText] = useState('');
	const [img, setImg] = useState(null);

	const { currentUser } = useContext(AuthContext);
	const { data } = useContext(RoomContext);

	const handleSend = async () => {
		if (img) {
			const storageRef = ref(storage, uuid());

			const uploadTask = uploadBytesResumable(storageRef, img);
			uploadTask.on(
				(error) => {
					//example to handle error
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
						await updateDoc(doc(db, 'rooms', data.roomId), {
							messages: arrayUnion({
								id: uuid(),
								text,
								senderId: currentUser.uid,
								date: Timestamp.now(),
								img: downloadURL,
							}),
						});
					});
				}
			);
		} else {
			await updateDoc(doc(db, 'rooms', data.roomId), {
				messages: arrayUnion({
					id: uuid(),
					text,
					senderId: currentUser.uid,
					date: Timestamp.now(),
				}),
			});
		}
		await updateDoc(doc(db, 'userRooms', currentUser.uid), {
			[data.roomId + '.lastMessage']: { text, },
			[data.roomId + '.date']: serverTimestamp(),
		});

		await updateDoc(doc(db, 'userRooms', data.user.uid), {
			[data.roomId + '.lastMessage']: { text, },
			[data.roomId + '.date']: serverTimestamp(),
		});

		setText('');
		setImg(null);
	};

	return (
		<div className="input">
			<input
				type="text"
				placeholder="Type your message"
				onChange={(e) => setText(e.target.value)}
				value={text}
			/>
			<div className="send">
				<img src={Attach} alt="" />
				<input
					type="file"
					className="invisible"
					id="file"
					onChange={(e) => setImg(e.target.files[0])}
				/>
				<label htmlFor="file">
					<img src={Img} alt="" />
				</label>
				<button onClick={handleSend}>Send</button>
			</div>
		</div>
	);
}
