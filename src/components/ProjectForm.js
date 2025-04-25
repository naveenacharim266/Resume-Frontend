import React,{useState} from "react";

const Project =()=>{
 const [form, setForm] = useState({
    project_title:'',
    role:'',
    client:'',
    startdate:new Date().toISOString().slice(0,10),
    enddate:new Date().toISOString().slice(0,10),
    project_details:''
 })
 const handleChange=(e)=>{
    setForm({...form, [e.target.name]:e.target.value})
 }
 const handleSubmit =(e)=>{
    e.preventDefault();
    let url = 'http://127.0.0.1:8000/api/addProjects/'
    let userId =1 ;
    let postData = {
        headers: {'Content-type' : 'application/json'},
        method:'POST',
        body:JSON.stringify({...form, user:userId})
    }
    fetch(url,postData)
    .then(response=>{
        if(!response.ok){
           return response.json().then(err =>{
            throw new Error(err.message||"Unknown error");
           });
        }
        return response.json();
    })
    .then(info=>{
        alert('saved Successfully :' + info.status);
    })
    .catch(error=>{
        alert('Error: ' + error.message);
    })

 }


return(
    <form className="container" onSubmit={handleSubmit}>
        <h1>Add Project</h1>
        {
            Object.entries(form).map(([key, value])=>(
                <div key={key} className="">
                    <label className="text-capitalize m-2">{key}</label>
                    <input className="form-control" 
                    type={key.includes("date")? "date":"text"}
                    name={key} 
                    value={value} 
                    onChange={handleChange}/>
                </div>
            ))
        }
        <button type="submit">Submit</button>
    </form>
)
}

export default Project;