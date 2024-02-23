import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const LeaveRequest = () => 
{
    const [leave_details, setLeaveDetails] = useState();
    const [file, setFile] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => 
    {
        fetch(`/leave-applications/${id}`)
        .then(response => response.json())
        .then(data => setLeaveDetails(data))
    }, [id]);

    //useEffect hook to fetch the file from the uploads folder if it exists
    useEffect(() => 
    {
        if (leave_details && leave_details.file_attachment) 
        {
            fetch(`/static/${leave_details.file_attachment}`)
            .then(response => response.blob())
            .then(data => setFile(data))
        }
    }, [leave_details]);

    // If the array is null, display a loading message
    if (!leave_details) 
    {
        return <div>Fetching leave details...</div>;
    }

    //Destructuring the state object
    const {leave_type, leave_duration, start_date, end_date, total_days, reason, hod_status, hr_status, gm_status} = leave_details;

    return (
        <>
            <section className="row mt-2">
                <div className="col-md-12 d-flex justify-content-between align-items-center">
                    <h1 className="fw-bolder text-uppercase fs-3">Leave Request Details</h1>
                    <div className="btn btn-success" onClick={() => navigate(-1)}>Go back</div>
                </div>
                <div className="col-md-6 mb-3">
                    <p className="form-label">Leave Type</p>
                    <input type="text" className="form-control" value={leave_type} disabled />
                </div>
                <div className="col-md-6 mb-3">
                    <p className="form-label">Leave Duration</p>
                    <input type="text" className="form-control" value={leave_duration} disabled />
                </div>
                <div className="col-md-4 mb-3">
                    <p className="form-label">Start Date</p>
                    <input type="text" className="form-control" value={start_date} disabled />
                </div>
                <div className="col-md-4 mb-3">
                    <p className="form-label">End Date</p>
                    <input type="text" className="form-control" value={end_date} disabled />
                </div>
                <div className="col-md-4 mb-3">
                    <p className="form-label">Number of days</p>
                    <input type="text" className="form-control" value={total_days} disabled />
                </div>
                <div className="col-md-6 mb-3">
                    <p className="form-label">File Attachment</p>
                    {
                        file
                        ?
                            <a href={URL.createObjectURL(file)} target="_blank" rel="noopener noreferrer" className="form-control" disabled>View file attachment</a>
                        :
                            <input className="form-control" value={"No file attachment"} disabled></input>
                    }
                </div>
                <div className="col-md-6 mb-3">
                    <p className="form-label">Reason for leave</p>
                    <input type="text" className="form-control" value={reason || "No reason provided"} disabled />
                </div>
                <h2 className="text-uppercase fw-bold mt-2 fs-3">Approval status</h2>
                <div className="col-md-4 mb-3">
                    <p className="form-label">Head of Department</p>
                    <input type="text" className="form-control" value={hod_status} disabled />
                </div>
                <div className="col-md-4 mb-3">
                    <p className="form-label">General Manager</p>
                    <input type="text" className="form-control" value={gm_status} disabled />
                </div>
                <div className="col-md-4 mb-3">
                    <p className="form-label">Human Resource Manager</p>
                    <input type="text" className="form-control" value={hr_status} disabled />
                </div>
            </section>
        </>
    );
};

export default LeaveRequest;
