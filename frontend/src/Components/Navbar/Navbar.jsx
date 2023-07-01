import React from 'react'

function Navbar() {
  return (
    <div>
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
    </div>
  )
}

export default Navbar
