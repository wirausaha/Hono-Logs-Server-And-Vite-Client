const LogDetail = ({ log, onClose }) => {
  if (!log) return null;

  return (
    <div className="card mt-3 shadow-sm"  onClick={onClose}  
        style={{border: '1px solid', color: '#212121'}}>
      <div className="card-header d-flex justify-content-between align-items-center">
        <strong>Detail Log</strong>
        <button className="btn btn-sm btn-outline-danger" onClick={onClose}>Tutup</button>
      </div>
      <div className="card-body">
        <p><strong>Source App:</strong> {log.sourceApp}</p>
        <p><strong>Kategori:</strong> {log.category}</p>
        <p><strong>Key:</strong> {log.key}</p>
        <p><strong>IP:</strong> {log.ip}</p>
        <p><strong>Message:</strong> {log.message}</p>
        <p><strong>Timestamp:</strong> {new Date(log.createdAt).toLocaleString()}</p>
        <pre style={{fontSize: '14px', fontStyle: 'italic'}}>{JSON.stringify(log.details, null, 2)}</pre>
      </div>
    </div>
  );
};

export default LogDetail