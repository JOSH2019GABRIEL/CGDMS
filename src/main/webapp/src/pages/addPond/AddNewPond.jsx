import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../api";
import { useNavigate } from "react-router-dom";

const AddNewPond = () => {
  const [newPond, setNewPond] = useState({
    name: "",
    capacity: "",
    location: "",
    status: ""
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPond((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddOrg = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${baseUrl}ponds`,
        newPond,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Pond submitted successfully:", response.data);
      toast.success("Submitted successfully!");

      setNewPond({
            name: "",
            capacity: "",
            location: "",
            status: ""
      });

      // ✅ Redirect after short delay (to let toast show)
      // setTimeout(() => {
        navigate("/dashboard/ponds");
      // }, 1000);

    } catch (error) {
      console.error("Error adding pond:", error);
      toast.error(error.response?.data?.message || "Error adding pond.");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add Pond</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleAddOrg}>
              <div className="formInput">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={newPond.name}
                  onChange={handleChange}
                  placeholder="Name of Organization"
                />
              </div>
              <div className="formInput">
                <label>Email:</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={newPond.contactEmail}
                  onChange={handleChange}
                  placeholder="Email Address"
                />
              </div>
              <div className="formInput">
                <label>Address:</label>
                <input
                  type="text"
                  name="address"
                  value={newPond.address}
                  onChange={handleChange}
                  placeholder="Address of Organization"
                />
              </div>
              <div className="formInput">
                <label>Telephone:</label>
                <input
                  type="text"
                  name="contactPhone"
                  value={newPond.contactPhone}
                  onChange={handleChange}
                  placeholder="Telephone Number"
                />
              </div>
              <button type="submit">Save</button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddNewPond;
