import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [data, setData] = useState([]); // API Data
  const [inputuser, setInputuser] = useState({
    name: "",
    todolist: "",
  });

  const [editId, setEditId] = useState(null);

  // Show Data
  useEffect(() => {
    axios
      .get("https://todo-backend-0gia.onrender.com/readalluser")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Validation
  // HandleChange
  const handlechange = (e) => {
    const { name, value } = e.target;
    setInputuser({
      ...inputuser,
      [name]: value,
    });
  };

  // Add Button
  const handlesubmit = (e) => {
    e.preventDefault();
    if (editId) {
      axios
        .put(`https://todo-backend-0gia.onrender.com/updateuser/${editId}`, inputuser)
        .then((res) => {
          setData((prev) =>
            prev.map((item) =>
              item._id === editId ? { ...item, ...res.data } : item
            )
          );
          setInputuser({ name: "", todolist: "" });
          alert("Updated Successfully");
        })

        .catch((err) => console.log("Put API ERROR", err));
    } else {
      axios
        .post("https://todo-backend-0gia.onrender.com/createuser", inputuser)
        .then((res) => {
          setData([...data, res.data]);
          setInputuser({ name: "", todolist: "" });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // Edit Button
  const handleedit = (id) => {
    axios
      .put(`https://todo-backend-0gia.onrender.com/updateuser/${id}`)
      .then((res) => {
        const edit = data.find((prev) => prev._id === id);
        setInputuser({
          name: edit.name,
          todolist: edit.todolist,
        });
      })
      .catch((err) => {
        console.log("API Error", err);
      });
    setEditId(id);
  };

  // Delete Button
  const handledelete = (id) => {
    axios
      .delete(`http://localhost:2700/delete/${id}`)
      .then((res) => {
        setData(data.filter((res) => res._id !== id));
        console.log("Deleted Successfully");
      })
      .catch((err) => {
        console.log("Delete API Error", err);
      });
  };

  return (
    <div>
      <form
        onSubmit={handlesubmit}
        className="max-w-lg mx-auto mt-4 bg-[#151515] shadow-md rounded-lg p-6 space-y-4 dark:bg-gray-800"
      >
        <h1 className="text-2xl text-center font-semibold text-white dark:text-gray-200">
          Todo List
        </h1>

        {/* Flex container for inline inputs */}
        <div className="flex space-x-4">
          {/* Left Input: Todo */}
          <input
            type="text"
            name="name"
            placeholder="Enter Todo"
            value={inputuser.name}
            onChange={handlechange}
            className="block w-1/2 p-2 text-sm border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          />

          {/* Right Input: Todolist */}
          <input
            type="text"
            name="todolist"
            placeholder="Enter Todolist"
            value={inputuser.todolist}
            onChange={handlechange}
            className="block w-1/2 p-2 text-sm border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="text-white w-28 bg-[#0C968D] hover:bg-[#0C968D] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-4 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Save
        </button>
      </form>

      {data.map((item) => (
        <div
          key={item._id}
          className="p-4 max-w-lg mx-auto mt-4 border rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 flex items-center justify-between"
        >
          {/* Edit Button */}
          <button
            onClick={() => handleedit(item._id)}
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Edit
          </button>

          {/* Centered Data */}
          <div className="text-center">
            <h2 className="text-sm font-medium text-gray-900 dark:text-white">
              {item.name}
            </h2>
            <p className="text-gray-700 dark:text-gray-400">{item.todolist}</p>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => handledelete(item._id)}
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Home;
