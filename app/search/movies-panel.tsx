import { Box } from "@mui/material";
import { TabPanelProps } from "./tabs";
import MovieResultItem from "./item/movie-res-item";

export default function MoviesPanel(props: TabPanelProps) {
  const { data, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      aria-hidden={value !== index}
      id={`movies-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box>
        <Box component="div" className="row g-2">
          {data.results?.map((res) => (
            <Box
              component="div"
              className="col-12 col-sm-6 col-lg-4"
              key={res.id}
            >
              <MovieResultItem movie={res} />
            </Box>
          ))}
        </Box>
      </Box>
    </div>
  );
}