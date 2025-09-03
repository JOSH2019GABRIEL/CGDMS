import "./list.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Datatable from "../../components/datatable/Datatable"
import Organization from "../addOrganization/Organization"

const List = ({Component}) => {
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <Component/>
        {/* <Datatable title ={title} path={path}/> */}
      </div>
    </div>
  )
}

export default List