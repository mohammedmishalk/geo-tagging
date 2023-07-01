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
  const [userLocation, setUserLocation] = useState(null);
  const [Location, setLocation] = useState(null);
  const [first, setfirst] = useState(false)
  console.log(photos)
//  const latitude = '11.2475528';
//  const longitude = '75.8341161';
  useEffect(() => {
    // Fetch photos from API or any other data source
    // Update the 'photos' state with the fetched photos
    // Example:
     axios.get('/user/getimage').then(response => {
      setPhotos(response.data.images);
   
    }).catch(error => {
      console.error(error);
    });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        error => {
          console.error(error);
        }
      );
    }
  }, [first]);


  const getGeolocation = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
  
      if (response.data) {
        const address = response.data.display_name;
        setLocation(address);
      } else {
        console.log('No results found');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePostPhotos = () => {
    setModalOpen(true);
    const { latitude, longitude } = userLocation;
    getGeolocation(latitude, longitude)
    
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

  //   const formData = new FormData();
  //   formData.append("photo", photoFile);

  //   if (userLocation) {
  //     const { latitude, longitude } = userLocation;
  //     getGeolocation(latitude, longitude);
  //   }

  //   axios
  //     .post("/user/photo", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     })
  //     .then((response) => {
  //       // Handle success
  //       console.log("Photo posted successfully!");
  //       setPhotoTitle("");
  //       setPhotoFile(null);
  //       setModalOpen(false);
  //       // You may want to fetch the updated list of photos from the API
  //     })
  //     .catch((error) => {
  //       // Handle error
  //       console.error(error);
  //     });
  // };

  const handlePostPhoto = () => {
    const formData = new FormData();
    formData.append("photo", photoFile);
  
    if (userLocation) {
      
      formData.append("Location", Location); // Use the address obtained from getGeolocation
  
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
          setfirst(!first);
          // You may want to fetch the updated list of photos from the API
        })
        .catch((error) => {
          // Handle error
          console.error(error);
        });
    } else {
      // If userLocation is not available, you can handle it accordingly
      console.log("User location not available");
    }
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

      <MDBRow className="mt-4">
  {photos.map((photo) => (
    <img
     
      src={photo.image[0].url} // Access the URL from the first image object in the array
      alt={photo.image[0].filename} // Access the filename from the first image object in the array
      style={{ width: "200px", height: "200px", objectFit: "cover", margin: "5px" }}
    />
  ))}
</MDBRow>

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
