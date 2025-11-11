import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Tab, Tabs, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getImages, addImage, deleteImage, getResults } from '../utils/api';
import { getSettings, updateSettings } from '../utils/api';

const AdminDashboard = () => {
  const [images, setImages] = useState([]);
  const [results, setResults] = useState([]);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [settings, setSettings] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [deadline, setDeadline] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  if (!token) {
    navigate('/admin/login');
    return null;
  }

  useEffect(() => {
    fetchImages();
    fetchResults();
    fetchVotes();
    fetchSettings();

    // Set up polling to refresh data every 5 seconds
    const interval = setInterval(() => {
      fetchImages();
      fetchResults();
      fetchVotes();
      fetchSettings();
    }, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await getImages(token);
      setImages(data);
      setError(null);
    } catch (err) {
      setError('Failed to load images');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    try {
      const data = await getResults(token);
      setResults(data);
    } catch (err) {
      console.error('Failed to load results:', err);
    }
  };

  const fetchVotes = async () => {
    try {
      const data = await getVotes(token);
      setVotes(data);
    } catch (err) {
      console.error('Failed to load votes:', err);
    }
  };

  const fetchSettings = async () => {
    try {
      const data = await getSettings(token);
      setSettings(data);
      setDeadline(data.votingDeadline ? new Date(data.votingDeadline).toISOString().slice(0, 16) : '');
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      setError('Please select an image file');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('title', title);
    formData.append('description', description);

    try {
      await addImage(formData, token);
      setSuccess('Image added successfully!');
      setTitle('');
      setDescription('');
      setSelectedImage(null);
      document.getElementById('imageInput').value = '';
      fetchImages(); // Refresh the list
      fetchResults(); // Refresh results
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add image');
      console.error(err);
    }
  };

  const handleDeleteImage = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteImage(id, token);
        setSuccess('Image deleted successfully!');
        fetchImages(); // Refresh the list
        fetchResults(); // Refresh results
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete image');
        console.error(err);
      }
    }
  };

  const handleUpdateDeadline = async (e) => {
    e.preventDefault();
    
    try {
      const updatedSettings = await updateSettings({ votingDeadline: deadline }, token);
      setSettings(updatedSettings);
      setSuccess('Voting deadline updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update deadline');
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <h2>Loading dashboard...</h2>
      </Container>
    );
  }

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <Button variant="secondary" onClick={handleLogout}>Logout</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Tabs defaultActiveKey="manage" id="dashboard-tabs" className="mb-4">
        <Tab eventKey="manage" title="Manage Images">
          <Row>
            <Col md={6}>
              <Card>
                <Card.Header>Add New Image</Card.Header>
                <Card.Body>
                  <Form onSubmit={handleAddImage}>
                    <Form.Group className="mb-3" controlId="formTitle">
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter image title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formDescription">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter image description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formImage">
                      <Form.Label>Image</Form.Label>
                      <Form.Control
                        type="file"
                        id="imageInput"
                        accept="image/*"
                        onChange={(e) => setSelectedImage(e.target.files[0])}
                        required
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                      Add Image
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card>
                <Card.Header>Current Images ({images.length})</Card.Header>
                <Card.Body>
                  {images.length > 0 ? (
                    <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                      {images.map((image) => (
                        <div key={image._id} className="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                          <div>
                            <strong>{image.title}</strong>
                            <div className="text-muted small">{image.description}</div>
                          </div>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteImage(image._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No images added yet.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="settings" title="Voting Settings">
          <Card>
            <Card.Header>Voting Deadline</Card.Header>
            <Card.Body>
              <Form onSubmit={handleUpdateDeadline}>
                <Form.Group className="mb-3" controlId="formDeadline">
                  <Form.Label>Set Voting Deadline</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                  />
                  {settings && settings.votingDeadline && (
                    <Form.Text className="text-muted">
                      Current deadline: {new Date(settings.votingDeadline).toLocaleString()}
                    </Form.Text>
                  )}
                </Form.Group>
                <Button variant="primary" type="submit">
                  Update Deadline
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="results" title="Voting Results">
          <Card>
            <Card.Header>Voting Results</Card.Header>
            <Card.Body>
              {results.length > 0 ? (
                <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Votes</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results
                        .map((item, index) => (
                          <tr key={item._id}>
                            <td>{item.title}</td>
                            <td>{item.votes}</td>
                            <td>
                              {item.percentage !== undefined && (
                                <div>
                                  <span>{item.percentage}%</span>
                                  <div className="progress mt-1" style={{ height: '8px' }}>
                                    <div 
                                      className="progress-bar bg-success" 
                                      role="progressbar" 
                                      style={{ width: `${item.percentage}%` }}
                                      aria-valuenow={item.percentage}
                                      aria-valuemin="0"
                                      aria-valuemax="100"
                                    ></div>
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <div className="mt-3">
                    <strong>Total Votes: </strong>{results.reduce((sum, item) => sum + item.votes, 0)}
                  </div>
                </div>
              ) : (
                <p>No voting results available yet.</p>
              )}
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="voters" title="Voting Users">
          <Card>
            <Card.Header>Voting Users</Card.Header>
            <Card.Body>
              {votes.length > 0 ? (
                <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>NIM</th>
                        <th>Voted For</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {votes
                        .map((vote, index) => (
                          <tr key={vote._id}>
                            <td>{vote.name}</td>
                            <td>{vote.nim}</td>
                            <td>{vote.imageId?.title || 'N/A'}</td>
                            <td>{new Date(vote.createdAt).toLocaleString()}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No voting users available yet.</p>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
      
      <footer className="bg-dark text-white text-center py-3 mt-5">
        <div className="container">
          <p className="mb-0">Powered by ngnawfal</p>
        </div>
      </footer>
    </Container>
  );
};

export default AdminDashboard;