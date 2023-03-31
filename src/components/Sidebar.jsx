import Navbar from './Navbar';
import Search from './Search'
import Rooms from './Rooms'

function Sidebar() {
	return (
		<div className="sidebar">
			<Navbar />
			<Search/>
			<Rooms/>
		</div>
	);
}

export default Sidebar;
