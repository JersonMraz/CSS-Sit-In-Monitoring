import "./ViewResources.scss";
import Sidebar from "../Admin-Sidebar.jsx";
import Navbar from "../Admin-Navbar.jsx";
import { useState, useEffect } from "react";

function ViewResources() {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const [resources, setResources] = useState([]);

    useEffect(() => {
        fetch("http://localhost/Sit-In Monitor Backend/get-resources-admin.php")
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

export default ViewResources;