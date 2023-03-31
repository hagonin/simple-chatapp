import { useContext } from 'react';
import { RoomContext } from '../context/RoomContext';

import Video from '../img/video.png';
import Add from '../img/add.png';
import More from '../img/more.png';
import Input from './Input';
import Messages from './Messages';

export default function Room() {
	const { data } = useContext(RoomContext);
	console.log('data', data)

	return (
		<div className="room">
			<div className="roomInfo">
				<span>{data.user?.displayName}</span>
				<div className="roomIcons">
					<img src={Video} alt="" />
					<img src={Add} alt="" />
					<img src={More} alt="" />
				</div>
			</div>
			<Messages />
			<Input />
		</div>
	);
}
