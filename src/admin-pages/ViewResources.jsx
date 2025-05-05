import "./ViewResources.scss";
import Sidebar from "../Admin-Sidebar.jsx";
import Navbar from "../Admin-Navbar.jsx";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';

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
    
    const deleteFile = async (id) => {
        console.log(id);
        Swal.fire({
            title: "Delete file",
            text: "Are you sure you want to delete this file?",
            icon: "question",
            showCancelButton: true,
            cancelButtonText: "Cancel",
            confirmButtonText: "Yes, delete",
            confirmButtonColor: "#e74c3c"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch("http://localhost/Sit-In Monitor Backend/delete-resource.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: selectedResource.id }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.status === "success") {
                            Swal.fire({
                                title: "Deleted!",
                                text: data.message,
                                icon: "success",
                                confirmButtonText: "OK",
                            });
                            setResources(resources.filter((resource) => resource.id !== selectedResource.id));
                            closeModal();
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: data.message,
                            });
                        }
                    })
                    .catch((error) => {
                        console.error("Error deleting file:", error);
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "An error occurred while deleting the file.",
                        });
                    });
            };
        });
    }

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
                            onClick={(e) => e.stopPropagation()} 
                        >
                            <button className="close-btn" onClick={closeModal}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                            <i className={selectedResource.icon} id="file"></i>
                            <h2>{selectedResource.filename}</h2>
                            <p><strong>Description:</strong> {selectedResource.description}</p>
                            <p><strong>Date Created:</strong> {selectedResource.dateCreated}</p>
                            <p><strong>Published By:</strong> {selectedResource.publishedBy}</p>
                            <div className="btns">
                                <a download={selectedResource.filename} href={selectedResource.filepath} className="download-btn">
                                    <i className="fa-solid fa-download"></i> Download
                                </a>
                                <button className="delete-file-btn" onClick={() => deleteFile(selectedResource.id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewResources;