export interface Movie {
  id: number;
  title: string;
  // _ID: string;
  land: string;
  year: number;
  typename: string;
  shortdescription: string;
  imageurl: string;
  upcoming: boolean;
  tmdb_id: number;
  created_at: Date;
  updated_at: Date;
  originaltitle: string;
  genres: string;
  runtime: number;
}
