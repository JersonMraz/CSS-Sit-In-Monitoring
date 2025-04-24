import "./SitinRecords.scss"
import Sidebar from "../Admin-Sidebar.jsx";
import Navbar from "../Admin-Navbar.jsx";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";

function SitinRecords() {
    const [students, setStudents] = useState([]);
    const [format, setFormat] = useState("");
    const [purposeFilter, setPurposeFilter] = useState("");
    const [labFilter, setLabFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    const handleGenerateReport = () => {
        if (!format) {
            Swal.fire({
                title: 'No format.',
                icon: 'error',
                text: 'Please choose a format to generate.',
                timer: 2000,
                timerProgressBar: true
            });
            return;
        }

        switch (format) {
            case "PDF":
                Swal.fire({
                    icon: 'question',
                    text: 'Are you sure you want to generate PDF format?',
                    showCancelButton: true,
                    cancelButtonText: 'No, cancel!',
                    confirmButtonText: 'Yes, generate it.',
                    confirmButtonColor: "#E9BE5F",
                    cancelButtonColor: "#d33",
                }).then((result) => {
                    if(result.isConfirmed) {
                        Swal.fire({
                            title: 'File Downloaded',
                            icon: 'success',
                            text: 'Your PDF file is now downloaded.',
                            confirmButtonText: 'Okay',
                            timer: 1500,
                            timerProgressBar: true
                        })
                        exportToPDF();
                    } else {
                        Swal.fire({
                            title: 'Cancelled!',
                            text: 'You cancelled to download your file.',
                            timer: 1000,
                            timerProgressBar: true,
                        })
                    }
                });
                break;
            case "Excel":
                Swal.fire({
                    icon: 'question',
                    text: 'Are you sure you want to generate Excel format?',
                    showCancelButton: true,
                    cancelButtonText: 'No, cancel!',
                    confirmButtonText: 'Yes, generate it.',
                    confirmButtonColor: "#E9BE5F",
                    cancelButtonColor: "#d33",
                }).then((result) => {
                    if(result.isConfirmed) {
                        Swal.fire({
                            title: 'File Downloaded',
                            icon: 'success',
                            text: 'Your Excel file is now downloaded.',
                            confirmButtonText: 'Okay',
                            timer: 1500,
                            timerProgressBar: true
                        })
                        exportToExcel();
                    } else {
                        Swal.fire({
                            title: 'Cancelled!',
                            text: 'You cancelled to download your file.',
                            timer: 1000,
                            timerProgressBar: true,
                        })
                    }
                });
                break;
            case "CSV":
                Swal.fire({
                    icon: 'question',
                    text: 'Are you sure you want to generate Excel format?',
                    showCancelButton: true,
                    cancelButtonText: 'No, cancel!',
                    confirmButtonText: 'Yes, generate it.',
                    confirmButtonColor: "#E9BE5F",
                    cancelButtonColor: "#d33",
                }).then((result) => {
                    if(result.isConfirmed) {
                        Swal.fire({
                            title: 'File Downloaded',
                            icon: 'success',
                            text: 'Your Excel file is now downloaded.',
                            confirmButtonText: 'Okay',
                            timer: 1500,
                            timerProgressBar: true
                        })
                        exportToCSV();
                    } else {
                        Swal.fire({
                            title: 'Cancelled!',
                            text: 'You cancelled to download your file.',
                            timer: 1000,
                            timerProgressBar: true,
                        })
                    }
                });
                break;
            case "print":
                Swal.fire({
                    icon: 'question',
                    text: 'Are you sure you want to generate Excel format?',
                    showCancelButton: true,
                    cancelButtonText: 'No, cancel!',
                    confirmButtonText: 'Yes, generate it.',
                    confirmButtonColor: "#E9BE5F",
                    cancelButtonColor: "#d33",
                }).then((result) => {
                    if(result.isConfirmed) {
                        Swal.fire({
                            title: 'File Downloaded',
                            icon: 'success',
                            text: 'Your Excel file is now downloaded.',
                            confirmButtonText: 'Okay',
                            timer: 1500,
                            timerProgressBar: true
                        })
                        printTable();
                    } else {
                        Swal.fire({
                            title: 'Cancelled!',
                            text: 'You cancelled to download your file.',
                            timer: 1000,
                            timerProgressBar: true,
                        })
                    }
                });
                break;
            default:
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid format!',
                    text: 'Invalid file format!',
                    timer: 1000,
                    timerProgressBar: true
                });
        }
    };

    const exportToPDF = () => {
        const sitinRecord = document.querySelector(".RecordTable");

        html2canvas(sitinRecord, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pageWidth = pdf.internal.pageSize.getWidth();

            // Function to center text
            const centerText = (text, yPosition, fontSize = 14) => {
                pdf.setFontSize(fontSize);
                const textWidth = pdf.getTextWidth(text);
                pdf.text(text, (pageWidth - textWidth) / 2, yPosition);
            };
    
            // Add centered header
            pdf.setFont("helvetica", "bold");
            centerText("University of Cebu - Main System Report", 15, 16);
            centerText("College of Computer Studies", 25, 14);
            centerText("Computer Laboratory Sitin Monitoring", 35, 12);

            const imgWidth = 180;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 15, 45, imgWidth, imgHeight);
            pdf.save("sitin_record.pdf");
        });
    };

    const exportToExcel = () => {
        const sitinRecord = document.querySelector(".RecordTable table");
        if (!sitinRecord) {
            console.error("Table not found!");
            return;
        }
    
        // Convert table to worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.table_to_sheet(sitinRecord);
    
        // Insert custom header manually
        const headerText = [
            ["University of Cebu - Main System Report"],
            ["College of Computer Studies"],
            ["Computer Laboratory Sitin Monitoring"],
            [""], // Empty row before table
        ];
    
        // Convert worksheet to array and prepend the header
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        const finalData = [...headerText, ...data];
    
        // Create new worksheet with the modified data
        const newWs = XLSX.utils.aoa_to_sheet(finalData);
        XLSX.utils.book_append_sheet(wb, newWs, "Sit-in Records");
    
        // Save as Excel file
        XLSX.writeFile(wb, "sitin_record.xlsx");
    };

    const exportToCSV = () => {
        const sitinRecord = document.querySelector(".RecordTable table");
        if (!sitinRecord) {
            console.error("Table not found!");
            return;
        }
    
        let csvContent = "";
    
        // Add custom header
        const headerText = [
            "University of Cebu - Main System Report",
            "College of Computer Studies",
            "Computer Laboratory Sitin Monitoring",
            ""
        ].join("\n");
    
        csvContent += headerText + "\n";
    
        // Extract table rows
        const rows = sitinRecord.querySelectorAll("tr");
        rows.forEach((row) => {
            const cols = row.querySelectorAll("td, th");
            let rowData = [];
            cols.forEach((col) => rowData.push(col.innerText));
            csvContent += rowData.join(",") + "\n";
        });
    
        // Create CSV file and download
        const blob = new Blob([csvContent], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "sitin_record.csv";
        link.click();
    };    

    const printTable = () => {
        const sitinRecord = document.querySelector(".RecordTable table");
    
        if (!sitinRecord) {
            console.error("Table not found!");
            return;
        }
    
        // Create new window for printing
        const printWindow = window.open("", "", "width=900,height=600");
    
        printWindow.document.write(`
            <html>
            <head>
                <title>Sit-in Records</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        text-align: center;
                    }
                    h2, h3 {
                        margin: 5px 0;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    th, td {
                        border: 1px solid black;
                        padding: 8px;
                        text-align: center;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <h2>University of Cebu - Main System Report</h2>
                <h3>College of Computer Studies</h3>
                <h3>Computer Laboratory Sitin Monitoring</h3>
                <hr>
                ${sitinRecord.outerHTML}
            </body>
            </html>
        `);
    
        printWindow.document.close();
        printWindow.print();
    };
    
    const fetchRecords = () => {
        let url = "http://localhost/Sit-In Monitor Backend/get_sitin_records.php";
    
        const params = new URLSearchParams();
        if (purposeFilter) params.append("purpose", purposeFilter);
        if (labFilter) params.append("lab", labFilter);
        if (dateFilter) params.append("date", dateFilter);
    
        fetch(`${url}?${params.toString()}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    setStudents(data.records);
                } else {
                    console.error("No records found");
                    setStudents([]);
                }
            })
            .catch(error => {
                console.error("Error fetching records:", error);
                setStudents([]);
            });
    };

    useEffect(() => {
        fetchRecords();
    }, [purposeFilter, labFilter, dateFilter]);
    
    return(
        <div>
            <Sidebar />
            <Navbar />
            <div className="SitinRecord">
                <h1>Sit-in Records</h1>
                <div className="generate">
                    <div className="filter">
                        <select className="filter-purp" value={purposeFilter} onChange={(e) => setPurposeFilter(e.target.value)}>
                            <option value="">All Purposes</option>
                            <option value="C# Programming">C# Programming</option>
                            <option value="C Programming">C Programming</option>
                            <option value="Java Programming">Java Programming</option>
                            <option value="Systems Integration & Architecture">Systems Integration & Architecture</option>
                            <option value="Embedded Systems & IoT">Embedded Systems & IoT</option>
                            <option value="Digital Logic & Design">Digital Logic & Design</option>
                            <option value="Computer Application">Computer Application</option>
                            <option value="Database">Database</option>
                            <option value="Project Management">Project Management</option>
                            <option value="Python Programming">Python Programming</option>
                            <option value="Mobile Application">Mobile Application</option>
                            <option value="Others">Others..</option>
                        </select>
                        <select className="filter-lab" value={labFilter} onChange={(e) => setLabFilter(e.target.value)}>
                            <option value="">All Laboratory Room</option>
                            <option value="Lab 524">Lab 524</option>
                            <option value="Lab 526">Lab 526</option>
                            <option value="Lab 528">Lab 528</option>
                            <option value="Lab 530">Lab 530</option>
                            <option value="Lab 542">Lab 542</option>
                            <option value="Lab 544">Lab 544</option>
                            <option value="Lab 517">Lab 517</option>
                        </select>
                    </div>
                    <div className="download">
                        <button onClick={handleGenerateReport}>Generate report</button>
                        <select value={format} onChange={(e) => setFormat(e.target.value)}>
                            <option value="" disabled>Select format</option>
                            <option value="PDF">PDF</option>
                            <option value="Excel">Excel</option>
                            <option value="CSV">CSV</option>
                            <option value="print">print</option>
                        </select>
                    </div>
                </div>
                <div className="RecordContainer">
                    <div className="RecordTable">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID Number</th>
                                    <th>Name</th>
                                    <th>Purpose</th>
                                    <th>Laboratory Room</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Time Out</th>
                                </tr>
                            </thead>
                            <tbody>
                            {students.length > 0 ? (
                                    students.map((students, index) => (
                                        <tr key={index}>
                                            <td>{students.idno}</td>
                                            <td>{students.fullname}</td>
                                            <td>{students.purpose}</td>
                                            <td>{students.lab}</td>
                                            <td>{students.date}</td>
                                            <td>{students.time_in}</td>
                                            <td className={students.time_out ? "" : "Active"}>
                                                {students.time_out ? students.time_out : "Active"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7">No records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SitinRecords;