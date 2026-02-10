import useLoadingIndicatorToggler from "@/utils/custom-hooks/useLoadingIndicatorToggler";
import { formatDisplayDate } from "@/utils/format-date";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

export type MovieItemDataType = {
  id: number;
  poster_path: string;
  title: string;
  original_title: string;
  vote_average: number;
  release_date: string;
};

export type MovieItemProps = {
  defaultBg?: boolean;
  data: MovieItemDataType;
};
export default function MovieItem({
  defaultBg,
  data: { id, poster_path, title, original_title, vote_average, release_date },
}: MovieItemProps) {
  const { openLoadingIndicator } = useLoadingIndicatorToggler();
  const imgSrc = `https://image.tmdb.org/t/p/w300${poster_path}`;
  const movieLink = `/movie-detail/${id}-${title
    .toLowerCase()
    .replaceAll(" ", "-")}`;
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
          component={Link}
          prefetch={false}
          href={movieLink}
          onClick={openLoadingIndicator}
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
              alt={title}
              title={title}
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
            {title}
          </Typography>
          {release_date && (
            <Typography variant="body2">
              {formatDisplayDate(release_date)}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
