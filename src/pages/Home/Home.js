import "./Home.scss";

import Calendar from "../../components/Calendar";
import Header from "../../components/Header";

const Home = () => {
  return (
    <section className="home">
      <Header />
      <Calendar />
    </section>
  );
};

export default Home;
