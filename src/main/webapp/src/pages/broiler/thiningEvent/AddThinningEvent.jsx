import "../../../style/new.scss";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddThinningEvent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState({
    id: "",
    date: "",
    flockId: "",
    numberRemoved: "",
    averageWeight: "",
    destination: "",
  });

  const [flocks, setFlocks] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch flocks for dropdown
  useEffect(() => {
    const fetchFlocks = async () => {
      try {
        const response = await axios.get(`${baseUrl}flocks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFlocks(response.data.content);
      } catch (error) {
        console.error("Error fetching flocks:", error);
        toast.error("Could not load flocks");
      }
    };
    fetchFlocks();
  }, [token]);

  // Fetch event if editing
  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        try {
          const response = await axios.get(`${baseUrl}thinning-events/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setEvent(response.data);
        } catch (error) {
          console.error("Error fetching event:", error);
          toast.error("Could not load thinning event details.");
        }
      };
      fetchEvent();
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        await axios.post(`${baseUrl}thinning-events`, event, {
          headers: { Authorization: `Bearer ${token}` },
        });


      toast.success(id ? "Thinning event updated successfully!" : "Thinning event created successfully!");
      navigate("/dashboard/thinning-event");
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error(error.response?.data?.message || "Error saving event.");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Thinning Event" : "Add Thinning Event"}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>

              <div className="formInput">
                <label>Date:</label>
                <input
                  type="date"
                  name="date"
                  value={event.date || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Flock:</label>
                <select
                  name="flockId"
                  value={event.flockId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Flock --</option>
                  {flocks.map((flock) => (
                    <option key={flock.id} value={flock.id}>
                      {flock.id} - {flock.source}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formInput">
                <label>Number Removed:</label>
                <input
                  type="number"
                  name="numberRemoved"
                  value={event.numberRemoved || ""}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  required
                />
              </div>

              <div className="formInput">
                <label>Average Weight (g):</label>
                <input
                  type="number"
                  name="averageWeight"
                  value={event.averageWeight || ""}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  required
                />
              </div>

              <div className="formInput">
                <label>Destination:</label>
                <input
                  type="text"
                  name="destination"
                  value={event.destination || ""}
                  onChange={handleChange}
                  placeholder="e.g. Sold, Transferred"
                  required
                />
              </div>

              <div className="formInput">
                <input
                  hidden
                />
              </div>


              <button type="submit">{id ? "Update" : "Save"}</button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddThinningEvent;
