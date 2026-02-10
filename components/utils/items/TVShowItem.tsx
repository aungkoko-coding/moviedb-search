import useLoadingIndicatorToggler from "@/utils/custom-hooks/useLoadingIndicatorToggler";
import { formatDisplayDate } from "@/utils/format-date";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

export type TVShowItemDataType = {
  id: number;
  poster_path: string;
  name: string;
  original_name: string;
  vote_average: number;
  first_air_date: string;
};
export type TVShowItemProps = {
  defaultBg?: boolean;
  data: TVShowItemDataType;
};
export default function TVShowItem({
  defaultBg,
  data: { id, poster_path, name, original_name, vote_average, first_air_date },
}: TVShowItemProps) {
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
            backgroundColor: defaultBg
              ? "background.default"
              : "background.paper",
            height: { xs: 170, sm: 200, md: 220, lg: 240, xl: 250 },
          }}
        >
          {poster_path ? (
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
          <Box component="div" className="user_score-wrapper">
            <Typography className="user_score" variant="body2" component="span">
              {vote_average.toFixed(1)}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 1, width: 1 }}>
          <Typography variant="body1" noWrap>
            {name}
          </Typography>
          {first_air_date && (
            <Typography variant="body2">
              {formatDisplayDate(first_air_date)}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
