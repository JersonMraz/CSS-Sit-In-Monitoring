import "./Resources.scss";
import Sidebar from "../Admin-Sidebar.jsx";
import Navbar from "../Admin-Navbar.jsx";
import { useState } from "react";
import Swal from "sweetalert2";

function Resources() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileIcon, setFileIcon] = useState("fa-solid fa-file");
    const [fileSize, setFileSize] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileExtension = file.name.split(".").pop().toLowerCase();
            setSelectedFile(file);

            const iconMap = {
                pdf: "fa-solid fa-file-pdf",
                docx: "fa-solid fa-file-word",
                doc: "fa-solid fa-file-word",
                csv: "fa-solid fa-file-csv",
                png: "fa-solid fa-file-image",
                ppt: "fa-solid fa-file-ppt",
                html: "fa-brands fa-html5",
                css: "fa-brands fa-css3-alt",
                php: "fa-brands fa-php",
                js: "fa-brands fa-js",
                jpg: "fa-solid fa-file-image",
                xls: "fa-solid fa-file-excel",
            };

            setFileIcon(iconMap[fileExtension] || "fa-solid fa-file");

            const sizeInKB = file.size / 1024;
            const sizeInMB = sizeInKB / 1024;
            setFileSize(sizeInMB >= 1 ? `${sizeInMB.toFixed(2)} MB` : `${sizeInKB.toFixed(2)} KB`);
        }
        event.target.value = null;
    };

    const handleUpload = () => {
        if(!selectedFile) {
            Swal.fire({
                icon: "error",
                title: "No file selected",
                text: "Please select a file to upload.",
            });
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to upload this resource?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, upload it!",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                formData.append("filesize", fileSize);
                formData.append("available-to", document.getElementById("available-to").value);
                formData.append("description", document.getElementById("description").value);
                fetch("http://localhost/Sit-In Monitor Backend/upload-resource.php", {
                    method: "POST",
                    body: formData,
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.status === "success") {
                            Swal.fire({
                                title: "Uploaded!",
                                text: data.message,
                                icon: "success",
                                confirmButtonText: "OK",
                            });
                            setSelectedFile(null); 
                            setFileSize(null);
                            document.getElementById("available-to").value = "All Users";
                            document.getElementById("description").value = "";
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Upload Failed",
                                text: data.message,
                            });
                        }
                    })
                    .catch((error) => {
                        console.error("Error uploading file:", error);
                        Swal.fire({
                            icon: "error",
                            title: "Upload Failed",
                            text: "An error occurred while uploading the resource.",
                        });
                    });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Handle cancellation
                Swal.fire({
                    title: "Cancelled",
                    text: "Your upload has been canceled.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        });
    }

    return(
        <div>
            <Sidebar />
            <Navbar />
            <div className="resources-wrapper">
                <h1>Upload Resources</h1>
                <div className="resources-content">
                    <div className="upload-box">
                        <div className="upload-area" onClick={() => document.getElementById("file-input").click()}>
                            {!selectedFile ? (
                                <>
                                    <i className="fa-solid fa-cloud-arrow-up"></i>
                                    <p>Drag & drop files here or click to browse</p>
                                </>
                            ) : (
                                <div className="file-preview">
                                    <i className={fileIcon}></i>
                                    <p>{selectedFile.name}</p>
                                    <p className="file-size">{fileSize}</p>
                                </div>
                            )}
                            <input
                                type="file"
                                id="file-input"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                                accept=".pdf,.docx,.doc,.csv,.png,.ppt,.html,.css,.php,.js,.jpg,.xls"
                            />
                            <button
                                className="select-file-btn"
                                onClick={() => document.getElementById("file-input").click()}
                            >
                                Select File
                            </button>
                            <p className="file-size-info">Max file size: 25MB</p>
                        </div>
                        <div className="form-fields">
                            <div className="form-group">
                                <label htmlFor="available-to">Exclusive For</label>
                                <select id="available-to">
                                    <option>All Users</option>
                                    <option>Admins</option>
                                    <option>Students</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea id="description" placeholder="Enter description"></textarea>
                            </div>
                        </div>
                        <button className="upload-btn" onClick={handleUpload}>
                            <i className="fa-solid fa-cloud-arrow-up"></i> Upload Resource
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Resources;