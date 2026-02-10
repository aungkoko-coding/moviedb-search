import useLoadingIndicatorToggler from "@/utils/custom-hooks/useLoadingIndicatorToggler";
import menus from "@/utils/menus";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  AccordionDetails,
  alpha,
  Box,
  Drawer,
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  ListItemButton as MuiListItemButton,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuType } from "../Navbar";

const drawerWidth = 260;

const Accordion = styled(MuiAccordion)({
  backgroundColor: "transparent",
  boxShadow: "none",
  "&::before": {
    display: "none",
  },
  "&.Mui-expanded": {
    margin: 0,
  },
});

const AccordionSummary = styled(MuiAccordionSummary)({
  minHeight: 50,
  maxHeight: 50,
  "&.Mui-expanded": {
    minHeight: 50,
    maxHeight: 50,
  },
});

const StyledTypography = styled(Typography)({ fontWeight: 400 });

const ListItemButton = styled(MuiListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  paddingLeft: 10,
  "&:last-of-type": {
    marginBottom: 0,
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  "&.Mui-selected": {
    color: theme.palette.primary.main,
  },
}));

function MyDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { openLoadingIndicator } = useLoadingIndicatorToggler();
  const pathname = usePathname();
  const mainSegment = pathname.split("/")[1];
  const handleClick = (shouldLoad: boolean) => {
    onClose();
    shouldLoad && openLoadingIndicator();
  };
  return (
    <Drawer
      PaperProps={{ elevation: 0 }}
      keepMounted
      sx={{
        width: drawerWidth,
        "& .MuiPaper-root": {
          width: drawerWidth,
        },
      }}
      variant="temporary"
      open={open}
      onClose={onClose}
    >
      <Toolbar />
      <Box>
        {Object.keys(menus).map((menu) => {
          const active =
            mainSegment &&
            new RegExp(mainSegment, "i").test(menu.replace(" ", ""));
          return (
            <Accordion
              elevation={0}
              key={menu}
              sx={{
                ...(active && {
                  color: "primary.main",
                }),
              }}
            >
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon color={active ? "primary" : "inherit"} />
                }
              >
                <Box display="flex" alignItems="center" columnGap={1}>
                  {menus[menu as MenuType]?.icon}
                  <StyledTypography variant="body1">{menu}</StyledTypography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ py: 0 }}>
                {menus[menu as MenuType]?.subMenus?.map(({ name, link }) => (
                  <Box
                    key={name}
                    component={Link}
                    prefetch={false}
                    href={link}
                    sx={{ color: "text.primary", textDecoration: "none" }}
                    onClick={() => handleClick(link !== pathname)}
                  >
                    <ListItemButton selected={link === pathname} sx={{ mb: 2 }}>
                      <Typography variant="body2">{name}</Typography>
                    </ListItemButton>
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Drawer>
  );
}

export default MyDrawer;
