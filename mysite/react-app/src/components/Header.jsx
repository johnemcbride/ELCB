import * as React from "react";
import { router } from '@inertiajs/react'
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import { Link, useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import useTheme from "@mui/material/styles/useTheme";
import { ListItemIcon } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import PaidIcon from "@mui/icons-material/Paid";
import SupportIcon from "@mui/icons-material/Support";

export default function Header({ groups }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // header menu config

  const navConfig = [

    {
      label: "My Enrolment",
      icon: <MusicNoteIcon />,
      path: "/",
    },
    {
      label: "Profile",
      icon: <AccountCircleIcon />,
      path: "/profile",
    },
    {
      label: "Admin",
      icon: <AdminPanelSettingsIcon />,
      group: "Admin",
      children: [
        {
          label: "Enrolments",
          icon: <PaidIcon />,
          path: "/cms",
        },
        {
          label: "Payment Holidays",
          icon: <SupportIcon />,
          path: "/cms",
        },

        {
          label: "Members",
          icon: <PersonSearchIcon />,
          path: "/cms",
        },
      ],
    },

    {
      label: "Logout",
      icon: <LogoutIcon />,
      path: "/signout",
    }
  ];
  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        zIndex: 1400,
      }}
    >
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <Link color="text.primary" to="/" sx={{ my: 1, mx: 1.5 }}>
          <Box
            component="img"
            sx={{
              height: 64,
              marginY: 1,
            }}
            alt="East London Community Band Logo"
            src="/static/elcblogo.png"
          />
        </Link>
        <Typography
          variant="h6"
          color="inherit"
          sx={{ flexGrow: 1 }}
        ></Typography>
        {isMobile ? (
          <DrawerComponent config={navConfig} groups={groups} />
        ) : (
          <List sx={{ display: 'flex' }}>
            {navConfig
              .filter((item) => !item.group || groups.includes(item.group))
              .map((item, index) => (
                <MenuItemWithChildren key={index} item={item} />
              ))}
          </List>
        )}
      </Toolbar>
    </AppBar>
  );
}



function MenuItemWithChildren({ item, onClick }) {
  const { label, icon, path, children } = item;
  const [openSubMenu, setOpenSubMenu] = React.useState(false);

  const handleSubMenuToggle = () => {
    setOpenSubMenu(!openSubMenu);
  };



  const navigate = useNavigate();
  const handleClick = (event) => {
    if (path) {
      // If the item has a path, navigate to it
      // You can handle navigation as per your application's routing logic
      if (typeof onClick === 'function') {
        onClick()
      }
      router.visit(path);

    } else {
      // Toggle submenu if there are children
      handleSubMenuToggle();
    }
  };

  return (
    <React.Fragment>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
        {children && (
          <IconButton onClick={handleSubMenuToggle}>
            {openSubMenu ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
        )}
      </ListItem>
      {children && (
        <Collapse in={openSubMenu} timeout="auto" unmountOnExit>
          <List disablePadding>
            {children.map((child, index) => (
              <ListItem
                key={index}
                variant="button"
                color="text.primary"
                component={Link}
                to={child.path}

                sx={{ pl: 4, backgroundColor: 'white' }}
              >

                <ListItemIcon>{child.icon}</ListItemIcon>
                <ListItemText>{child.label}</ListItemText>

              </ListItem>
            ))}
          </List>
        </Collapse>
      )}
    </React.Fragment>
  );
}
function DrawerComponent({ config, groups }) {
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const handleDrawerToggle = () => {
    setOpenDrawer(!openDrawer);
  };

  return (
    <>
      <Drawer
        color="default"
        anchor="top"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        sx={{ zIndex: 1500 }}
      >
        <List>


          {config
            .filter((item) => !item.group || groups.includes(item.group))
            .map((item, index) => (
              <MenuItemWithChildren key={index} item={item} />
            ))}


        </List>
      </Drawer>
      <IconButton onClick={handleDrawerToggle}>
        <MenuIcon />
      </IconButton>
    </>
  );
}
