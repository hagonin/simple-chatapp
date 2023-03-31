import { useContext, useState } from 'react';
import {
	collection,
	query,
	where,
	getDocs,
	setDoc,
	doc,
	updateDoc,
	serverTimestamp,
	getDoc,
} from 'firebase/firestore';
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase';

export default function Search() {
	const [username, setUsername] = useState('');
	const [user, setUser] = useState(null);
	const [error, setError] = useState(false);

	const { currentUser } = useContext(AuthContext);

	const searchUser = async () => {
		const q = query(
			collection(db, 'users'),
			where('displayName', '==', username)
		);
		try {
			const querySnapshot = await getDocs(q);
			querySnapshot.forEach((doc) => {
				setUser(doc.data());
			});
		} catch (err) {
			setError(true);
		}
	};

	const handleKey = (e) => {
		e.code === 'Enter' && searchUser();
	};

	const handleSelect = async () => {
		// check if the rooms exists, if not create
		// create a unique identifier (combinedId) for the rooms by combining
		// the user IDs of the current user and the selected user.
		// The larger user ID is placed first
		const combinedId =
			currentUser.uid > user.uid
				? currentUser.uid + user.uid
				: user.uid + currentUser.uid;

		try {
			const res = await getDoc(doc(db, 'rooms', combinedId));
			if (!res.exists()) {
				// create a room in rooms collection
				await setDoc(doc(db, 'rooms', combinedId), { messages: [] });

				// create user rooms
				await updateDoc(doc(db, 'userRooms', currentUser.uid), {
					[combinedId + '.userInfo']: {
						uid: user.uid,
						displayName: user.displayName,
						photoURL: user.photoURL,
					},
					[combinedId + '.date']: serverTimestamp(),
				});
				await updateDoc(doc(db, 'userRooms', user.uid), {
					[combinedId + '.userInfo']: {
						uid: currentUser.uid,
						displayName: currentUser.displayName,
						photoURL: currentUser.photoURL,
					},
					[combinedId + '.date']: serverTimestamp(),
				});
			}
		} catch (err) {}
		setUser(null);
		setUsername('');
	};
	return (
		<div className="search">
			<div className="searchForm">
				<input
					type="text"
					placeholder="Search a user"
					onKeyDown={handleKey}
					onChange={(e) => setUsername(e.target.value)}
					value={username}
				/>
			</div>
			{error && <p>User not found</p>}
			{user && (
				<div className="userRoom" onClick={handleSelect}>
					<img src={user.photoURL} alt="" />
					<div className="userRoomInfo">
						<span>{user.displayName}</span>
					</div>
				</div>
			)}
		</div>
	);
}
