import "../../style/new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddNewPond = () => {
  const { id } = useParams();
  const [newPond, setNewPond] = useState({
    id: "",
    name: "",
    capacity: "",
    location: "",
    status: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // fetch pond details if editing
  useEffect(() => {
    if (id) {
      const fetchPond = async () => {
        try {
          const response = await axios.get(`${baseUrl}ponds/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setNewPond(response.data);
        } catch (error) {
          console.error("Error fetching pond:", error);
          toast.error("Could not load pond details.");
        }
      };
      fetchPond();
    }
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPond((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${baseUrl}ponds`, newPond, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(id ? "Pond updated successfully!" : "Pond created successfully!");
      navigate("/dashboard/pond");
    } catch (error) {
      console.error("Error saving pond:", error);
      toast.error(error.response?.data?.message || "Error saving pond.");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Pond" : "Add Pond"}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={newPond.name || ""}
                  onChange={handleChange}
                  placeholder="Name of Pond"
                  required
                />
              </div>
              <div className="formInput">
                <label>Capacity of Pond:</label>
                <input
                  type="number"
                  name="capacity"
                  value={newPond.capacity || ""}
                  onChange={handleChange}
                  placeholder="Pond capacity"
                  required
                />
              </div>
              <div className="formInput">
                <label>Location:</label>
                <input
                  type="text"
                  name="location"
                  value={newPond.location || ""}
                  onChange={handleChange}
                  placeholder="Location of Pond"
                  required
                />
              </div>
              <div className="formInput">
                <label>Pond Status:</label>
                <select
                  name="status"
                  value={newPond.status || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Pond Status --</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="NOT_ACTIVE">NOT ACTIVE</option>
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

export default AddNewPond;
