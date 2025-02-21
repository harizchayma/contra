import React, { useEffect, useState, useContext, useMemo } from "react";
import { Avatar, Box, IconButton, Typography, useTheme, Skeleton } from "@mui/material";
import { tokens } from "../../../theme";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  DashboardOutlined,
  MenuOutlined,
  PeopleAltOutlined,
  DirectionsCar, 
  PersonOutline,
  InfoOutlined,
  CategoryOutlined,
} from "@mui/icons-material";
import logo from "../../../assets/images/nom.png"; 
import chayma from "../../../assets/images/imagechayma.jpeg";
import { ToggledContext } from "../../../App";
import Item from "./Item";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const [userName, setUserName] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [openInfo, setOpenInfo] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUserName(userData.name);
      setUserRole(userData.role || "Utilisateur");

      const userId = userData.id;
      if (userId) {
        fetch(`/api/user/image/${userId}`)
          .then(response => response.json())
          .then(data => {
            if (data.imageUrl) {
              setUserImage(data.imageUrl);
            }
          })
          .catch(error => {
            console.error("Error fetching user image:", error);
            setUserImage(chayma); // Fallback image in case of error
          });
      }
    }
  }, []);

  const menuItemStyles = useMemo(() => ({
    button: { ":hover": { color: "#868dfb", background: "transparent", transition: ".4s ease" } }
  }), []);

  return (
    <Sidebar
      backgroundColor={colors.primary[400]}
      rootStyles={{ border: 0, height: "100%", width: collapsed ? "5%" : "15%" }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
    >
      <Menu menuItemStyles={{ button: { ":hover": { background: "transparent" } } }}>
        <MenuItem rootStyles={{ margin: "40px 0 100px 0", color: colors.gray[100] }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {!collapsed && (
              <Box display="flex" alignItems="center" gap="10px">
                <img style={{ width: "230px", height: "260px" }} src={logo} alt="Logo" />
              </Box>
            )}
            <IconButton onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Ouvrir la barre latérale" : "Fermer la barre latérale"}>
              <MenuOutlined />
            </IconButton>
          </Box>
        </MenuItem>
      </Menu>

      {!collapsed && (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", mb: "25px" }}>
          {userImage || userRole ? (
            <Avatar 
              alt="avatar" 
              src={userRole?.toLowerCase() === "admin" ? chayma : userImage} 
              sx={{ width: "150px", height: "150px" }} 
            />
          ) : (
            <Skeleton variant="circular" width={200} height={200} />
          )}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" fontWeight="bold" color="#302855">
              {userRole || <Skeleton width={100} />}
            </Typography>
            <Typography variant="h2" fontWeight="bold" color="#5271ff">
              {userName || <Skeleton width={150} />}
            </Typography>
          </Box>
        </Box>
      )}

      <Box mb={5} pl={collapsed ? undefined : "5%"}>
        <Menu menuItemStyles={menuItemStyles}>
          <Item title="Dashboard" path="/" colors={colors} icon={<DashboardOutlined />} sx={{ fontSize: "30px", fontWeight: "bold" }} />
          <MenuItem 
            onClick={() => setOpenInfo(!openInfo)} 
            style={{ color: colors.gray[100], fontSize: "30px", fontWeight: "bold" }} 
            icon={<InfoOutlined />}
          >
            Information
          </MenuItem>
          {openInfo && (
            <>
              <Item title="Client" path="/client" colors={colors} icon={<PeopleAltOutlined />} sx={{ fontSize: "10px" }} />
              <Item title="Véhicules" path="/vehicules" colors={colors} icon={<DirectionsCar />} sx={{ fontSize: "10px" }} />
              <Item title="Catégorie" path="/categorie" colors={colors} icon={<CategoryOutlined />} sx={{ fontSize: "10px" }} />
              <Item title="Contrat" path="/contrat" colors={colors} icon={<PeopleAltOutlined />} sx={{ fontSize: "10px" }} />
            </>
          )}
          <Item title="Utilisateur" path="/utilisateur" colors={colors} icon={<PersonOutline />} sx={{ fontSize: "30px", fontWeight: "bold" }} />
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default SideBar;