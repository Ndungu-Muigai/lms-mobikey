import '../CSS/Tiles.css'
import { Card, Row, Col } from 'react-bootstrap';

const Tiles = ({leaveDays}) => 
{
    return ( 
        <>
            <div className="container">
                <Row xs={1} md={2} lg={4}>
                    <Col>
                        <Card className='mb-3'>
                            <Card.Body className='text-center'>
                                <Card.Title>
                                    <i className="fa fa-history"></i>
                                </Card.Title>
                                <Card.Text>
                                    <h4>{leaveDays.total_requests}</h4>
                                    <h5>Total Requests</h5>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className='mb-3'>
                            <Card.Body className='text-center'>
                                <Card.Title>
                                    <i className='fa fa-calendar-check-o text-success'></i>
                                </Card.Title>
                                <Card.Text>
                                    <h4>{leaveDays.approved_requests}</h4>
                                    <h5>Approved Requests</h5>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className='mb-3'>
                            <Card.Body className='text-center'>
                                <Card.Title>
                                    <i className='fa fa-calendar-times-o text-danger'></i>
                                </Card.Title>
                                <Card.Text>
                                    <h4>{leaveDays.rejected_requests}</h4>
                                    <h5>Rejected Requests</h5>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className='mb-3'>
                            <Card.Body className='text-center'>
                                <Card.Title>
                                    <i className='fa fa-hourglass-half'></i>
                                </Card.Title>
                                <Card.Text>
                                    <h4>{leaveDays.pending_requests}</h4>
                                    <h5>Pending Requests</h5>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
     );
}
 
export default Tiles;