import { signOut } from 'firebase/auth';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { auth } from '../firebase';

export default function Navbar() {
	const { currentUser } = useContext(AuthContext);
	console.log('currentUser',currentUser)

	return (
		<div className="navbar">
			<span className="logo">Froggy Chat</span>
			<div className="user">
				<img src={currentUser.photoURL} alt="avatar" />
				<span>{currentUser.displayName}</span>
				<button onClick={() => signOut(auth)}>logout</button>
			</div>
		</div>
	);
}
