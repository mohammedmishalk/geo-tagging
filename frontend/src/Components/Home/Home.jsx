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
import {config} from "../../Helpers/axiosUserToken"
import Spinner from '../spinner/spinner';


function Home() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [Location, setLocation] = useState(null);
  const [first, setfirst] = useState(false)
  const [filteredPhotos, setFilteredPhotos] = useState([]);
  const [filterLocation, setFilterLocation] = useState("");
  const [loading, setLoading] = useState(false);
 
 
 
  // const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");


  useEffect(() => {
    // Fetch photos from API or any other data source
    // Update the 'photos' state with the fetched photos
    // Example:
    setLoading(true);
     axios.get('/user/getimage',config).then(response => {
      setPhotos(response.data.images);
      setFilteredPhotos(response.data.images);
      setLoading(false);
    }).catch(error => {
      console.error(error);
      setLoading(false);
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


  
  const handleFilterChange = (e) => {
    const location = e.target.value;
    setFilterLocation(location);

    // Filter the photos based on the location
    const filtered = photos.filter((photo) =>
      photo.location.includes(location)
    );
    setFilteredPhotos(filtered);
  };

  const handlePostPhoto = () => {
    const formData = new FormData();
    formData.append("photo", photoFile);
    formData.append("name", name);
    if (userLocation) {
      
      formData.append("Location", Location); // Use the address obtained from getGeolocation
      setLoading(true);
      axios
        .post("/user/photo", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },...config,
        })
        .then((response) => {
          // Handle success
          console.log("Photo posted successfully!");
          setPhotoTitle("");
          setPhotoFile(null);
          setModalOpen(false);
          setfirst(!first);
          setLoading(false);

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


    <>
    {loading ? (
      <Spinner loading={loading} />
    ) : (
    <div className="vh-100" style={{ backgroundColor: "#6a11cb" }}>
      
      <MDBNavbar light bgColor="light">
        <MDBContainer fluid>
          <MDBNavbarBrand>Home</MDBNavbarBrand>
          <input
        type="text"
        placeholder="Filter by location"
        value={filterLocation}
        onChange={handleFilterChange}
      />
          <MDBBtn color="primary" onClick={handlePostPhotos}>
            Post Photos
          </MDBBtn>
          <MDBBtn color="danger" onClick={handleLogout}>
            Logout
          </MDBBtn>
        </MDBContainer>
      </MDBNavbar>
      <MDBRow className="mt-4">
        {filteredPhotos.map((photo) => (
          <MDBCol key={photo.id} md="3">
            <div>
              <img
                src={photo.image[0].url}
                alt={photo.image[0].filename}
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                  margin: "5px",
                }}
              />
              <p>Post By {name} Time {new Date(photo.createdAt).toLocaleTimeString()}</p>
              <p>
                {photo.location.split(",")[0]}, {photo.location.split(",")[1]}
              </p>
            </div>
          </MDBCol>
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
    )}
    </>
  );
}

export default Home;
