import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import Navbar from "../components/Navbar";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { api_base_url } from "./helper";
import { toast } from "react-toastify";

const Edit = () => {
  const [code, setCode] = useState("");
  const [data, setData] = useState(null);
  const [output, setOutput] = useState("");
  
  let {id} = useParams();
  useEffect(() => {
    
    fetch(api_base_url + "/getProject", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        projectId: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCode(data.project.code);
          setData(data.project);
        } else {
          toast.error(data.msg);
        }
      });
  },[]);

  const savedProject = () => {
    fetch(api_base_url + "/savedProject", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        projectId: id,
        code: code,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success(data.msg);
        } else {
          toast.error(data.msg);
        }
      });
  };

  
  useEffect(() => {
    const handleSaveShortcut = (e) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        savedProject();
      }
    };
    document.addEventListener("keydown", handleSaveShortcut);

    return () => {
      document.removeEventListener("keydown", handleSaveShortcut);
    };
  }, [savedProject]);

  const runProject = () => {
    fetch('https://emkc.org/api/v2/piston/execute',
    {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: data.projectLanguage,
        version: data.version,
        files:[
          {
            filename: data.name+ data.projectLanguage === 'python' ?'.py': data.projectLanguage === 'cpp' ?'.cpp': data.projectLanguage === 'c' ?'.c': data.projectLanguage === 'bash' ?'.sh': data.projectLanguage === 'java' ?'.java': 'js',
            content: code
          }
        ]
      })
    }).then(res => res.json()).then(data => {
      console.log(data);
      setOutput(data.run.output)
      
    })
  }
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-between" style={{ height: "calc(100vh-64px)" }}>
        <div className="left h-full w-1/2">
        <Editor height="100vh" language="javascript" value={code} onChange={newCode => setCode(newCode)} />
        </div>

        <div className="right w-1/2 h-full p-4 mb-auto ">
          <div className="flex items-center justify-between px-7 border-b-2 border-b-zinc-800 pb-3">
          <p className="p-0 m-0">Output</p>
          <button onClick={runProject} className="bg-blue-500 px-3 py-2 rounded-sm cursor-pointer">Run</button>
        </div>
        <pre className="w-full h-[75vh] text-nowrap">{output}</pre>
      </div>
    </div>
  </>
  );
};

export default Edit;
