import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

const LeaveForm = ({leaveDays, gender}) => 
{
    return ( 
        <>
            <Form>
                <Row>
                    <h1 className='text-uppercase fs-2 fw-bold'>Available Leave Days</h1>
                    <Form.Group className='col-md-4 mb-3'>
                        <Form.Label>Normal Leave</Form.Label>
                        <Form.Control type='number' defaultValue={leaveDays.normal_leave} disabled></Form.Control>
                    </Form.Group>
                    <Form.Group className='col-md-4 mb-3'>
                        <Form.Label>Sick Leave</Form.Label>
                        <Form.Control type='number' defaultValue={leaveDays.sick_leave} disabled></Form.Control>
                    </Form.Group>
                    {
                        gender === "Male"
                        ?
                            <Form.Group className='col-md-4 mb-3'>
                                <Form.Label>Paternity Leave</Form.Label>
                                <Form.Control type='number' defaultValue={leaveDays.paternity_leave} disabled></Form.Control>
                            </Form.Group>
                        :
                            <Form.Group className='col-md-4 mb-3'>
                                <Form.Label>Maternity Leave</Form.Label>
                                <Form.Control type='number' defaultValue={leaveDays.maternity_leave} disabled></Form.Control>
                            </Form.Group>
                    }
                
                    <h1 className='text-uppercase fs-2 fw-bold'>Leave application details</h1>
                    <Form.Group className='col-md-6 mb-3'>
                        <Form.Label>Leave Type</Form.Label>
                        <Form.Select id='leave_type' required>
                            <option value="">Select Leave Type</option>
                            <option value="Normal">Normal Leave</option>
                            <option value="Sick">Sick Leave</option>
                            {
                                gender === "Male"
                                ?
                                    <option value="Paternity">Paternity Leave</option>
                                :
                                    <option value="Maternity">Maternity Leave</option>
                            }
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className='col-md-6 mb-3'>
                        <Form.Label>Leave Duration</Form.Label>
                        <Form.Select id='leave_duration' required>
                            <option value="">Select Leave Duration</option>
                            <option value="Full">Full Day</option>
                            <option value="Half">Half Day</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className='col-md-4 mb-3'>
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control type='date' id='start_date' required></Form.Control>
                    </Form.Group>
                    <Form.Group className='col-md-4 mb-3'>
                        <Form.Label>End Date</Form.Label>
                        <Form.Control type='date' id='end_date' required></Form.Control>
                    </Form.Group>
                    <Form.Group className='col-md-4 mb-3'>
                        <Form.Label>Number of days</Form.Label>
                        <Form.Control type='number' id='total_days' disabled></Form.Control>
                    </Form.Group>
                    <Form.Group className='col-md-6 mb-3'>
                        <Form.Label>File attachment</Form.Label>
                        <Form.Control type='file' id='file_attachment' accept="image/*, application/pdf"></Form.Control>
                    </Form.Group>
                    <Form.Group className='col-md-6 mb-3'>
                        <Form.Label>Reason</Form.Label>
                        <Form.Control type='textarea' aria-colspan={20} aria-rowspan={1} placeholder='Reasone for leave (Optional)'></Form.Control>
                    </Form.Group>
                    <Button type="submit" variant="success" className="col-md-3 mx-auto mt-3">Submit application</Button>
                </Row>
            </Form>
        </>
     );
}
 
export default LeaveForm;