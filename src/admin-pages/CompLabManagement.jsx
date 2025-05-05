import { useState, useEffect } from "react";
import Sidebar from "../Admin-Sidebar.jsx";
import Navbar from "../Admin-Navbar.jsx";
import "./CompLabManagement.scss";
import Swal from "sweetalert2";

function CompLabManagement() {
    const [selectedDay, setSelectedDay] = useState("Lab 524");
    const [selectedComponent, setSelectedComponent] = useState("Lab 524");

    return(
        <div>
            <Sidebar />
            <Navbar />
            <div className="complab-wrapper">
                <h1>Computer Management</h1>
                <div className="complab-container">
                    <div className="navigation">
                        <ul>
                            <li className={selectedDay === "Lab 524" ? "active" : ""} onClick={() => {setSelectedDay("Lab 524"); setSelectedComponent("Lab 524")}}>
                                <a>
                                    Lab 524
                                </a>
                            </li>
                            <li className={selectedDay === "Lab 526" ? "active" : ""} onClick={() => {setSelectedDay("Lab 526"); setSelectedComponent("Lab 526")}}>
                                <a>
                                    Lab 526
                                </a>
                            </li>
                            <li className={selectedDay === "Lab 528" ? "active" : ""} onClick={() => {setSelectedDay("Lab 528"); setSelectedComponent("Lab 528")}}>
                                <a>
                                    Lab 528
                                </a>
                            </li>
                            <li className={selectedDay === "Lab 530" ? "active" : ""} onClick={() => {setSelectedDay("Lab 530"); setSelectedComponent("Lab 530")}}>
                                <a>
                                    Lab 530
                                </a>
                            </li>
                            <li className={selectedDay === "Lab 542" ? "active" : ""} onClick={() => {setSelectedDay("Lab 542"); setSelectedComponent("Lab 542")}}>
                                <a>
                                    Lab 542
                                </a>
                            </li>
                            <li className={selectedDay === "Lab 544" ? "active" : ""} onClick={() => {setSelectedDay("Lab 544"); setSelectedComponent("Lab 544")}}>
                                <a>
                                    Lab 544
                                </a>
                            </li>
                            <li className={selectedDay === "Lab 517" ? "active" : ""} onClick={() => {setSelectedDay("Lab 517"); setSelectedComponent("Lab 517")}}>
                                <a>
                                    Lab 517
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="table-complab-container">
                        <p className="complab-container-h2">{selectedDay}</p>
                        {selectedComponent === "Lab 524" && <Lab524 />}
                        {selectedComponent === "Lab 526" && <Lab526 />}
                        {selectedComponent === "Lab 528" && <Lab528 />}
                        {selectedComponent === "Lab 542" && <Lab542 />}
                        {selectedComponent === "Lab 544" && <Lab544 />}
                        {selectedComponent === "Lab 530" && <Lab530 />}
                        {selectedComponent === "Lab 517" && <Lab517 />}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Lab524() {
    useEffect(() => {
        fetch("http://localhost/Sit-In Monitor Backend/getPCs.php?lab_room=Lab 524")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setPcs(data.pcs);
                    setPcCounts(data.pc_counts);
                } else {
                    console.error("Failed to fetch PCs:", data.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching PCs:", error);
            });
    }, []);
    
    const [pcs, setPcs] = useState([]);
    const [pcCounts, setPcCounts] = useState({ available: 0, occupied: 0, maintenance: 0 });
    const [filter, setFilter] = useState("all");
    const [selectedPcs, setSelectedPcs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);    

    const filteredPcs = pcs.filter((pc) => {
        if (filter === "all") return true;
        return pc.pc_status.toLowerCase() === filter;
    });

    const togglePcSelection = (pc) => {
        if (selectedPcs.some((selected) => selected.pc_num === pc.pc_num)) {
            setSelectedPcs(selectedPcs.filter((selected) => selected.pc_num !== pc.pc_num));
        } else {
            setSelectedPcs([...selectedPcs, pc]);
        }
    };

    const handleUpdateStatus = (newStatus) => {
        if (selectedPcs.length > 0) {
            const pcNums = selectedPcs.map((pc) => pc.pc_num);
            const oldStatus = selectedPcs.map((pc) => pc.pc_status);
            console.log(pcNums);
            console.log(newStatus);
            Swal.fire({
                title: "Update confirmation",
                icon: "question",
                text: `You are going to change PC status to ${newStatus}. Are you sure to proceed?`,
                showCancelButton: true,
                confirmButtonText: "Yes, proceed.",
                cancelButtonText: "Cancel",
                cancelButtonColor: "#f44336"
            }).then((result) => {
                if(result.isConfirmed) {
                    fetch("http://localhost/Sit-In Monitor Backend/updateStatus.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            pcs: pcNums,
                            newStatus: newStatus,
                            room: "Lab 524",
                        }),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.status === "success") {
                                const updatedPcs = pcs.map((pc) =>
                                    pcNums.includes(pc.pc_num) ? { ...pc, pc_status: newStatus } : pc
                                );
                                setPcs(updatedPcs);
                                setSelectedPcs([]); // Clear the selection
                                setIsModalOpen(false); // Close the modal
                                Swal.fire({
                                   title: "Successfully updated!",
                                   text: `Status updated to ${newStatus}`,
                                   timer: 1800,
                                   timerProgressBar: true,
                                   showConfirmButton: false,
                                });
                            } else {
                                alert(data.message || "Failed to update PC statuses");
                            }
                        })
                        .catch((error) => {
                            console.error("Error updating PC statuses:", error);
                            alert("An error occurred while updating PC statuses");
                        });
                } else {
                    setSelectedPcs([]); // Clear the selection
                    setIsModalOpen(false);
                }
            });
        } else {
            alert("Please at least one PC to update.");
        }
    };

    const handleSelectPcChange = (e) => {
        const value = e.target.value.toLowerCase();
        if (value === "all") {
            setSelectedPcs(pcs);
        } else {
            const filtered = pcs.filter((pc) => pc.pc_status.toLowerCase() === value);
            setSelectedPcs(filtered);
        }
    };

    return (
        <div className="pc-wrapper">
            <div className="pc-filter">
                <div className="pc-filter-container">
                    <div className="more-text">
                        <p className="pc-update-text">Filter PCs</p>
                        
                        <div className="countpcs">
                            <p className="availablePc"><span className="greenCircle" />Available: {pcCounts.available || 0}</p>
                            <p className="occupiedPc"><span className="redCircle" />Occupied: {pcCounts.occupied || 0}</p>
                            <p className="maintenancePc"><span className="yellowCircle" />Maintenance: {pcCounts.maintenance || 0}</p>
                        </div>
                    </div>
                    <div className="select-button">
                        <select
                            className="pc-select"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                        <select
                            className="select-pc"
                            onChange={handleSelectPcChange}
                        >
                            <option value="" disabled selected>Select PC</option>
                            <option value="all">All</option>
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                        <button
                            className="update-button"
                            onClick={() => {
                                if (selectedPcs.length > 0) {
                                    setIsModalOpen(true);
                                    // alert(`Selected PCs: ${selectedPcs.map((pc) => pc.pc_num).join(", ")}`);
                                } else {
                                    alert("Please select at least one PC to update.");
                                }
                            }}
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
            <div className="pc-container">
                {filteredPcs.map((pc) => (
                    <div
                        key={pc.pc_num}
                        className={`pc-item pc-item-${pc.pc_status.toLowerCase()} ${
                            selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "selected" : ""
                        }`}
                        onClick={() => togglePcSelection(pc)}
                        style={{
                            backgroundColor: selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "#2196F3" : "",
                            color: selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "#fff" : "",
                            border: selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "1px solid #2196F3" : "",
                        }}
                    >
                        <i className="fa-solid fa-desktop"></i>
                        <p className="pc-num">{pc.pc_num}</p>
                        <p className="status">{pc.pc_status}</p>
                    </div>
                ))}
            </div>
            {/* Modal */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="header-modal">
                            <span className="close-modal" onClick={() => setIsModalOpen(false)}>&#9932;</span>
                            <h3 className="modal-update-title">Update PC</h3>
                            {/* <p className="modal-update-selected">{selectedPcs.map((pc) => pc.pc_num).join(", ")}</p> */}
                            <p className="modal-update-selected">
                                {selectedPcs.map((pc) => (
                                    <span key={pc.pc_num} className="selected-span">{pc.pc_num},</span>
                                ))}
                            </p>
                        </div>
                        <div className="modal-buttons">
                            <button className="available-btn" onClick={() => handleUpdateStatus("available")}>Available</button>
                            <button className="occupied-btn" onClick={() => handleUpdateStatus("occupied")}>Occupied</button>
                            <button className="maintenance-btn" onClick={() => handleUpdateStatus("maintenance")}>Maintenance</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Lab526() {
    useEffect(() => {
        fetch("http://localhost/Sit-In Monitor Backend/getPCs.php?lab_room=Lab 526")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setPcs(data.pcs);
                    setPcCounts(data.pc_counts);
                } else {
                    console.error("Failed to fetch PCs:", data.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching PCs:", error);
            });
    }, []);

    const [pcs, setPcs] = useState([]);
    const [pcCounts, setPcCounts] = useState({ available: 0, occupied: 0, maintenance: 0 });
    const [filter, setFilter] = useState("all");
    const [selectedPcs, setSelectedPcs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);    

    const filteredPcs = pcs.filter((pc) => {
        if (filter === "all") return true;
        return pc.pc_status.toLowerCase() === filter;
    });

    const togglePcSelection = (pc) => {
        if (selectedPcs.some((selected) => selected.pc_num === pc.pc_num)) {
            setSelectedPcs(selectedPcs.filter((selected) => selected.pc_num !== pc.pc_num));
        } else {
            setSelectedPcs([...selectedPcs, pc]);
        }
    };

    const handleUpdateStatus = (newStatus) => {
        if (selectedPcs.length > 0) {
            const pcNums = selectedPcs.map((pc) => pc.pc_num);
            const oldStatus = selectedPcs.map((pc) => pc.pc_status);
            console.log(pcNums);
            console.log(newStatus);
            Swal.fire({
                title: "Update confirmation",
                icon: "question",
                text: `You are going to change PC status to ${newStatus}. Are you sure to proceed?`,
                showCancelButton: true,
                confirmButtonText: "Yes, proceed.",
                cancelButtonText: "Cancel",
                cancelButtonColor: "#f44336"
            }).then((result) => {
                if(result.isConfirmed) {
                    fetch("http://localhost/Sit-In Monitor Backend/updateStatus.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            pcs: pcNums,
                            newStatus: newStatus,
                            room: "Lab 526",
                        }),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.status === "success") {
                                const updatedPcs = pcs.map((pc) =>
                                    pcNums.includes(pc.pc_num) ? { ...pc, pc_status: newStatus } : pc
                                );
                                setPcs(updatedPcs);
                                setSelectedPcs([]); // Clear the selection
                                setIsModalOpen(false); // Close the modal
                                Swal.fire({
                                   title: "Successfully updated!",
                                   text: `Status updated to ${newStatus}`,
                                   timer: 1800,
                                   timerProgressBar: true,
                                   showConfirmButton: false,
                                });
                            } else {
                                alert(data.message || "Failed to update PC statuses");
                            }
                        })
                        .catch((error) => {
                            console.error("Error updating PC statuses:", error);
                            alert("An error occurred while updating PC statuses");
                        });
                } else {
                    setSelectedPcs([]); // Clear the selection
                    setIsModalOpen(false);
                }
            });
        } else {
            alert("Please at least one PC to update.");
        }
    };

    const handleSelectPcChange = (e) => {
        const value = e.target.value.toLowerCase();
        if (value === "all") {
            setSelectedPcs(pcs);
        } else {
            const filtered = pcs.filter((pc) => pc.pc_status.toLowerCase() === value);
            setSelectedPcs(filtered);
        }
    };

    return (
        <div className="pc-wrapper">
            <div className="pc-filter">
                <div className="pc-filter-container">
                    <div className="more-text">
                        <p className="pc-update-text">Filter PCs</p>
                        
                        <div className="countpcs">
                            <p className="availablePc"><span className="greenCircle" />Available: {pcCounts.available || 0}</p>
                            <p className="occupiedPc"><span className="redCircle" />Occupied: {pcCounts.occupied || 0}</p>
                            <p className="maintenancePc"><span className="yellowCircle" />Maintenance: {pcCounts.maintenance || 0}</p>
                        </div>
                    </div>
                    <div className="select-button">
                        <select
                            className="pc-select"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                        <select
                            className="select-pc"
                            onChange={handleSelectPcChange}
                        >
                            <option value="" disabled selected>Select PC</option>
                            <option value="all">All</option>
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                        <button
                            className="update-button"
                            onClick={() => {
                                if (selectedPcs.length > 0) {
                                    setIsModalOpen(true);
                                    // alert(`Selected PCs: ${selectedPcs.map((pc) => pc.pc_num).join(", ")}`);
                                } else {
                                    alert("Please select at least one PC to update.");
                                }
                            }}
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
            <div className="pc-container">
                {filteredPcs.map((pc) => (
                    <div
                        key={pc.pc_num}
                        className={`pc-item pc-item-${pc.pc_status.toLowerCase()} ${
                            selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "selected" : ""
                        }`}
                        onClick={() => togglePcSelection(pc)}
                        style={{
                            backgroundColor: selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "#2196F3" : "",
                            color: selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "#fff" : "",
                            border: selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "1px solid #2196F3" : "",
                        }}
                    >
                        <i className="fa-solid fa-desktop"></i>
                        <p className="pc-num">{pc.pc_num}</p>
                        <p className="status">{pc.pc_status}</p>
                    </div>
                ))}
            </div>
            {/* Modal */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="header-modal">
                            <span className="close-modal" onClick={() => setIsModalOpen(false)}>&#9932;</span>
                            <h3 className="modal-update-title">Update PC</h3>
                            {/* <p className="modal-update-selected">{selectedPcs.map((pc) => pc.pc_num).join(", ")}</p> */}
                            <p className="modal-update-selected">
                                {selectedPcs.map((pc) => (
                                    <span key={pc.pc_num} className="selected-span">{pc.pc_num},</span>
                                ))}
                            </p>
                        </div>
                        <div className="modal-buttons">
                            <button className="available-btn" onClick={() => handleUpdateStatus("available")}>Available</button>
                            <button className="occupied-btn" onClick={() => handleUpdateStatus("occupied")}>Occupied</button>
                            <button className="maintenance-btn" onClick={() => handleUpdateStatus("maintenance")}>Maintenance</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Lab528() {
    useEffect(() => {
        fetch("http://localhost/Sit-In Monitor Backend/getPCs.php?lab_room=Lab 528")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setPcs(data.pcs);
                    setPcCounts(data.pc_counts);
                } else {
                    console.error("Failed to fetch PCs:", data.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching PCs:", error);
            });
    }, []);

    const [pcs, setPcs] = useState([]);
    const [pcCounts, setPcCounts] = useState({ available: 0, occupied: 0, maintenance: 0 });
    const [filter, setFilter] = useState("all");
    const [selectedPcs, setSelectedPcs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);    

    const filteredPcs = pcs.filter((pc) => {
        if (filter === "all") return true;
        return pc.pc_status.toLowerCase() === filter;
    });

    const togglePcSelection = (pc) => {
        if (selectedPcs.some((selected) => selected.pc_num === pc.pc_num)) {
            setSelectedPcs(selectedPcs.filter((selected) => selected.pc_num !== pc.pc_num));
        } else {
            setSelectedPcs([...selectedPcs, pc]);
        }
    };

    const handleUpdateStatus = (newStatus) => {
        if (selectedPcs.length > 0) {
            const pcNums = selectedPcs.map((pc) => pc.pc_num);
            const oldStatus = selectedPcs.map((pc) => pc.pc_status);
            console.log(pcNums);
            console.log(newStatus);
            Swal.fire({
                title: "Update confirmation",
                icon: "question",
                text: `You are going to change PC status to ${newStatus}. Are you sure to proceed?`,
                showCancelButton: true,
                confirmButtonText: "Yes, proceed.",
                cancelButtonText: "Cancel",
                cancelButtonColor: "#f44336"
            }).then((result) => {
                if(result.isConfirmed) {
                    fetch("http://localhost/Sit-In Monitor Backend/updateStatus.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            pcs: pcNums,
                            newStatus: newStatus,
                            room: "Lab 528",
                        }),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.status === "success") {
                                const updatedPcs = pcs.map((pc) =>
                                    pcNums.includes(pc.pc_num) ? { ...pc, pc_status: newStatus } : pc
                                );
                                setPcs(updatedPcs);
                                setSelectedPcs([]); // Clear the selection
                                setIsModalOpen(false); // Close the modal
                                Swal.fire({
                                   title: "Successfully updated!",
                                   text: `Status updated to ${newStatus}`,
                                   timer: 1800,
                                   timerProgressBar: true,
                                   showConfirmButton: false,
                                });
                            } else {
                                alert(data.message || "Failed to update PC statuses");
                            }
                        })
                        .catch((error) => {
                            console.error("Error updating PC statuses:", error);
                            alert("An error occurred while updating PC statuses");
                        });
                } else {
                    setSelectedPcs([]); // Clear the selection
                    setIsModalOpen(false);
                }
            });
        } else {
            alert("Please at least one PC to update.");
        }
    };

    const handleSelectPcChange = (e) => {
        const value = e.target.value.toLowerCase();
        if (value === "all") {
            setSelectedPcs(pcs);
        } else {
            const filtered = pcs.filter((pc) => pc.pc_status.toLowerCase() === value);
            setSelectedPcs(filtered);
        }
    };

    return (
        <div className="pc-wrapper">
            <div className="pc-filter">
                <div className="pc-filter-container">
                    <div className="more-text">
                        <p className="pc-update-text">Filter PCs</p>
                        
                        <div className="countpcs">
                            <p className="availablePc"><span className="greenCircle" />Available: {pcCounts.available || 0}</p>
                            <p className="occupiedPc"><span className="redCircle" />Occupied: {pcCounts.occupied || 0}</p>
                            <p className="maintenancePc"><span className="yellowCircle" />Maintenance: {pcCounts.maintenance || 0}</p>
                        </div>
                    </div>
                    <div className="select-button">
                        <select
                            className="pc-select"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                        <select
                            className="select-pc"
                            onChange={handleSelectPcChange}
                        >
                            <option value="" disabled selected>Select PC</option>
                            <option value="all">All</option>
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                        <button
                            className="update-button"
                            onClick={() => {
                                if (selectedPcs.length > 0) {
                                    setIsModalOpen(true);
                                    // alert(`Selected PCs: ${selectedPcs.map((pc) => pc.pc_num).join(", ")}`);
                                } else {
                                    alert("Please select at least one PC to update.");
                                }
                            }}
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
            <div className="pc-container">
                {filteredPcs.map((pc) => (
                    <div
                        key={pc.pc_num}
                        className={`pc-item pc-item-${pc.pc_status.toLowerCase()} ${
                            selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "selected" : ""
                        }`}
                        onClick={() => togglePcSelection(pc)}
                        style={{
                            backgroundColor: selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "#2196F3" : "",
                            color: selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "#fff" : "",
                            border: selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "1px solid #2196F3" : "",
                        }}
                    >
                        <i className="fa-solid fa-desktop"></i>
                        <p className="pc-num">{pc.pc_num}</p>
                        <p className="status">{pc.pc_status}</p>
                    </div>
                ))}
            </div>
            {/* Modal */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="header-modal">
                            <span className="close-modal" onClick={() => setIsModalOpen(false)}>&#9932;</span>
                            <h3 className="modal-update-title">Update PC</h3>
                            {/* <p className="modal-update-selected">{selectedPcs.map((pc) => pc.pc_num).join(", ")}</p> */}
                            <p className="modal-update-selected">
                                {selectedPcs.map((pc) => (
                                    <span key={pc.pc_num} className="selected-span">{pc.pc_num},</span>
                                ))}
                            </p>
                        </div>
                        <div className="modal-buttons">
                            <button className="available-btn" onClick={() => handleUpdateStatus("available")}>Available</button>
                            <button className="occupied-btn" onClick={() => handleUpdateStatus("occupied")}>Occupied</button>
                            <button className="maintenance-btn" onClick={() => handleUpdateStatus("maintenance")}>Maintenance</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Lab542() {
    useEffect(() => {
        fetch("http://localhost/Sit-In Monitor Backend/getPCs.php?lab_room=Lab 542")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setPcs(data.pcs);
                    setPcCounts(data.pc_counts);
                } else {
                    console.error("Failed to fetch PCs:", data.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching PCs:", error);
            });
    }, []);

    const [pcs, setPcs] = useState([]);
    const [pcCounts, setPcCounts] = useState({ available: 0, occupied: 0, maintenance: 0 });
    const [filter, setFilter] = useState("all");

    const [selectedPcs, setSelectedPcs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);    

    const filteredPcs = pcs.filter((pc) => {
        if (filter === "all") return true;
        return pc.pc_status.toLowerCase() === filter;
    });

    const togglePcSelection = (pc) => {
        if (selectedPcs.some((selected) => selected.pc_num === pc.pc_num)) {
            setSelectedPcs(selectedPcs.filter((selected) => selected.pc_num !== pc.pc_num));
        } else {
            setSelectedPcs([...selectedPcs, pc]);
        }
    };

    const handleUpdateStatus = (newStatus) => {
        if (selectedPcs.length > 0) {
            const pcNums = selectedPcs.map((pc) => pc.pc_num);
            const oldStatus = selectedPcs.map((pc) => pc.pc_status);
            console.log(pcNums);
            console.log(newStatus);
            Swal.fire({
                title: "Update confirmation",
                icon: "question",
                text: `You are going to change PC status to ${newStatus}. Are you sure to proceed?`,
                showCancelButton: true,
                confirmButtonText: "Yes, proceed.",
                cancelButtonText: "Cancel",
                cancelButtonColor: "#f44336"
            }).then((result) => {
                if(result.isConfirmed) {
                    fetch("http://localhost/Sit-In Monitor Backend/updateStatus.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            pcs: pcNums,
                            newStatus: newStatus,
                            room: "Lab 542",
                        }),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.status === "success") {
                                const updatedPcs = pcs.map((pc) =>
                                    pcNums.includes(pc.pc_num) ? { ...pc, pc_status: newStatus } : pc
                                );
                                setPcs(updatedPcs);
                                setSelectedPcs([]); // Clear the selection
                                setIsModalOpen(false); // Close the modal
                                Swal.fire({
                                   title: "Successfully updated!",
                                   text: `Status updated to ${newStatus}`,
                                   timer: 1800,
                                   timerProgressBar: true,
                                   showConfirmButton: false,
                                });
                            } else {
                                alert(data.message || "Failed to update PC statuses");
                            }
                        })
                        .catch((error) => {
                            console.error("Error updating PC statuses:", error);
                            alert("An error occurred while updating PC statuses");
                        });
                } else {
                    setSelectedPcs([]); // Clear the selection
                    setIsModalOpen(false);
                }
            });
        } else {
            alert("Please at least one PC to update.");
        }
    };

    const handleSelectPcChange = (e) => {
        const value = e.target.value.toLowerCase();
        if (value === "all") {
            setSelectedPcs(pcs);
        } else {
            const filtered = pcs.filter((pc) => pc.pc_status.toLowerCase() === value);
            setSelectedPcs(filtered);
        }
    };

    return (
        <div className="pc-wrapper">
            <div className="pc-filter">
                <div className="pc-filter-container">
                    <div className="more-text">
                        <p className="pc-update-text">Filter PCs</p>
                        
                        <div className="countpcs">
                            <p className="availablePc"><span className="greenCircle" />Available: {pcCounts.available || 0}</p>
                            <p className="occupiedPc"><span className="redCircle" />Occupied: {pcCounts.occupied || 0}</p>
                            <p className="maintenancePc"><span className="yellowCircle" />Maintenance: {pcCounts.maintenance || 0}</p>
                        </div>
                    </div>
                    <div className="select-button">
                        <select
                            className="pc-select"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                        <select
                            className="select-pc"
                            onChange={handleSelectPcChange}
                        >
                            <option value="" disabled selected>Select PC</option>
                            <option value="all">All</option>
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                        <button
                            className="update-button"
                            onClick={() => {
                                if (selectedPcs.length > 0) {
                                    setIsModalOpen(true);
                                    // alert(`Selected PCs: ${selectedPcs.map((pc) => pc.pc_num).join(", ")}`);
                                } else {
                                    alert("Please select at least one PC to update.");
                                }
                            }}
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
            <div className="pc-container">
                {filteredPcs.map((pc) => (
                    <div
                        key={pc.pc_num}
                        className={`pc-item pc-item-${pc.pc_status.toLowerCase()} ${
                            selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "selected" : ""
                        }`}
                        onClick={() => togglePcSelection(pc)}
                        style={{
                            backgroundColor: selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "#2196F3" : "",
                            color: selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "#fff" : "",
                            border: selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "1px solid #2196F3" : "",
                        }}
                    >
                        <i className="fa-solid fa-desktop"></i>
                        <p className="pc-num">{pc.pc_num}</p>
                        <p className="status">{pc.pc_status}</p>
                    </div>
                ))}
            </div>
            {/* Modal */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="header-modal">
                            <span className="close-modal" onClick={() => setIsModalOpen(false)}>&#9932;</span>
                            <h3 className="modal-update-title">Update PC</h3>
                            {/* <p className="modal-update-selected">{selectedPcs.map((pc) => pc.pc_num).join(", ")}</p> */}
                            <p className="modal-update-selected">
                                {selectedPcs.map((pc) => (
                                    <span key={pc.pc_num} className="selected-span">{pc.pc_num},</span>
                                ))}
                            </p>
                        </div>
                        <div className="modal-buttons">
                            <button className="available-btn" onClick={() => handleUpdateStatus("available")}>Available</button>
                            <button className="occupied-btn" onClick={() => handleUpdateStatus("occupied")}>Occupied</button>
                            <button className="maintenance-btn" onClick={() => handleUpdateStatus("maintenance")}>Maintenance</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Lab544() {
    useEffect(() => {
        fetch("http://localhost/Sit-In Monitor Backend/getPCs.php?lab_room=Lab 544")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setPcs(data.pcs);
                    setPcCounts(data.pc_counts);
                } else {
                    console.error("Failed to fetch PCs:", data.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching PCs:", error);
            });
    }, []);

    const [pcs, setPcs] = useState([]);
    const [pcCounts, setPcCounts] = useState({ available: 0, occupied: 0, maintenance: 0 });
    const [filter, setFilter] = useState("all");

    const [selectedPcs, setSelectedPcs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);    

    const filteredPcs = pcs.filter((pc) => {
        if (filter === "all") return true;
        return pc.pc_status.toLowerCase() === filter;
    });

    const togglePcSelection = (pc) => {
        if (selectedPcs.some((selected) => selected.pc_num === pc.pc_num)) {
            setSelectedPcs(selectedPcs.filter((selected) => selected.pc_num !== pc.pc_num));
        } else {
            setSelectedPcs([...selectedPcs, pc]);
        }
    };

    const handleUpdateStatus = (newStatus) => {
        if (selectedPcs.length > 0) {
            const pcNums = selectedPcs.map((pc) => pc.pc_num);
            const oldStatus = selectedPcs.map((pc) => pc.pc_status);
            console.log(pcNums);
            console.log(newStatus);
            Swal.fire({
                title: "Update confirmation",
                icon: "question",
                text: `You are going to change PC status to ${newStatus}. Are you sure to proceed?`,
                showCancelButton: true,
                confirmButtonText: "Yes, proceed.",
                cancelButtonText: "Cancel",
                cancelButtonColor: "#f44336"
            }).then((result) => {
                if(result.isConfirmed) {
                    fetch("http://localhost/Sit-In Monitor Backend/updateStatus.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            pcs: pcNums,
                            newStatus: newStatus,
                            room: "Lab 544",
                        }),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.status === "success") {
                                const updatedPcs = pcs.map((pc) =>
                                    pcNums.includes(pc.pc_num) ? { ...pc, pc_status: newStatus } : pc
                                );
                                setPcs(updatedPcs);
                                setSelectedPcs([]); // Clear the selection
                                setIsModalOpen(false); // Close the modal
                                Swal.fire({
                                   title: "Successfully updated!",
                                   text: `Status updated to ${newStatus}`,
                                   timer: 1800,
                                   timerProgressBar: true,
                                   showConfirmButton: false,
                                });
                            } else {
                                alert(data.message || "Failed to update PC statuses");
                            }
                        })
                        .catch((error) => {
                            console.error("Error updating PC statuses:", error);
                            alert("An error occurred while updating PC statuses");
                        });
                } else {
                    setSelectedPcs([]); // Clear the selection
                    setIsModalOpen(false);
                }
            });
        } else {
            alert("Please at least one PC to update.");
        }
    };

    const handleSelectPcChange = (e) => {
        const value = e.target.value.toLowerCase();
        if (value === "all") {
            setSelectedPcs(pcs);
        } else {
            const filtered = pcs.filter((pc) => pc.pc_status.toLowerCase() === value);
            setSelectedPcs(filtered);
        }
    };

    return (
        <div className="pc-wrapper">
            <div className="pc-filter">
                <div className="pc-filter-container">
                    <div className="more-text">
                        <p className="pc-update-text">Filter PCs</p>
                        
                        <div className="countpcs">
                            <p className="availablePc"><span className="greenCircle" />Available: {pcCounts.available || 0}</p>
                            <p className="occupiedPc"><span className="redCircle" />Occupied: {pcCounts.occupied || 0}</p>
                            <p className="maintenancePc"><span className="yellowCircle" />Maintenance: {pcCounts.maintenance || 0}</p>
                        </div>
                    </div>
                    <div className="select-button">
                        <select
                            className="pc-select"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                        <select
                            className="select-pc"
                            onChange={handleSelectPcChange}
                        >
                            <option value="" disabled selected>Select PC</option>
                            <option value="all">All</option>
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                        <button
                            className="update-button"
                            onClick={() => {
                                if (selectedPcs.length > 0) {
                                    setIsModalOpen(true);
                                    // alert(`Selected PCs: ${selectedPcs.map((pc) => pc.pc_num).join(", ")}`);
                                } else {
                                    alert("Please select at least one PC to update.");
                                }
                            }}
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
            <div className="pc-container">
                {filteredPcs.map((pc) => (
                    <div
                        key={pc.pc_num}
                        className={`pc-item pc-item-${pc.pc_status.toLowerCase()} ${
                            selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "selected" : ""
                        }`}
                        onClick={() => togglePcSelection(pc)}
                        style={{
                            backgroundColor: selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "#2196F3" : "",
                            color: selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "#fff" : "",
                            border: selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "1px solid #2196F3" : "",
                        }}
                    >
                        <i className="fa-solid fa-desktop"></i>
                        <p className="pc-num">{pc.pc_num}</p>
                        <p className="status">{pc.pc_status}</p>
                    </div>
                ))}
            </div>
            {/* Modal */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="header-modal">
                            <span className="close-modal" onClick={() => setIsModalOpen(false)}>&#9932;</span>
                            <h3 className="modal-update-title">Update PC</h3>
                            {/* <p className="modal-update-selected">{selectedPcs.map((pc) => pc.pc_num).join(", ")}</p> */}
                            <p className="modal-update-selected">
                                {selectedPcs.map((pc) => (
                                    <span key={pc.pc_num} className="selected-span">{pc.pc_num},</span>
                                ))}
                            </p>
                        </div>
                        <div className="modal-buttons">
                            <button className="available-btn" onClick={() => handleUpdateStatus("available")}>Available</button>
                            <button className="occupied-btn" onClick={() => handleUpdateStatus("occupied")}>Occupied</button>
                            <button className="maintenance-btn" onClick={() => handleUpdateStatus("maintenance")}>Maintenance</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Lab530() {
    useEffect(() => {
        fetch("http://localhost/Sit-In Monitor Backend/getPCs.php?lab_room=Lab 530")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setPcs(data.pcs);
                    setPcCounts(data.pc_counts);
                } else {
                    console.error("Failed to fetch PCs:", data.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching PCs:", error);
            });
    }, []);

    const [pcs, setPcs] = useState([]);
    const [pcCounts, setPcCounts] = useState({ available: 0, occupied: 0, maintenance: 0 });
    const [filter, setFilter] = useState("all");

    const [selectedPcs, setSelectedPcs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);    

    const filteredPcs = pcs.filter((pc) => {
        if (filter === "all") return true;
        return pc.pc_status.toLowerCase() === filter;
    });

    const togglePcSelection = (pc) => {
        if (selectedPcs.some((selected) => selected.pc_num === pc.pc_num)) {
            setSelectedPcs(selectedPcs.filter((selected) => selected.pc_num !== pc.pc_num));
        } else {
            setSelectedPcs([...selectedPcs, pc]);
        }
    };

    const handleUpdateStatus = (newStatus) => {
        if (selectedPcs.length > 0) {
            const pcNums = selectedPcs.map((pc) => pc.pc_num);
            const oldStatus = selectedPcs.map((pc) => pc.pc_status);
            console.log(pcNums);
            console.log(newStatus);
            Swal.fire({
                title: "Update confirmation",
                icon: "question",
                text: `You are going to change PC status to ${newStatus}. Are you sure to proceed?`,
                showCancelButton: true,
                confirmButtonText: "Yes, proceed.",
                cancelButtonText: "Cancel",
                cancelButtonColor: "#f44336"
            }).then((result) => {
                if(result.isConfirmed) {
                    fetch("http://localhost/Sit-In Monitor Backend/updateStatus.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            pcs: pcNums,
                            newStatus: newStatus,
                            room: "Lab 530",
                        }),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.status === "success") {
                                const updatedPcs = pcs.map((pc) =>
                                    pcNums.includes(pc.pc_num) ? { ...pc, pc_status: newStatus } : pc
                                );
                                setPcs(updatedPcs);
                                setSelectedPcs([]); // Clear the selection
                                setIsModalOpen(false); // Close the modal
                                Swal.fire({
                                   title: "Successfully updated!",
                                   text: `Status updated to ${newStatus}`,
                                   timer: 1800,
                                   timerProgressBar: true,
                                   showConfirmButton: false,
                                });
                            } else {
                                alert(data.message || "Failed to update PC statuses");
                            }
                        })
                        .catch((error) => {
                            console.error("Error updating PC statuses:", error);
                            alert("An error occurred while updating PC statuses");
                        });
                } else {
                    setSelectedPcs([]); // Clear the selection
                    setIsModalOpen(false);
                }
            });
        } else {
            alert("Please at least one PC to update.");
        }
    };

    const handleSelectPcChange = (e) => {
        const value = e.target.value.toLowerCase();
        if (value === "all") {
            setSelectedPcs(pcs);
        } else {
            const filtered = pcs.filter((pc) => pc.pc_status.toLowerCase() === value);
            setSelectedPcs(filtered);
        }
    };

    return (
        <div className="pc-wrapper">
            <div className="pc-filter">
                <div className="pc-filter-container">
                    <div className="more-text">
                        <p className="pc-update-text">Filter PCs</p>
                        
                        <div className="countpcs">
                            <p className="availablePc"><span className="greenCircle" />Available: {pcCounts.available || 0}</p>
                            <p className="occupiedPc"><span className="redCircle" />Occupied: {pcCounts.occupied || 0}</p>
                            <p className="maintenancePc"><span className="yellowCircle" />Maintenance: {pcCounts.maintenance || 0}</p>
                        </div>
                    </div>
                    <div className="select-button">
                        <select
                            className="pc-select"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                        <select
                            className="select-pc"
                            onChange={handleSelectPcChange}
                        >
                            <option value="" disabled selected>Select PC</option>
                            <option value="all">All</option>
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                        <button
                            className="update-button"
                            onClick={() => {
                                if (selectedPcs.length > 0) {
                                    setIsModalOpen(true);
                                    // alert(`Selected PCs: ${selectedPcs.map((pc) => pc.pc_num).join(", ")}`);
                                } else {
                                    alert("Please select at least one PC to update.");
                                }
                            }}
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
            <div className="pc-container">
                {filteredPcs.map((pc) => (
                    <div
                        key={pc.pc_num}
                        className={`pc-item pc-item-${pc.pc_status.toLowerCase()} ${
                            selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "selected" : ""
                        }`}
                        onClick={() => togglePcSelection(pc)}
                        style={{
                            backgroundColor: selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "#2196F3" : "",
                            color: selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "#fff" : "",
                            border: selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "1px solid #2196F3" : "",
                        }}
                    >
                        <i className="fa-solid fa-desktop"></i>
                        <p className="pc-num">{pc.pc_num}</p>
                        <p className="status">{pc.pc_status}</p>
                    </div>
                ))}
            </div>
            {/* Modal */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="header-modal">
                            <span className="close-modal" onClick={() => setIsModalOpen(false)}>&#9932;</span>
                            <h3 className="modal-update-title">Update PC</h3>
                            {/* <p className="modal-update-selected">{selectedPcs.map((pc) => pc.pc_num).join(", ")}</p> */}
                            <p className="modal-update-selected">
                                {selectedPcs.map((pc) => (
                                    <span key={pc.pc_num} className="selected-span">{pc.pc_num},</span>
                                ))}
                            </p>
                        </div>
                        <div className="modal-buttons">
                            <button className="available-btn" onClick={() => handleUpdateStatus("available")}>Available</button>
                            <button className="occupied-btn" onClick={() => handleUpdateStatus("occupied")}>Occupied</button>
                            <button className="maintenance-btn" onClick={() => handleUpdateStatus("maintenance")}>Maintenance</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Lab517() {
    useEffect(() => {
        fetch("http://localhost/Sit-In Monitor Backend/getPCs.php?lab_room=Lab 517")
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "success") {
                    setPcs(data.pcs);
                    setPcCounts(data.pc_counts);
                } else {
                    console.error("Failed to fetch PCs:", data.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching PCs:", error);
            });
    }, []);

    const [pcs, setPcs] = useState([]);
    const [pcCounts, setPcCounts] = useState({ available: 0, occupied: 0, maintenance: 0 });
    const [filter, setFilter] = useState("all");

    const [selectedPcs, setSelectedPcs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);    

    const filteredPcs = pcs.filter((pc) => {
        if (filter === "all") return true;
        return pc.pc_status.toLowerCase() === filter;
    });

    const togglePcSelection = (pc) => {
        if (selectedPcs.some((selected) => selected.pc_num === pc.pc_num)) {
            setSelectedPcs(selectedPcs.filter((selected) => selected.pc_num !== pc.pc_num));
        } else {
            setSelectedPcs([...selectedPcs, pc]);
        }
    };

    const handleUpdateStatus = (newStatus) => {
        if (selectedPcs.length > 0) {
            const pcNums = selectedPcs.map((pc) => pc.pc_num);
            const oldStatus = selectedPcs.map((pc) => pc.pc_status);
            console.log(pcNums);
            console.log(newStatus);
            Swal.fire({
                title: "Update confirmation",
                icon: "question",
                text: `You are going to change PC status to ${newStatus}. Are you sure to proceed?`,
                showCancelButton: true,
                confirmButtonText: "Yes, proceed.",
                cancelButtonText: "Cancel",
                cancelButtonColor: "#f44336"
            }).then((result) => {
                if(result.isConfirmed) {
                    fetch("http://localhost/Sit-In Monitor Backend/updateStatus.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            pcs: pcNums,
                            newStatus: newStatus,
                            room: "Lab 517",
                        }),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.status === "success") {
                                const updatedPcs = pcs.map((pc) =>
                                    pcNums.includes(pc.pc_num) ? { ...pc, pc_status: newStatus } : pc
                                );
                                setPcs(updatedPcs);
                                setSelectedPcs([]); // Clear the selection
                                setIsModalOpen(false); // Close the modal
                                Swal.fire({
                                   title: "Successfully updated!",
                                   text: `Status updated to ${newStatus}`,
                                   timer: 1800,
                                   timerProgressBar: true,
                                   showConfirmButton: false,
                                });
                            } else {
                                alert(data.message || "Failed to update PC statuses");
                            }
                        })
                        .catch((error) => {
                            console.error("Error updating PC statuses:", error);
                            alert("An error occurred while updating PC statuses");
                        });
                } else {
                    setSelectedPcs([]); // Clear the selection
                    setIsModalOpen(false);
                }
            });
        } else {
            alert("Please at least one PC to update.");
        }
    };

    const handleSelectPcChange = (e) => {
        const value = e.target.value.toLowerCase();
        if (value === "all") {
            setSelectedPcs(pcs);
        } else {
            const filtered = pcs.filter((pc) => pc.pc_status.toLowerCase() === value);
            setSelectedPcs(filtered);
        }
    };

    return (
        <div className="pc-wrapper">
            <div className="pc-filter">
                <div className="pc-filter-container">
                    <div className="more-text">
                        <p className="pc-update-text">Filter PCs</p>
                        
                        <div className="countpcs">
                            <p className="availablePc"><span className="greenCircle" />Available: {pcCounts.available || 0}</p>
                            <p className="occupiedPc"><span className="redCircle" />Occupied: {pcCounts.occupied || 0}</p>
                            <p className="maintenancePc"><span className="yellowCircle" />Maintenance: {pcCounts.maintenance || 0}</p>
                        </div>
                    </div>
                    <div className="select-button">
                        <select
                            className="pc-select"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                        <select
                            className="select-pc"
                            onChange={handleSelectPcChange}
                        >
                            <option value="" disabled selected>Select PC</option>
                            <option value="all">All</option>
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                        <button
                            className="update-button"
                            onClick={() => {
                                if (selectedPcs.length > 0) {
                                    setIsModalOpen(true);
                                    // alert(`Selected PCs: ${selectedPcs.map((pc) => pc.pc_num).join(", ")}`);
                                } else {
                                    alert("Please select at least one PC to update.");
                                }
                            }}
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
            <div className="pc-container">
                {filteredPcs.map((pc) => (
                    <div
                        key={pc.pc_num}
                        className={`pc-item pc-item-${pc.pc_status.toLowerCase()} ${
                            selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "selected" : ""
                        }`}
                        onClick={() => togglePcSelection(pc)}
                        style={{
                            backgroundColor: selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "#2196F3" : "",
                            color: selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "#fff" : "",
                            border: selectedPcs.some((selected) => selected.pc_num === pc.pc_num) ? "1px solid #2196F3" : "",
                        }}
                    >
                        <i className="fa-solid fa-desktop"></i>
                        <p className="pc-num">{pc.pc_num}</p>
                        <p className="status">{pc.pc_status}</p>
                    </div>
                ))}
            </div>
            {/* Modal */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="header-modal">
                            <span className="close-modal" onClick={() => setIsModalOpen(false)}>&#9932;</span>
                            <h3 className="modal-update-title">Update PC</h3>
                            {/* <p className="modal-update-selected">{selectedPcs.map((pc) => pc.pc_num).join(", ")}</p> */}
                            <p className="modal-update-selected">
                                {selectedPcs.map((pc) => (
                                    <span key={pc.pc_num} className="selected-span">{pc.pc_num},</span>
                                ))}
                            </p>
                        </div>
                        <div className="modal-buttons">
                            <button className="available-btn" onClick={() => handleUpdateStatus("available")}>Available</button>
                            <button className="occupied-btn" onClick={() => handleUpdateStatus("occupied")}>Occupied</button>
                            <button className="maintenance-btn" onClick={() => handleUpdateStatus("maintenance")}>Maintenance</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default CompLabManagement;