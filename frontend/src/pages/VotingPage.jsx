import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Form, Badge, FloatingLabel } from 'react-bootstrap';
import { getVotingImages, submitVote } from '../utils/api';

const VotingPage = () => {
  const [images, setImages] = useState([]);
  const [loading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(true); // Show form initially
  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [isVotingOpen, setIsVotingOpen] = useState(true);
  const [deadline, setDeadline] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    fetchImages();
    
    // Set up polling to refresh data every 5 seconds
    const interval = setInterval(fetchImages, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Update time left display
  useEffect(() => {
    const timer = setInterval(() => {
      if (deadline && isVotingOpen) {
        const difference = new Date(deadline) - new Date();
        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeLeft('Voting has ended');
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline, isVotingOpen]);

  const fetchImages = async () => {
    try {
      const data = await getVotingImages();
      setImages(data.images || data);
      setIsVotingOpen(data.isVotingOpen !== undefined ? data.isVotingOpen : true);
      setDeadline(data.deadline);
      setError(null);
    } catch (err) {
      setError('Failed to load images for voting');
      console.error(err);
    }
  };

  const handleVote = async (imageId) => {
    // Validate inputs
    if (!name.trim() || !nim.trim()) {
      setError('Please fill in both Name and NIM fields');
      return;
    }

    if (!isVotingOpen) {
      setError('Voting deadline has passed');
      return;
    }

    try {
      await submitVote(imageId, name.trim(), nim.trim());
      setSuccess('Your vote has been recorded! Thank you for voting.');
      setShowForm(false); // Hide form after successful vote
      // Refresh the images to update vote counts immediately
      await fetchImages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit vote. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h2 className="mt-3">Loading images for voting...</h2>
      </Container>
    );
  }

  return (
    <div className="voting-page-gradient">
      <Container className="py-5">
        <div className="text-center mb-5">
          <h1 className="display-3 fw-bold text-white mb-3">Student Voting System</h1>
          <p className="lead text-white mb-4">Select your favorite image and support it with your vote!</p>
          
          <div className="d-inline-block bg-white rounded p-3 shadow-lg">
            {!isVotingOpen ? (
              <Badge bg="danger" className="fs-4 p-3 px-4">
                <i className="fas fa-clock me-2"></i>VOTING HAS ENDED
              </Badge>
            ) : (
              <div>
                <Badge bg="success" className="fs-4 p-3 px-4">
                  <i className="fas fa-vote-yea me-2"></i>VOTING IS OPEN
                </Badge>
                {deadline && (
                  <div className="mt-2">
                    <small className="text-muted">Time remaining: {timeLeft}</small>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}
        {success && <Alert variant="success" className="rounded-3">{success}</Alert>}
        
        {isVotingOpen && showForm && (
          <div className="row justify-content-center mb-5">
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg rounded-3">
                <div className="card-header bg-primary text-white text-center py-4 rounded-top-3">
                  <h4 className="mb-0">Your Information</h4>
                  <small className="opacity-75">Please fill in your details before voting</small>
                </div>
                <div className="card-body p-4">
                  <Form>
                    <Row>
                      <Col md={6}>
                        <FloatingLabel controlId="floatingName" label="Full Name" className="mb-3">
                          <Form.Control
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={!showForm || !isVotingOpen}
                            className="rounded-2"
                          />
                        </FloatingLabel>
                      </Col>
                      <Col md={6}>
                        <FloatingLabel controlId="floatingNim" label="Student ID (NIM)" className="mb-3">
                          <Form.Control
                            type="text"
                            placeholder="Enter your student ID"
                            value={nim}
                            onChange={(e) => setNim(e.target.value)}
                            disabled={!showForm || !isVotingOpen}
                            className="rounded-2"
                          />
                        </FloatingLabel>
                      </Col>
                    </Row>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <Row className="g-4">
          {images.length > 0 ? (
            images.map((image) => (
              <Col key={image._id} xs={12} sm={6} lg={4}>
                <Card className="h-100 card-hover border-0 shadow-sm rounded-3 overflow-hidden">
                  <div className="position-relative">
                    <Card.Img 
                      variant="top" 
                      src={image.imageUrl} 
                      alt={image.title}
                      style={{ height: '250px', objectFit: 'cover' }} 
                      className="img-fluid"
                    />
                    <div className="position-absolute top-0 start-0 w-100 p-2">
                      <Badge bg="info" className="float-end">{image.votes} votes</Badge>
                    </div>
                  </div>
                  <Card.Body className="d-flex flex-column p-4">
                    <Card.Title className="text-primary fw-bold">{image.title}</Card.Title>
                    <Card.Text className="flex-grow-1">{image.description}</Card.Text>
                    <div className="mt-2">
                      {image.percentage !== undefined && (
                        <div>
                          <small className="text-muted">Selected by {image.percentage}% of voters</small>
                          <div className="progress mt-1" style={{ height: '8px' }}>
                            <div 
                              className="progress-bar bg-success" 
                              role="progressbar" 
                              style={{ width: `${image.percentage}%` }}
                              aria-valuenow={image.percentage}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <Button 
                      className="mt-2 py-2 fw-bold"
                      onClick={() => handleVote(image._id)}
                      disabled={!showForm || !isVotingOpen || (!name.trim() || !nim.trim())}
                      size="lg"
                    >
                      <i className="fas fa-vote-yea me-2"></i>
                      {showForm ? 'Vote Now' : 'Voted!'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <div className="text-center py-5">
                <div className="display-1 text-muted mb-3">😢</div>
                <h4 className="text-muted">No images available for voting at the moment.</h4>
                <p className="lead">Please check back later!</p>
              </div>
            </Col>
          )}
        </Row>
      </Container>
      
      <footer className="bg-dark text-white text-center py-3 mt-5">
        <div className="container">
          <p className="mb-0">Powered by ngnawfal</p>
        </div>
      </footer>
    </div>
  );
};

export default VotingPage;