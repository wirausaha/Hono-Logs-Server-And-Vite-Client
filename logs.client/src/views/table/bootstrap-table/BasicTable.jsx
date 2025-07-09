// react-bootstrap
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

// project-imports
import HoverTable from 'sections/tables/bootstrap-table/basic-table/HoverTable';



// ==============================|| BOOTSTRAP TABLE - BASIC TABLE ||============================== //

export default function BasicTablePage() {
  

  return (
    <Row>
      <Col sm={12}>
        <HoverTable />
      </Col>
    </Row>
  );
}
