import useLoadingIndicatorToggler from "@/utils/custom-hooks/useLoadingIndicatorToggler";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { CastType } from "../Casts";

export default function CastItem({
  data: { id, profile_path, name, character },
}: {
  data: CastType;
}) {
  const imgSrc = `https://image.tmdb.org/t/p/w300${profile_path}`;
  const personLink = `/person-detail/${id}-${name
    .toLowerCase()
    .replaceAll(" ", "-")}`;
  const { openLoadingIndicator } = useLoadingIndicatorToggler();
  return (
    <Box mb={4}>
      <Box
        sx={{
          display: "flex",
          width: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Box
          onClick={openLoadingIndicator}
          component={Link}
          prefetch={false}
          href={personLink}
          sx={{
            position: "relative",
            width: "100%",
            backgroundColor: "background.paper",
            height: { xs: 170, sm: 200, md: 220, lg: 240, xl: 250 },
          }}
        >
          {profile_path ? (
            <img
              src={imgSrc}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              alt={name}
              title={name}
            />
          ) : (
            <Box
              width={1}
              height={1}
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{
                color: "text.primary",
              }}
            >
              <ImageNotSupportedIcon fontSize="large" />
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 1, width: 1 }}>
          <Typography variant="body1" noWrap>
            {name}
          </Typography>
          <Typography variant="body2" noWrap>
            {character}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
