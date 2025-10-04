import "../../../style/new.scss";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Navbar from "../../../components/Navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddHarvestEvent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState({
    date: "",
    flockId: "",
    totalHarvested: "",
    averageLiveWeight: "",
    cullCount: "",
    operatorId: "",
  });

  const [flocks, setFlocks] = useState([]);
  const [staff, setStaff] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch flocks
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

  // Fetch staff/operators
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(`${baseUrl}staff`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStaff(response.data.content);
      } catch (error) {
        console.error("Error fetching staff:", error);
        toast.error("Could not load operators");
      }
    };
    fetchStaff();
  }, [token]);

  // Fetch event if editing
  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        try {
          const response = await axios.get(`${baseUrl}harvestEvents/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setEvent(response.data);
        } catch (error) {
          console.error("Error fetching event:", error);
          toast.error("Could not load harvest event details.");
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
      if (id) {
        await axios.put(`${baseUrl}harvestEvents/${id}`, event, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${baseUrl}harvestEvents`, event, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      toast.success(id ? "Harvest event updated successfully!" : "Harvest event created successfully!");
      navigate("/dashboard/harvest-events");
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
          <h1>{id ? "Edit Harvest Event" : "Add Harvest Event"}</h1>
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
                    <option key={flock.flock_id} value={flock.flock_id}>
                      {flock.flock_id} - {flock.source}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formInput">
                <label>Total Harvested:</label>
                <input
                  type="number"
                  name="totalHarvested"
                  value={event.totalHarvested || ""}
                  onChange={handleChange}
                  placeholder="e.g. 1500"
                  required
                />
              </div>

              <div className="formInput">
                <label>Average Live Weight (g):</label>
                <input
                  type="number"
                  name="averageLiveWeight"
                  value={event.averageLiveWeight || ""}
                  onChange={handleChange}
                  placeholder="e.g. 2000"
                  required
                />
              </div>

              <div className="formInput">
                <label>Cull Count:</label>
                <input
                  type="number"
                  name="cullCount"
                  value={event.cullCount || ""}
                  onChange={handleChange}
                  placeholder="e.g. 10"
                  required
                />
              </div>

              <div className="formInput">
                <label>Operator:</label>
                <select
                  name="operatorId"
                  value={event.operatorId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Operator --</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
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

export default AddHarvestEvent;
