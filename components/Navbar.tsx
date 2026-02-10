"use client";
import useAuthStatus from "@/utils/custom-hooks/useAuthStatus";
import useLoadingIndicatorToggler from "@/utils/custom-hooks/useLoadingIndicatorToggler";
import useSearchFilter from "@/utils/custom-hooks/useSearchFilter";
import menus from "@/utils/menus";
import CloseIcon from "@mui/icons-material/Close";
import MuiExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Box,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  styled,
  SxProps,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { getProviders, signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  forwardRef,
  MouseEventHandler,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react";
import MyDrawer from "./utils/MyDrawer";
import MyMenu from "./utils/MyMenu";
import WatchListLinkButton from "./WatchListLinkButton";

const ExpandMoreIcon = styled(MuiExpandMoreIcon)<{ open: boolean }>(
  ({ open, theme }) => ({
    fontSize: "1.4rem",
    marginLeft: "2px",
    transition: theme.transitions.create("all"),
    ...(open && {
      transform: "rotate(180deg)",
    }),
  }),
);

type NavMenuProps = {
  children: React.ReactNode;
  active: boolean;
  typographySx?: SxProps;
  containerSx?: SxProps;
  onClick: MouseEventHandler<HTMLDivElement>;
};

export type MenuType = keyof typeof menus;

const NavMenu = forwardRef<HTMLDivElement, NavMenuProps>((props, ref) => {
  const { children, active, typographySx, containerSx, onClick } = props;
  return (
    <Box
      onClick={onClick}
      component="div"
      ref={ref}
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        ...containerSx,
      }}
    >
      <Typography
        variant="body1"
        sx={{
          userSelect: "none",
          ...typographySx,
          ...(active && {
            fontWeight: 700,
          }),
        }}
      >
        {children}
      </Typography>
      <ExpandMoreIcon open={active} color="inherit" />
    </Box>
  );
});
NavMenu.displayName = "NavMenu";

const filter = createFilterOptions<string>();

export const searchIndicatorKey = "search-indicator";

export default function Navbar() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openSearchBox, setOpenSearchBox] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [query, setQuery] = useState<string | null>(null);
  const [inputQuery, setInputQuery] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);
  // const [authenticating, setAuthenticating] = useState(true);
  const { authenticating } = useAuthStatus();
  const [menuAnchorEl, setMenuAnchorEl] = useState<{
    el: HTMLElement;
    menuName: MenuType;
  } | null>(null);
  const [profileImageEl, setProfileImageEL] = useState<HTMLImageElement | null>(
    null,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const openMenu = Boolean(menuAnchorEl && menuAnchorEl.el);
  const { openLoadingIndicator } = useLoadingIndicatorToggler();
  const pathname = usePathname();
  const mainSegment = pathname.split("/")[1];

  const [providers, setProviders] = useState<any>(null);
  const { data: session } = useSession();
  const { searchFor, searchResultPage } = useSearchFilter();

  const user = session?.user;

  useEffect(() => {
    const initProviders = async () => {
      const response = await getProviders();

      setProviders(response);
    };

    initProviders();
  }, []);

  const toggleSearchBox = () => {
    if (!pathname.includes("/search")) {
      setQuery("");
    }
    setOpenSearchBox((prev) => !prev);
  };

  const toggleDrawer = () => {
    setOpenDrawer((prev) => !prev);
  };

  const handleClose = () => {
    setOpenDrawer(false);
  };

  const handleMenuOpen = (event: any, menuName: keyof typeof menus) => {
    setMenuAnchorEl({ el: event.currentTarget as HTMLElement, menuName });
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLImageElement>) => {
    setProfileImageEL(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileImageEL(null);
  };
  useEffect(() => {
    openSearchBox && inputRef.current?.focus();
  }, [openSearchBox]);

  const deferredQuery = useDeferredValue<string | undefined>(inputQuery);
  const prevDeferredQuery = useRef(deferredQuery);

  useEffect(() => {
    const abortController = new AbortController();

    if (prevDeferredQuery.current !== deferredQuery) {
      prevDeferredQuery.current = deferredQuery;
      setLoading(true);
      fetch(
        `/api/search${
          searchFor === "all" || searchResultPage === "v1"
            ? ""
            : `/${searchFor}`
        }?query=${deferredQuery}`,
        {
          signal: abortController.signal,
        },
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          const options = data.results.map(
            (res: { name?: string; title?: string }) => res.name || res.title,
          );
          setOptions(Array.from(new Set(options)));
          setLoading(false);
        })
        .catch((err: Error) => {
          if (err.name !== "AbortError") {
            setLoading(false);
          }
        });
    }

    return () => {
      abortController.abort();
    };
  }, [deferredQuery, searchFor, searchResultPage]);

  return (
    <AppBar position="sticky" sx={{ top: 0 }} elevation={1}>
      <Container>
        <Toolbar component="nav" sx={{ columnGap: 2 }} disableGutters>
          <IconButton
            onClick={toggleDrawer}
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ display: { xs: "block", md: "none" }, flex: "0 0 auto" }}
          >
            <MenuIcon />
          </IconButton>
          <MyDrawer open={openDrawer} onClose={handleClose} />

          <Box
            sx={{
              flex: "1 1 0",
              display: "flex",
              alignItems: "center",
              columnGap: 2,
            }}
          >
            <Box
              component={Link}
              prefetch={false}
              href="/"
              sx={{ mx: { xs: "auto", md: 0 } }}
            >
              <Image src="/icon.png" alt="App logo" width={32} height={32} />
            </Box>

            <Box sx={{ display: { xs: "none", md: "flex" }, columnGap: 2 }}>
              {Object.keys(menus).map((menu) => {
                const active =
                  mainSegment &&
                  ((pathname === "/person" && menu === "People") ||
                    new RegExp(mainSegment, "i").test(
                      menu.replace(" ", "").toLowerCase(),
                    ));
                return (
                  <NavMenu
                    key={menu}
                    active={!!(menuAnchorEl && menuAnchorEl.menuName === menu)}
                    onClick={(e) => handleMenuOpen(e, menu as MenuType)}
                    containerSx={{
                      ...(active && { color: "primary.main" }),
                    }}
                  >
                    {menu}
                  </NavMenu>
                );
              })}
              <MyMenu
                open={openMenu}
                onClose={handleMenuClose}
                anchorEl={menuAnchorEl && menuAnchorEl.el}
                mainMenu={menuAnchorEl && menuAnchorEl.menuName}
              />
            </Box>
          </Box>

          <Box
            sx={{
              flex: "0 0 auto",
              display: "flex",
              alignItems: "center",
              columnGap: 1,
            }}
          >
            {user && <WatchListLinkButton />}
            {!user && !authenticating && (
              <Chip
                color="primary"
                label="Sign in"
                icon={<LoginIcon fontSize="small" />}
                onClick={() => signIn()}
              />
            )}
            <IconButton onClick={toggleSearchBox}>
              {openSearchBox ? <CloseIcon /> : <SearchIcon />}
            </IconButton>
            {!user && authenticating && (
              <Skeleton
                width={35}
                height={35}
                variant="circular"
                animation="wave"
              />
            )}
            {user && (
              <>
                <Box
                  component="img"
                  src={user?.image!}
                  alt="Profile"
                  width={35}
                  height={35}
                  onClick={handleProfileMenuOpen}
                  sx={{
                    borderRadius: "50%",
                    border: 2,
                    p: 0.2,
                    cursor: "pointer",
                    borderColor: "primary.dark",
                  }}
                />
                <Menu
                  autoFocus={false}
                  anchorEl={profileImageEl}
                  open={Boolean(profileImageEl)}
                  onClose={handleProfileMenuClose}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  sx={{
                    "& .MuiPaper-root": {
                      borderTopRightRadius: 0,
                      borderTopLeftRadius: 0,
                      borderTop: 3,
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <MenuItem onClick={() => signOut()}>
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        columnGap: 1,
                      }}
                      variant="body2"
                    >
                      <LogoutIcon fontSize="inherit" /> Logout
                    </Typography>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>

      <Box
        component="div"
        className="search-box"
        display={openSearchBox ? "block" : "none"}
        sx={{
          background: (theme) => theme.palette.background.default,
        }}
      >
        <Autocomplete
          loading={loading}
          autoFocus
          freeSolo
          selectOnFocus
          handleHomeEndKeys
          options={options}
          value={query}
          inputValue={inputQuery}
          onChange={(_event, newValue) => {
            setQuery(newValue);
            if (newValue) {
              setOpenSearchBox(false);
              openLoadingIndicator();
              const searchResultPageUrlForV1 = `/search?query=${newValue}`;
              const searchResultPageUrlForV2 = `/search/v2${
                searchFor === "all" ? "" : `/${searchFor}`
              }?query=${newValue}`;
              router.push(
                searchResultPage === "v2"
                  ? searchResultPageUrlForV2
                  : searchResultPageUrlForV1,
              );
            }
          }}
          onInputChange={(_e, newInput) => {
            setInputQuery(newInput);
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            const { inputValue } = params;
            // Suggest the creation of a new value
            const isExisting = options.some((option) => inputValue === option);
            if (inputValue !== "" && !isExisting) {
              filtered.push(inputValue);
            }

            return filtered;
          }}
          renderOption={(props, option) => {
            return (
              <Box component="li" {...props}>
                <SearchIcon sx={{ mr: 1 }} /> {option}
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: 0,
                },
              }}
              placeholder="Search movies, shows and people..."
              InputProps={{
                ...params.InputProps,
                inputRef: inputRef,
                startAdornment: <SearchIcon />,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Box>
    </AppBar>
  );
}
