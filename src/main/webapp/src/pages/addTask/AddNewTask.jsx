import "../../style/new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { url as baseUrl } from "../../api";
import { useNavigate, useParams } from "react-router-dom";

const AddNewTask = () => {
  const [task, setTask] = useState({
    id: "",
    title: "",
    description: "",
    dueDate: "",
    assignedToId: "",
    assignedBy: "",
  });

  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseUrl}staff`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data.content || response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Could not load users");
      }
    };
    fetchUsers();
  }, [token]);

  useEffect(() => {
  if (id) {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`${baseUrl}task-assignment/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;

        setTask({
          id: data.id,
          title: data.title,
          description: data.description,
          dueDate: data.dueDate,
          assignedToId: data.assignedTo?.id || "", 
          assignedBy: data.assignedBy,
        });
      } catch (error) {
        console.error("Error fetching task:", error);
        toast.error("Could not load task");
      }
    };
    fetchTask();
  }
}, [id, token]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        await axios.put(`${baseUrl}task-assignment/${id}`, task, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Task updated successfully!");
      } else {
        await axios.post(`${baseUrl}task-assignment`, task, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Task submitted successfully!");
      }

      setTimeout(() => {
        navigate("/dashboard/tasks");
      }, 1000);
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error(error.response?.data?.message || "Error saving task.");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{id ? "Edit Task" : "Add Task"}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={task.title || ""}
                  onChange={handleChange}
                  required
                />
              </div>


              <div className="formInput">
                <label>Due Date:</label>
                <input
                  type="date"
                  name="dueDate"
                  value={task.dueDate || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="formInput">
                <label>Assign To:</label>
                <select
                  name="assignedToId"
                  value={task.assignedToId || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select User --</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstname + " "+ user.lastname}
                    </option>
                  ))}
                </select>
              </div>

              {/* <div className="formInput">
                <label>Assigned By:</label>
                <input
                  type="text"
                  name="assignedBy"
                  value={task.assignedBy || ""}
                  onChange={handleChange}
                  placeholder="Your name"
                />
              </div> */}

               <div className="formInput">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={task.description || ""}
                  onChange={handleChange}
                  rows="3"
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

export default AddNewTask;
