import "./featured.scss"

import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import {CircularProgressbar} from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';


const Featured = () => {
  return (
    <div className="featured">
        <div className="top">
            <h1 className="title">Total Revenue</h1>
            <MoreVertOutlinedIcon fontSize="small"/>
        </div>
            <div className="bottom">
                    <div className="featuredChart">
                    <CircularProgressbar value={70} text={"70%"} strokeWidth={5}/>
                    </div>
                    <p className="title">Total Sales today</p>
                    <p className="amount">N430</p>
                    <p className="desc">Previous transaction processing last payment may not be included.</p>
                    <div className="summary">
                        <div className="item">
                            <div className="itemTitle">Target</div>
                            <div className="itemResult negative">
                                <KeyboardArrowUpOutlinedIcon fontSize="small"/>
                                <div className="resultAmount">N43.5k</div>
                                </div>
                        </div>
                        <div className="item">
                            <div className="itemTitle">Last Week</div>
                            <div className="itemResult positive">
                                <KeyboardArrowUpOutlinedIcon fontSize="small"/>
                                <div className="resultAmount">N43.5k</div>
                                </div>
                        </div>
                        <div className="item">
                            <div className="itemTitle">Last Month</div>
                            <div className="itemResult positive">
                                <KeyboardArrowUpOutlinedIcon fontSize="small"/>
                                <div className="resultAmount">N43.5k</div>
                                </div>
                        </div>
                     </div>
                        
                </div>
        </div>
  )
}

export default Featured