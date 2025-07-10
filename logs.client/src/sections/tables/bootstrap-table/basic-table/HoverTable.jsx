// react-bootstrap
import Table from 'react-bootstrap/Table';

// project-imports
import MainCard from 'components/MainCard';

import LogDetail  from './logdetail'

// bagian ini tambahan
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// ==============================|| BASIC TABLE - HOVER TABLE ||============================== //
export default function HoverTable() {

  const detailRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (detailRef.current && !detailRef.current.contains(event.target)) {
        setSelectedLog(null); // Tutup detail
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [detailRef]);

  const [logs, setLogs] = useState([]);
  const [draw, setDraw] = useState(1);
  const [start, setStart] = useState(0);
  const [length, setLength] = useState(10);
  const [category, setCategory] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [key, setKey] = useState('');
  const [onlyLast20records, setOnlyLast20records] = useState(false)

  const [selectedLog, setSelectedLog] = useState(null);

  const handleRowClick = (log) => {
    setSelectedLog(log);
  };

  const [selectedApp, setSelectedApp] = useState('');
  const [sourceApp, setSourceApp] = useState([]);
  useEffect(() => {
    const fetchAppSource = async () => {
        try {
          const response = await axios.get('http://localhost:3001/api/sourceapps');
          if (response.data.success) {
            setSourceApp(response.data.data); // Sesuaikan dengan struktur respons dari Hono
            console.log("response.data.logs : " + response.data.data)
          } 
        } catch (err) {
          console.log("Error " + err)
        }
    };    
    fetchAppSource();
  }, []);  

  const fetchLogs = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/readlogs', {
        draw,
        start,
        length,
        sourceApp: selectedApp,
        category,
        datestart: dateStart,
        dateend: dateEnd,
        key,
        onlylast20: onlyLast20records ? 1 : 0,
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
  }, [start, selectedApp, onlyLast20records]);


  const handleSourceAppChange = async (e) => {
    setStart(0);
    setSelectedApp(e.target.value)
  };

  const Td = ({ children }) => (
    <td style={{ color: '#212121' }}>
      {children}
    </td>
  );

  return (    
    <MainCard
    >
  <div className="container mt-4" style={{ color: '#212121' }}>
      {/* Filter inputs */}
      <div className="row mb-3">
        <div className="col-3">
          <label>Aplikasi</label>
          <select
            value={selectedApp}
            onChange={(e) => handleSourceAppChange(e)}
            className="form-control"
          >
            {sourceApp.map((app, idx) => (
              <option key={idx} value={app.sourceApp}>
                {app.sourceApp}
              </option>
            ))}
          </select>
        </div>
        <div className="col-3">
          <label>Kategori</label>
          <input type="text" className="form-control" value={category}  onKeyDown={(e) => {
                   if (e.key === 'Enter') { fetchLogs(); } }} onChange={(e) => setCategory(e.target.value)} placeholder="" />
        </div>
      <div className="col-4 d-flex align-items-end">
        <div className="form-check">
          <input
              type="checkbox"
              className="form-check-input"
              id="top20"
              checked={onlyLast20records}
              onChange={(e) => setOnlyLast20records(e.target.checked)}
          />
          <label className="form-check-label ms-2" htmlFor="top20">
            Abaikan kriteria lain. Ambil 5 record teratas
          </label>
        </div>
      </div>         
    </div>  
      <div className="row mb-3">
        <div className="col">
          <label>Tanggal Awal</label>
          <input type="date" className="form-control" value={dateStart} onChange={(e) => setDateStart(e.target.value)} placeholder="Start Date" />
        </div>
        <div className="col">
          <label>Tanggal Akhir</label>
          <input type="date" className="form-control" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} placeholder="End Date" />
        </div>
        <div className="col">
          <label>Key</label>
          <input type="text" className="form-control" value={key} onKeyDown={(e) => {
                   if (e.key === 'Enter') { fetchLogs(); } }} onChange={(e) => setKey(e.target.value)} placeholder="Log Key" />
        </div>
        <div className="col d-flex align-items-end">
          <button className="btn btn-primary w-100" onClick={fetchLogs}>
            Ambil Data
          </button>
        </div>
      </div>


      {/* Table display */}
      <table className="table table-striped table-hover" style={{ color: '#212121' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>App</th>
            <th>Category</th>
            <th>Timestamp</th>
            <th>Key</th>
            <th>Ip</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={log.id} className="text-custom" onClick={() => handleRowClick(log)}>
              <Td>{index + 1 + start}</Td>
              <Td>{log.sourceApp}</Td>
              <Td>{log.category}</Td>
              <Td>{log.createdAt}</Td>
              <Td>{log.key}</Td>
              <Td>{log.ip}</Td>
              <Td>{log.message}</Td>
            </tr>
          ))}
        </tbody>
      </table>

<div ref={detailRef} className="container mt-4" style={{ position: 'relative' }}>
  <table>...</table>

  <div style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: '1rem',
    boxShadow: '0 -2px 8px rgba(0,0,0,0.1)'
  }}>
    <LogDetail log={selectedLog} onClose={() => setSelectedLog(null)} />
  </div>
</div>


      {/* Pagination control */}
      <div className="d-flex justify-content-between">
        <button className="btn btn-primary" disabled={start === 0} onClick={() => setStart(start - length)}>Prev</button>
        <button className="btn btn-primary" onClick={() => setStart(start + length)}>Next</button>
      </div>
    </div>
    </MainCard>
  );
}
