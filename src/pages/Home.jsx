import Sidebar from '../components/Sidebar';
import Room from '../components/Room';
const Home = () => {
	return (
		<div className="home">
			<div className="container">
				<Sidebar />
				<Room />
			</div>
		</div>
	);
};
export default Home;
