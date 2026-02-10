import useLoadingIndicatorToggler from "@/utils/custom-hooks/useLoadingIndicatorToggler";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { CreditTVShowType } from "./combined-credits-types";

export default function CombinedCreditTVShowItem({
  data: {
    id,
    poster_path,
    name,
    original_name,
    vote_average,
    first_air_date,
    character,
  },
}: {
  data: CreditTVShowType;
}) {
  const imgSrc = `https://image.tmdb.org/t/p/w300${poster_path}`;
  const tvShowLink = `/tvshow-detail/${id}-${name
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
          href={tvShowLink}
          sx={{
            position: "relative",
            width: "100%",
            backgroundColor: "background.paper",
            height: { xs: 170, sm: 200, md: 220, lg: 240, xl: 250 },
          }}
        >
          {poster_path ? (
            <Image
              src={imgSrc}
              style={{ objectFit: "cover" }}
              alt={original_name}
              title={name}
              fill
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
          <Box component="div" className="user_score-wrapper">
            <Typography className="user_score" variant="body2" component="span">
              {vote_average?.toFixed(1)}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 1, width: 1 }}>
          <Typography variant="body1" noWrap>
            {first_air_date ? <>({first_air_date.split("-")[0]})</> : ""} {name}
          </Typography>
          <Typography variant="body2">as {character || "---"}</Typography>
        </Box>
      </Box>
    </Box>
  );
}
