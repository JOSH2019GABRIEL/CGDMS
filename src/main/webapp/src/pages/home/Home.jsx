import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import "./home.scss"
import Widget from "../../widget/Widget"
import Featured from "../../components/Featured/Featured"
import Chart from "../../components/Charts/Chart"
import Table from "../../components/Table/Table"

const Home = () => {
  return (
    <div className="home">
      <Sidebar/>
      <div className="homeContainer">
        <Navbar/>
        <div className="widgets">
        <Widget type = "user"/>
        <Widget  type = "order"/>
        <Widget  type = "earning"/>
        <Widget  type = "balance"/>
          </div>
          <div className="charts">
            <Featured/>
            <Chart/>
            </div>
            <div className="listContainer">
              <div className="listTitle">
                Latest Transaction
                </div>
                <Table/>
                </div>
        </div>
     </div>
  )
}

export default Home