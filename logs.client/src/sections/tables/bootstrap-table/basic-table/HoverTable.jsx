// react-bootstrap
import Table from 'react-bootstrap/Table';

// project-imports
import MainCard from 'components/MainCard';

// bagian ini tambahan
import { useState, useEffect } from 'react';
import axios from 'axios';

// ==============================|| BASIC TABLE - HOVER TABLE ||============================== //
export default function HoverTable() {

  const [logs, setLogs] = useState([]);
  const [draw, setDraw] = useState(1);
  const [start, setStart] = useState(0);
  const [length, setLength] = useState(10);
  const [category, setCategory] = useState('Api');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [key, setKey] = useState('');

  const fetchLogs = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/readlogs', {
        draw,
        start,
        length,
        category,
        datestart: dateStart,
        dateend: dateEnd,
        key,
        orderby: 1 // Atur sesuai kebutuhan sorting
      });
      if (response.data.success) {
        setLogs(response.data.data.logs); // Sesuaikan dengan struktur respons dari Hono
        console.log("response.data.logs : " + response.data.data.logs)
      } 
    } catch (err) {
      console.log("Error " + err)
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [start]);

  return (    
    <MainCard
      title="Data log"
      subheader={
        <p className="mb-0">
            Maaf saya acak-acak <code>HoverTable</code> nya
        </p>
      }
    >
<div className="container mt-4">
      {/* Filter inputs */}
      <div className="row mb-3">
        <div className="col">
          <input type="date" className="form-control" value={dateStart} onChange={(e) => setDateStart(e.target.value)} placeholder="Start Date" />
        </div>
        <div className="col">
          <input type="date" className="form-control" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} placeholder="End Date" />
        </div>
        <div className="col">
          <input type="text" className="form-control" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Log Key" />
        </div>
        <div className="col">
          <input type="text" className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Api" />
        </div>
        <div className="col">
           <button onClick={fetchLogs} >Ambil Data</button> 
        </div>
      </div>


      {/* Table display */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Category</th>
            <th>Timestamp</th>
            <th>Key</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={log.id}>
              <td>{index + 1}</td>
              <td>{log.category}</td>
              <td>{log.createdAt}</td>
              <td>{log.key}</td>
              <td>{log.message}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination control */}
      <div className="d-flex justify-content-between">
        <button className="btn btn-primary" disabled={start === 0} onClick={() => setStart(start - length)}>Prev</button>
        <button className="btn btn-primary" onClick={() => setStart(start + length)}>Next</button>
      </div>
    </div>
    </MainCard>
  );
}
