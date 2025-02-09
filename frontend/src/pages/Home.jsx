import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import python from "../images/python.png";
import Select from "react-select";
import { api_base_url } from "./helper";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const Home = () => {
  const [isCreateModalShow, setIsCreateModalShow] = useState(false);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [projects, setProjects] = useState(null);
  const [name, setName] = useState("");
  const [isEditModalShow, setIsEditModalShow] = useState(false);
  const [editProjectId, setEditProjectId] = useState("");
  const navigate = useNavigate();

  const customStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "#18181b",
      color: "white",
      borderColor: "#3f3f46",
      padding: "5px",
      borderRadius: "8px",
      boxShadow: "none",
      "&:hover": { borderColor: "#52525b" },
    }),
    menu: (styles) => ({
      ...styles,
      backgroundColor: "#18181b",
      color: "white",
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isSelected
        ? "#3f3f46"
        : isFocused
        ? "#27272a"
        : "#18181b",
      color: "white",
      cursor: "pointer",
    }),
    singleValue: (styles) => ({
      ...styles,
      color: "white",
    }),
  };

  const getRunTimes = async () => {
    try {
      const res = await fetch("https://emkc.org/api/v2/piston/runtimes");
      const data = await res.json();

      const supportedLanguages = [
        "python",
        "java",
        "cpp",
        "c",
        "javascript",
        "bash",
      ];
      const filteredOptions = data
        .filter((runtime) => {
          let lang = runtime.language === "c++" ? "cpp" : runtime.language; // Convert "c++" to "cpp"
          return supportedLanguages.includes(lang);
        })
        .map((runtime) => ({
          label: `${
            runtime.language === "c++" ? "CPP" : runtime.language.toUpperCase()
          } (${runtime.version})`,
          value: runtime.language === "c++" ? "cpp" : runtime.language,
          version: runtime.version,
        }));

      setLanguageOptions(filteredOptions);
    } catch (error) {
      console.error("Error fetching runtimes:", error);
    }
  };
  const getProjects = async () => {
    fetch(api_base_url + "/getProjects", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProjects(data.projects);
        } else {
          toast.error(data.msg);
        }
      });
  };

  useEffect(() => {
    getRunTimes();
    getProjects();
  }, []);

  const createProject = () => {
    fetch(api_base_url + "/createProject", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        projectLanguage: selectedLanguage.value,
        token: localStorage.getItem("token"),
        version: selectedLanguage.version
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setName("");
          navigate("/edit/" + data.projectId);
        } else {
          toast.error(data.msg);
        }
      });
  };
  const deleteProject = (id) => {
    let conf = confirm("Are you sure you want to delete this project ?");
    if (conf) {
      fetch(api_base_url + "/deleteProject", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: id,
          token: localStorage.getItem("token"),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            getProjects();
          } else {
            toast.error(data.msg);
          }
        });
    }
  };
  const editProject = () => {
    fetch(api_base_url + "/editProject", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: editProjectId,
        token: localStorage.getItem("token"),
        name: name
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsEditModalShow(false);
          setName("");
          setEditProjectId("");
          getProjects();
        } else {
          toast.error(data.msg);
        }
      });
  }

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-between mt-5">
        <h3 className="text-2xl px-4">Hi 👋🏻, Akshay</h3>
        <div className="px-10 flex items-center">
          <button
            onClick={() => setIsCreateModalShow(true)}
            className="bg-blue-500 transition-all hover:bg-blue-600 px-3 py-2 rounded-sm cursor-pointer"
          >
            Create Project
          </button>
        </div>
      </div>

      <div className="projects px-24 mt-8">
        {projects && projects.length > 0
          ? projects.map((project, index) => {
              return (
                <>
                  <div className="project w-full p-3.5 flex items-center justify-between bg-zinc-800 rounded-lg mt-3">
                    <div
                      onClick={() => navigate("/edit/" + project._id)}
                      className="w-full flex items-center gap-4.5"
                    >
                      {project.projectLanguage === "python" ? (
                        <>
                          <img
                            className="w-16 rounded-[50%]"
                            src="https://img.icons8.com/color/48/000000/python.png"
                            alt="Python"
                          />
                        </>
                      ) : project.projectLanguage === "java" ? (
                        <>
                          <img
                            className="w-16 rounded-[50%]"
                            src="https://img.icons8.com/color/48/000000/java.png"
                            alt="Java"
                          />
                        </>
                      ) : project.projectLanguage === "cpp" ? (
                        <>
                          <img
                            className="w-16 rounded-[50%]"
                            src="https://img.icons8.com/color/48/000000/c-plus-plus-logo.png"
                            alt="C++"
                          />
                        </>
                      ) : project.projectLanguage === "c" ? (
                        <>
                          <img
                            className="w-16 rounded-[50%]"
                            src="https://img.icons8.com/color/48/000000/c.png"
                            alt="C"
                          />
                        </>
                      ) : project.projectLanguage === "javascript" ? (
                        <>
                          <img
                            className="w-16 rounded-[50%]"
                            src="https://img.icons8.com/color/48/000000/javascript.png"
                            alt="JavaScript"
                          />
                        </>
                      ) : project.projectLanguage === "bash" ? (
                        <>
                          <img
                            className="w-16 rounded-[50%]"
                            src="https://img.icons8.com/color/48/000000/bash.png"
                            alt="Bash"
                          />
                        </>
                      ) : (
                        ""
                      )}
                      <div>
                        <h3 className="text-xl">{project.name}</h3>
                        <p className="text-sm text-gray-500">{new Date(project.date).toDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <button onClick={() =>{setIsEditModalShow(true);setEditProjectId(project._id);setName(project.name);}} className="bg-yellow-500 text-zinc-800 px-3 py-2 rounded-sm cursor-pointer">
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProject(project._id)}
                        className="bg-red-700 px-3 py-2 rounded-sm cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              );
            })
          : "No Projects Found !"}
      </div>

      {isCreateModalShow && (
        <div
          onClick={(e) => {
            if (e.target.classList.contains("modalContainer")) {
              setIsCreateModalShow(false);
              setName("")
            }
          }}
          className="modalContainer flex flex-col items-center justify-center w-screen h-screen fixed top-0 left-0"
        >
          <div className="modalBox flex flex-col gap-3 items-start p-5 w-1/4 bg-zinc-700 rounded-lg">
            <h3 className="text-xl font-bold">Create Project</h3>
            <div className="inputBox w-full">
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-zinc-900 px-3 py-2 rounded-sm w-full"
                type="text"
                placeholder="Enter Project Name"
              />
            </div>
            <Select
              options={languageOptions}
              styles={customStyles}
              placeholder="Select Language"
              onChange={setSelectedLanguage}
            />
            {selectedLanguage && (
              <button
                onClick={createProject}
                className="bg-blue-500 hover:bg-blue-600 px-3 py-2 mt-3 rounded-sm cursor-pointer w-full"
              >
                Create
              </button>
            )}
          </div>
        </div>
      )}

      {isEditModalShow && (
        <div
          onClick={(e) => {
            if (e.target.classList.contains("modalContainer")) {
              setIsEditModalShow(false);
              setName("")
            }
          }}
          className="modalContainer flex flex-col items-center justify-center w-screen h-screen fixed top-0 left-0"
        >
          <div className="modalBox flex flex-col gap-3 items-start p-5 w-1/4 bg-zinc-700 rounded-lg">
            <h3 className="text-xl font-bold">Update Project</h3>
            <div className="inputBox w-full">
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-zinc-900 px-3 py-2 rounded-sm w-full"
                type="text"
                placeholder="Enter Project Name"
              />
            </div>
            
            
              <button
                onClick={editProject}
                className="bg-yellow-500 px-3 py-2 mt-3 rounded-sm cursor-pointer w-full"
              >
                Update
              </button>
            
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
