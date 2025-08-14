import { useState } from "react";
import axiosInstance from "../../axiosInstance";

const Bargikarandownload = () => {
  const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/bargikaran/export-sql');
            setFiles(response.data.files);
        } catch (err) {
            alert('Error exporting SQL');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container text-center mt-5">
            <h2>Export Bargikaran Table</h2>
            <button className="btn btn-primary mt-3" onClick={handleExport} disabled={loading}>
                {loading ? 'Generating...' : 'Generate SQL Insert Files'}
            </button>

            {files.length > 0 && (
                <div className="alert alert-success mt-4 text-start">
                    <strong>Download SQL files:</strong>
                    <ul>
                        {files.map((file, i) => (
                            <li key={i}>
                                <a href={file} download>
                                    {file.split('/').pop()}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}


export default Bargikarandownload;