import React, { useEffect, useState } from "react";

import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBTypography,
  MDBNavbar,
  MDBNavbarBrand,
  MDBBtn,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBInput,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

function Home() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    // Fetch photos from API or any other data source
    // Update the 'photos' state with the fetched photos
    // Example:
    // axios.get('/photos').then(response => {
    //   setPhotos(response.data);
    // }).catch(error => {
    //   console.error(error);
    // });
  }, []);

  const handlePostPhotos = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setPhotoTitle("");
    setPhotoFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
  };

  const handlePostPhoto = () => {
    const formData = new FormData();
    formData.append("photo", photoFile);
    axios
      .post("/user/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        // Handle success
        console.log("Photo posted successfully!");
        setPhotoTitle("");
        setPhotoFile(null);
        setModalOpen(false);
        // You may want to fetch the updated list of photos from the API
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // redirect to login page after logout
  };

  return (
    <div className="vh-100" style={{ backgroundColor: "#6a11cb" }}>
      <MDBNavbar light bgColor="light">
        <MDBContainer fluid>
          <MDBNavbarBrand>Home</MDBNavbarBrand>
          <MDBBtn color="primary" onClick={handlePostPhotos}>
            Post Photos
          </MDBBtn>
          <MDBBtn color="danger" onClick={handleLogout}>
            Logout
          </MDBBtn>
        </MDBContainer>
      </MDBNavbar>

      <MDBContainer fluid>
        <MDBRow className="mt-4">
          {/* Display photos */}
          {/* Example: photos.map(photo => <img key={photo.id} src={photo.url} alt={photo.title} />) */}
        </MDBRow>
      </MDBContainer>

      {/* Modal for posting photos */}
      <MDBModal show={modalOpen} onHide={handleCloseModal}>
        <MDBModalHeader>
          <h5 className="fw-bold">Post Photo</h5>
        </MDBModalHeader>
        <MDBModalBody>
          <MDBInput type="file" label="Photo" onChange={handleFileChange} />
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="secondary" onClick={handleCloseModal}>
            Cancel
          </MDBBtn>
          <MDBBtn color="primary" onClick={handlePostPhoto}>
            Post
          </MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    </div>
  );
}

export default Home;
