import "./LabResources.scss";
import Sidebar from "../Sidebar.jsx";
import Navbar from "../navbar.jsx";
import { useState, useEffect } from "react";

function LabResources() {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const [resources, setResources] = useState([]);

    useEffect(() => {
        fetch("http://localhost/Sit-In Monitor Backend/get-resources.php")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setResources(data.resources);
                } else {
                    console.error("Error fetching resources:", data.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching resources:", error);
            });
    }, []);

    // const resources = [
    //     {
    //         id: 1,
    //         title: "Lab Report.pdf",
    //         description: "This is the lab report for the experiment conducted on April 2025.",
    //         dateCreated: "Apr 24, 2025",
    //         publishedBy: "Admin",
    //         icon: "fa-solid fa-file-pdf",
    //     },
    //     {
    //         id: 2,
    //         title: "Lab Manual.docx",
    //         description: "This is the lab manual for the upcoming experiments.",
    //         dateCreated: "Apr 24, 2025",
    //         publishedBy: "Admin",
    //         icon: "fa-solid fa-file-word",
    //     },
    //     {
    //         id: 3,
    //         title: "Lab Diagram.png",
    //         description: "This is the lab diagram for the experiment setup.",
    //         dateCreated: "Apr 24, 2025",
    //         publishedBy: "Admin",
    //         icon: "fa-solid fa-file-image",
    //     },
    //     {
    //         id: 4,
    //         title: "Lab Safety Guidelines.pdf",
    //         description: "This document contains the safety guidelines for the lab.",
    //         dateCreated: "Apr 24, 2025",
    //         publishedBy: "Admin",
    //         icon: "fa-solid fa-file-pdf",
    //     },
    //     {
    //         id: 5,
    //         title: "Lab Equipment List.xlsx",
    //         description: "This is the list of equipment available in the lab.",
    //         dateCreated: "Apr 24, 2025",
    //         publishedBy: "Admin",
    //         icon: "fa-solid fa-file-excel",
    //     },
    //     {
    //         id: 6,
    //         title: "Lab Experiment Schedule.docx",
    //         description: "This document contains the schedule for upcoming lab experiments.",
    //         dateCreated: "Apr 24, 2025",
    //         publishedBy: "Admin",
    //         icon: "fa-solid fa-file-word",
    //     },
    //     {
    //         id: 7,
    //         title: "Lab Safety Training Video.mp4",
    //         description: "This is the safety training video for the lab.",
    //         dateCreated: "Apr 24, 2025",
    //         publishedBy: "Admin",
    //         icon: "fa-solid fa-video",
    //     },
    //     {
    //         id: 8,
    //         title: "Lab Experiment Results.xlsx",
    //         description: "This document contains the results of the recent lab experiments.",
    //         dateCreated: "Apr 24, 2025",
    //         publishedBy: "Admin",
    //         icon: "fa-solid fa-file-excel",
    //     },
    //     {
    //         id: 9,
    //         title: "Lab Research Paper.pdf",
    //         description: "This is the research paper based on the lab experiments conducted.",
    //         dateCreated: "Apr 24, 2025",
    //         publishedBy: "Admin",
    //         icon: "fa-solid fa-file-pdf",
    //     },
    //     {
    //         id: 10,
    //         title: "Lab Experiment Protocol.docx",
    //         description: "This document contains the protocol for conducting the lab experiment.",
    //         dateCreated: "Apr 24, 2025",
    //         publishedBy: "Admin",
    //         icon: "fa-solid fa-file-word",
    //     },
    //     {
    //         id: 11,
    //         title: "Lab Equipment Maintenance Log.xlsx",
    //         description: "This is the maintenance log for the lab equipment.",
    //         dateCreated: "Apr 24, 2025",
    //         publishedBy: "Admin",
    //         icon: "fa-solid fa-file-excel",
    //     },
    //     {
    //         id: 12,
    //         title: "Lab Experiment Feedback Form.docx",
    //         description: "This document contains the feedback form for the lab experiment.",
    //         dateCreated: "Apr 24, 2025",
    //         publishedBy: "Admin",
    //         icon: "fa-solid fa-file-word",
    //     },
    // ];

    const handleResourceClick = (resource) => {
        setSelectedResource(resource);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedResource(null);
    };
    

    return (
        <div>
            <Sidebar />
            <Navbar />
            <div className="lab-resources-wrapper">
                <h1>Lab Resources</h1>
                <div className="lab-resources-list">
                    {resources.map((resource) => (
                        <div
                            key={resource.id}
                            className="resource-item"
                            onClick={() => handleResourceClick(resource)}
                        >
                            <p className="published-on">{resource.dateCreated}</p>
                            <i className={resource.icon}></i>
                            <span>{resource.filename}</span>
                            <a download={resource.filename} href={resource.filepath} className="download-link">
                                <i className="fa-solid fa-download"></i> Download
                            </a>
                        </div>
                    ))}
                </div>

                {modalVisible && selectedResource && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                        >
                            <button className="close-btn" onClick={closeModal}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                            <i className={selectedResource.icon} id="file"></i>
                            <h2>{selectedResource.filename}</h2>
                            <p><strong>Description:</strong> {selectedResource.description}</p>
                            <p><strong>Date Created:</strong> {selectedResource.dateCreated}</p>
                            <p><strong>Published By:</strong> {selectedResource.publishedBy}</p>
                            <button className="download-btn">
                                <i className="fa-solid fa-download"></i> Download
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LabResources;