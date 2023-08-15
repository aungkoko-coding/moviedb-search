//https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=false&language=en-US&page=1&release_date.gte=2023-08-15&release_date.lte=2023-08-15&sort_by=popularity.desc&with_release_type=2%7C3import fetchData from "@/config/fetch";
import { NextResponse } from "next/server";
import fetchData from "@/config/fetch";
import formatDate from "@/utils/format-date";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { releaseType: "digital" | "theatrical" } }
) {
  const currentDate = formatDate(new Date());

  const releaseType = params.releaseType === "digital" ? "4" : "2|3";
  let urlParams =
    params.releaseType === "digital"
      ? `release_date.lte=${currentDate}`
      : `release_date.gte=${currentDate}&release_date.lte=${currentDate}`;
  const uri = `/discover/movie?include_adult=true&include_video=false&language=en-US&page=1&${urlParams}&sort_by=popularity.desc&with_release_type=${releaseType}`;

  const res = await fetchData(uri);
  const data = await res.json();
  // console.log("fetching trend data", { uri, data });
  return NextResponse.json(data);
}