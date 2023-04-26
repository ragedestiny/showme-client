import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function FadeMenu(props) {
  // keep track of display state - initialize with Random
  const [display, setDisplay] = useState("Random");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    setAnchorEl(null);
    const filter = event.currentTarget?.getAttribute("type");
    // set dropdown menu display to selected
    if (filter) {
      setDisplay(filter);
    }

    // get randomize sentences if random is selected
    if (filter === "Random") props.randomize();

    // get newest sentences if newest is selected
    if (filter === "Newest") props.newest();
  };

  // react component for dropdown menu for displaying approved sentences
  return (
    <div>
      <Button
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {display}
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disableScrollLock={true}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleClose} type="Random">
          Random
        </MenuItem>
        <MenuItem onClick={handleClose} type="Newest">
          Newest
        </MenuItem>
      </Menu>
    </div>
  );
}
