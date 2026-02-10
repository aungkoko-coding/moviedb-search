"use client";
import BSGridItem from "@/components/utils/items/BSGridItem";
import PlayTrailerButton from "@/components/utils/PlayTrailerButton";
import ReadMoreLess from "@/components/utils/ReadMoreLess";
import useLoadingIndicatorToggler from "@/utils/custom-hooks/useLoadingIndicatorToggler";
import { formatDisplayDate } from "@/utils/format-date";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { SeasonType } from "./tvshow-type";

export default function SeasonOverviewItem({
  tvShowId,
  tvShowName,
  imgBgDefault,
  showPremiereDesc,
  data: {
    name,
    overview,
    air_date,
    vote_average,
    episode_count,
    season_number,
    poster_path,
  },
}: {
  tvShowId: string;
  imgBgDefault?: boolean;
  tvShowName: string;
  data: SeasonType;
  showPremiereDesc?: boolean;
}) {
  const imgSrc = `https://image.tmdb.org/t/p/w300${poster_path}`;
  const premiereDesc = `Season ${season_number} of ${tvShowName} premiered on ${formatDisplayDate(
    air_date!,
  )}`;
  const { openLoadingIndicator } = useLoadingIndicatorToggler();
  const [readMore, setReadMore] = useState(false);

  return (
    <Box my={2}>
      <Box component="div" className="row">
        <BSGridItem>
          <Box
            component={Link}
            prefetch={false}
            onClick={openLoadingIndicator}
            href={`/tvshow-detail/${tvShowId}/season/${season_number}`}
            sx={{
              display: "block",
              position: "relative",
              width: "100%",
              backgroundColor: imgBgDefault
                ? "background.default"
                : "background.paper",
              height: { xs: 170, sm: 200, md: 220, lg: 240, xl: 250 },
            }}
          >
            {poster_path ? (
              <img
                src={imgSrc}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                  borderRadius: 6,
                }}
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
        </BSGridItem>
        <Box component="div" className="col">
          <Box height={1}>
            <Typography variant="h6">{name}</Typography>
            <Box display="flex" alignItems="center" gap={1} my={1}>
              <Box
                component="div"
                className="user_score-wrapper"
                sx={{ position: "static" }}
              >
                <Typography
                  className="user_score"
                  variant="body2"
                  component="span"
                >
                  {vote_average.toFixed(1)}
                </Typography>
              </Box>
              <Typography variant="body2">
                {air_date
                  ? `${
                      showPremiereDesc
                        ? new Date(air_date).getFullYear()
                        : air_date.replaceAll("-", "/")
                    }`
                  : ""}{" "}
                {episode_count ? `• ${episode_count} Episodes` : ""}
              </Typography>
            </Box>
            {showPremiereDesc && (
              <Typography color="action.active" my={2} fontWeight={400}>
                {premiereDesc}
              </Typography>
            )}
            <Typography color="action.active" fontWeight={300}>
              {overview ? (
                <ReadMoreLess
                  maxLengthLimit={170}
                  totalContentLengthToDisplay={150}
                  content={overview}
                />
              ) : (
                !showPremiereDesc && premiereDesc
              )}
            </Typography>
            <PlayTrailerButton
              url={`/api/trailer/tvshow/${tvShowId}/season/${season_number}`}
              buttonProps={{
                sx: { mt: 1 },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
