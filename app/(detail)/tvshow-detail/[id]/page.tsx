import fetchData from "@/config/fetch";
import type { Metadata } from "next";
import { Box, Container, Typography, Button, Chip } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { notFound } from "next/navigation";
import FetchedDetector from "@/components/utils/FetchedDetector";
import GradientBackground from "@/components/utils/GradientBackground";
import Media from "../../Media";
import AddToWatchListButton from "@/components/utils/AddToWatchListButton";
import { CreditsType, CrewType } from "@/components/utils/Credits";
import Casts, { CastsType } from "@/components/utils/Casts";
import Recommendations from "@/components/recommendations/Recommendations";
import { Suspense } from "react";
import SingleRowSkeleton from "@/components/skeletons/SingleRowSkeleton";
import StreamRecommendations from "@/components/recommendations/StreamRecommendations";
import { TVShowDetailType } from "../tvshow-type";

type Props = {
  params: { id: string };
};

export async function generateStaticParams(): Promise<{ id: string }[]> {
  const trendTVShowsResult = await fetchData(
    "/trending/tv/day?language=en-US"
  ).then((res) => res.json());
  const trendTVShows = trendTVShowsResult?.results;

  return trendTVShows.map(({ id, name }: any) => ({
    id: `${id}-${name.toLowerCase().replaceAll(" ", "-")}`,
  }));
}

export const generateMetadata = async ({
  params: { id },
}: Props): Promise<Metadata> => {
  const tvShowId = id.split("-")[0];
  const tvShow: TVShowDetailType = await fetchData(`/tv/${tvShowId}`).then(
    (res) => {
      if (!res.ok) {
        notFound();
      }
      return res.json();
    }
  );

  const tvShowName = tvShow.name;
  const tvShowDescription =
    tvShow?.overview || tvShow?.tagline || "TV Show description";
  const backdropPath = tvShow.backdrop_path;

  return {
    title: tvShowName,
    description: tvShowDescription,
    openGraph: {
      title: tvShowName,
      description: tvShowDescription,
      images: backdropPath
        ? `https://image.tmdb.org/t/p/w1280/${backdropPath}`
        : "/opengraph-image.png",
    },
  };
};

export const revalidate = 1800;

export default async function TVShow({ params: { id } }: Props) {
  const tvShowId = id.split("-")[0];
  const {
    name,
    backdrop_path,
    poster_path,
    tagline,
    overview,
    vote_average,
    episode_run_time,
    created_by,
    genres,
    first_air_date,
    last_air_date,
    spoken_languages,
    status,
  }: TVShowDetailType = await fetchData(`/tv/${tvShowId}`).then((res) =>
    res.json()
  );

  const credits: CreditsType = await fetchData(
    `/tv/${tvShowId}/credits?language=en-US`
  ).then((res) => res.json());

  const casts: CastsType = credits.cast;

  console.log("generating page for", id);

  return (
    <Box position="relative">
      <Box
        component="div"
        className="background-ani"
        sx={{
          width: 1,
          backgroundImage: `url(https://image.tmdb.org/t/p/w1280${backdrop_path})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          borderBottom: "solid 1px",
          borderBottomColor: "primary.main",
        }}
      >
        <GradientBackground
          darker
          sx={{
            display: "flex",
            alignItems: "center",
            minHeight: 350,
          }}
        >
          <Container>
            <Box my={{ xs: 0, md: 2 }}>
              <Box component="div" className="row g-5">
                <Box
                  component="div"
                  className="col-12 col-md-auto"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Media
                    poster_path={poster_path}
                    alt={name}
                    sx={{ my: { xs: 2, md: 0 } }}
                  />
                </Box>
                <Box component="div" className="col-12 col-md">
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {name}
                    </Typography>

                    <Box my={1}>
                      <Typography variant="body2">
                        {first_air_date?.replaceAll("-", "/")} -{" "}
                        {last_air_date?.replaceAll("-", "/")}{" "}
                        {status ? `• ${status}` : ""}{" "}
                        {spoken_languages && spoken_languages.length > 0
                          ? `• ${spoken_languages
                              .map((sp: any) => sp.english_name)
                              .join(", ")}`
                          : ""}
                      </Typography>
                    </Box>

                    <Box
                      display="flex"
                      alignItems="center"
                      flexWrap="wrap"
                      columnGap={1}
                      my={1}
                    >
                      {genres?.map((genre) => (
                        <Chip
                          size="small"
                          key={genre.id}
                          label={genre.name}
                          variant="outlined"
                        />
                      ))}
                    </Box>

                    <Box
                      display="flex"
                      alignItems="center"
                      columnGap={1}
                      my={2}
                    >
                      <Chip
                        label={vote_average?.toFixed(1)}
                        color="secondary"
                      />

                      <AddToWatchListButton />

                      <Button
                        startIcon={<PlayArrowIcon />}
                        color="inherit"
                        variant="outlined"
                      >
                        Play Trailer
                      </Button>
                    </Box>

                    <Typography color="text.secondary" my={2}>
                      {tagline}
                    </Typography>
                    <Box my={2}>
                      <Typography variant="h6">Overview</Typography>
                      <Typography color="action.active" fontWeight={300}>
                        {overview}
                      </Typography>
                      <Box my={2}>
                        <Typography>
                          Creator(s) :{" "}
                          {created_by?.length
                            ? created_by.map((c) => c.name).join(", ")
                            : "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Container>
        </GradientBackground>
      </Box>

      <Casts casts={casts} id={id} type="tv" />

      <Recommendations>
        <Suspense fallback={<SingleRowSkeleton />}>
          <StreamRecommendations type="tv" id={tvShowId} />
        </Suspense>
      </Recommendations>
      <FetchedDetector />
    </Box>
  );
}
