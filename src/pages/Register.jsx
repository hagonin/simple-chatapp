import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

import Add from '../img/addAvatar.png';
import { auth, db, storage } from '../firebase';

export default function Register() {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		setLoading(true);
		e.preventDefault();

		const displayName = e.target[0].value;
		const email = e.target[1].value;
		const password = e.target[2].value;
		const file = e.target[3].files[0];
		console.log(displayName, file, email);

		try {
			// create user
			const res = await createUserWithEmailAndPassword(auth, email, password);

			// create a unique image name
			const date = new Date().getTime();
			const storageRef = ref(storage, `${displayName + date}`);

			await uploadBytesResumable(storageRef, file).then(() => {
				getDownloadURL(storageRef).then(async (downloadURL) => {
					try {
						// update prfile
						await updateProfile(res.user, {
							displayName,
							photoURL: downloadURL,
						});

						// create user on firestore
						await setDoc(doc(db, 'users', res.user.uid), {
							uid: res.user.uid,
							displayName,
							email,
							photoURL: downloadURL,
						});

						// create empty user rooms on firestore
						await setDoc(doc(db, 'userRooms', res.user.uid), {});
						navigate('/');
					} catch (err) {
						console.log(err);
						setError(true);
						setLoading(false);
					}
				});
			});
		} catch {
			setError(true);
			setLoading(false);
		}
	};

	return (
		<div className="formContainer">
			<div className="formWrapper">
				<span className="logo">Froggy Chat</span>
				<span className="title">Register</span>
				<form onSubmit={handleSubmit}>
					<input required type="text" placeholder="username" />
					<input required type="email" placeholder="email" />
					<input required type="password" placeholder="password" />
					<input required className="invisible" type="file" id="avatar" />
					<label htmlFor="avatar">
						<img src={Add} alt="avatar" />
						<span>Add your avatar</span>
					</label>
					<button disabled={loading}>Sign up</button>
					{loading && 'Uploading and compressing the image please wait...'}
					{error && <span className="error">Something went wrong</span>}
				</form>
				<p>
					You do have an account? <Link to="/login">Login</Link>
				</p>
			</div>
		</div>
	);
}
