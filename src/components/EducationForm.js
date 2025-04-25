import React, {useState} from "react"
const EducationForm = ()=>{
    const [form, setForm] = useState({
        degree : '',
        university :'',
        course :'',
        specialization:'',
        course_type:'',
        startdate: new Date().toISOString().slice(0,10),
        enddate : new Date().toISOString().slice(0,10),
        course_duration:'',
        grading_system:'',
        marks:''


    })
    const handelChange = (e) =>{
        setForm({...form, [e.target.name]:e.target.value})
    }
    const handelSubmit =e=>{
        e.preventDefault()
        let userId =1;
        let url='http://127.0.0.1:8000/api/addEducation/'
        let payload = {
            headers:{'Content-Type':'application/json'},
            method :'POST',
            body : JSON.stringify({...form, user:userId})
        };
        fetch(url,payload)
        .then(response =>{
            if (!response.ok) {
                return response.json().then(err=>{
                    throw new Error(err.message || "Unknown error");
                });
            }
            return response.json();
        })
        .then(info =>{
            alert('Saved Successfully :' + info.status);
        })
        .catch(error=>{
            alert('Error :' + error.message);
        });
    }
    return(
        <form onSubmit={handelSubmit} className="container">
            <h1 className="text-bold">Add Education</h1>
            {
                Object.entries(form).map(([key, val]) => (
                    <div key={key}>
                    <label className="text-capitalize">{key}</label>
                    {key === 'project_details' ? (
                        <textarea
                        name={key}
                        value={val}
                        onChange={handelChange}
                        className="form-control"
                        />
                    ) : (
                        <input
                        type={key.includes("date") ? "date" : "text"}
                        name={key}
                        value={val}
                        onChange={handelChange}
                        className="border rounded form-control"
                        />
                    )}
                    </div>
                ))
            }
            <button type="submit">Submit</button>
        </form>
    )
}
export default EducationForm;